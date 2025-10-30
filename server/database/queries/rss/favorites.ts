import { db } from '../../index';
import { favoriteArticle, favoriteArticleInsertSchema } from '../../schema';
import { and, eq } from 'drizzle-orm';
import { RssFeedItem } from '~~/types/rss';
import { getFavorite, setFavorite, del } from '../../../lib/redis';
import type { H3Event } from 'h3';

const invalidateFavoriteCache = async (
  userId: string,
  rssFeedItemsGuid: string,
  event?: H3Event,
) => {
  const keys = [
    `favorites:${userId}`,
    `favorite:${userId}:${rssFeedItemsGuid}`,
  ];

  if (event) {
    keys.forEach((key) => {
      event.waitUntil(del(key));
    });
  } else {
    await Promise.all(keys.map((key) => del(key)));
  }
};

export const getAllFavorites = async (userId: string) => {
  try {
    const cacheKey = `favorites:${userId}`;
    const cachedFavorites = await getFavorite(cacheKey);

    if (cachedFavorites && Array.isArray(cachedFavorites)) {
      return { data: cachedFavorites, error: null };
    }

    const res = await db
      .select()
      .from(favoriteArticle)
      .where(eq(favoriteArticle.userId, userId));

    if (Array.isArray(res)) {
      await setFavorite(cacheKey, res);
    }

    return { data: res, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: err };
  }
};

export const getFavorites = async (userId: string, articleGuid: string) => {
  try {
    const cacheKey = `favorite:${userId}:${articleGuid}`;
    const cachedFavorite = await getFavorite(cacheKey);

    if (cachedFavorite && Array.isArray(cachedFavorite)) {
      return { data: cachedFavorite, error: null };
    }

    const res = await db
      .select()
      .from(favoriteArticle)
      .where(
        and(
          eq(favoriteArticle.userId, userId),
          eq(favoriteArticle.rssFeedItemsGuid, articleGuid),
        ),
      );

    if (Array.isArray(res) && res.length > 0) {
      await setFavorite(cacheKey, res);
    }

    return { data: res, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: err };
  }
};

export const saveFavorite = async (
  userId: string,
  rssFeedItemsGuid: string,
  articleSnapshot: RssFeedItem,
  event?: H3Event,
) => {
  const validatedArticleSnapshot = favoriteArticleInsertSchema.parse({
    userId,
    rssFeedItemsGuid,
    articleSnapshot: articleSnapshot as unknown as RssFeedItem,
  });
  try {
    const savedFavorite = await db
      .insert(favoriteArticle)
      .values(validatedArticleSnapshot)
      .onConflictDoUpdate({
        target: [favoriteArticle.userId, favoriteArticle.rssFeedItemsGuid],
        set: {
          articleSnapshot: validatedArticleSnapshot.articleSnapshot,
        },
      });

    await invalidateFavoriteCache(userId, rssFeedItemsGuid, event);

    return { data: savedFavorite, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};

export const deleteFavorite = async (
  userId: string,
  rssFeedItemsGuid: string,
  event?: H3Event,
) => {
  try {
    const deletedFavorite = await db
      .delete(favoriteArticle)
      .where(
        and(
          eq(favoriteArticle.userId, userId),
          eq(favoriteArticle.rssFeedItemsGuid, rssFeedItemsGuid),
        ),
      );

    await invalidateFavoriteCache(userId, rssFeedItemsGuid, event);

    return { data: deletedFavorite, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};
