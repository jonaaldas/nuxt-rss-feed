import { db } from "../../index";
import {
  favoriteArticle,
  FavoriteArticleColumns,
  favoriteArticleInsertSchema,
  RssColumns,
} from "../../schema";
import { and, eq } from "drizzle-orm";
import { del, get, set } from "../../../lib/redis";
import type { H3Event } from "h3";
import { RssFeedItem } from "~~/types/rss";

export const getFavorites = async (userId: string, articleGuid: string) => {
  try {
    const res = await db
      .select()
      .from(favoriteArticle)
      .where(
        and(
          eq(favoriteArticle.userId, userId),
          eq(favoriteArticle.rssFeedItemsGuid, articleGuid),
        ),
      );
    return res;
  } catch (err) {
    return err;
  }
};

export const saveFavorite = async (
  userId: string,
  rssFeedItemsGuid: string,
  articleSnapshot: FavoriteArticleColumns,
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
    return newFavorite;
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};

export const saveFavoriteArticleSnapshot = async (
  userId: string,
  rssFeedItemsGuid: string,
  articleSnapshot: RssFeedItem,
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
    return updatedFavoriteArticle;
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};

export const deleteFavorite = async (
  userId: string,
  rssFeedItemsGuid: string,
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
    return deletedFavorite;
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};
