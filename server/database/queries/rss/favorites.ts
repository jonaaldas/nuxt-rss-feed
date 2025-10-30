import { db } from '../../index';
import { favoriteArticle, favoriteArticleInsertSchema } from '../../schema';
import { and, eq } from 'drizzle-orm';
import { RssFeedItem } from '~~/types/rss';
import { getFavorite, setFavorite, del } from '../../../lib/redis';
import type { H3Event } from 'h3';

export const getAllFavorites = async (userId: string) => {
  try {
    const cacheKey = `favorites:${userId}`;
    const cachedFavorites = await getFavorite(cacheKey);

    if (cachedFavorites) {
      return { data: cachedFavorites, error: null };
    }

    const res = await db
      .select()
      .from(favoriteArticle)
      .where(eq(favoriteArticle.userId, userId));

    await setFavorite(cacheKey, res);

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

    if (cachedFavorite) {
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

    if (res.length > 0) {
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
    const newFavorite = await db
      .insert(favoriteArticle)
      .values(validatedArticleSnapshot);
    
    if (event) {
      event.waitUntil(del(`favorites:${userId}`));
      event.waitUntil(del(`favorite:${userId}:${rssFeedItemsGuid}`));
    } else {
      await del(`favorites:${userId}`);
      await del(`favorite:${userId}:${rssFeedItemsGuid}`);
    }
    
    return { data: newFavorite, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};

export const saveFavoriteArticleSnapshot = async (
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
    const updatedFavoriteArticle = await db
      .update(favoriteArticle)
      .set(validatedArticleSnapshot)
      .where(
        and(
          eq(favoriteArticle.userId, userId),
          eq(favoriteArticle.rssFeedItemsGuid, rssFeedItemsGuid),
        ),
      );
    
    if (event) {
      event.waitUntil(del(`favorites:${userId}`));
      event.waitUntil(del(`favorite:${userId}:${rssFeedItemsGuid}`));
    } else {
      await del(`favorites:${userId}`);
      await del(`favorite:${userId}:${rssFeedItemsGuid}`);
    }
    
    return { data: updatedFavoriteArticle, error: null };
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
    
    if (event) {
      event.waitUntil(del(`favorites:${userId}`));
      event.waitUntil(del(`favorite:${userId}:${rssFeedItemsGuid}`));
    } else {
      await del(`favorites:${userId}`);
      await del(`favorite:${userId}:${rssFeedItemsGuid}`);
    }
    
    return { data: deletedFavorite, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};
