import { eq } from 'drizzle-orm';
import { db } from '../..';
import { rssFeed } from '../../schema';
import { get, set } from '~~/server/lib/redis';
import { RssFeedItem } from '~~/types/rss';

export const getArticle = async (userId: string, articleGuid: string): Promise<{ data: RssFeedItem | null; error: string | null }> => {
  try {
    const cacheKey = `article:${userId}:${articleGuid}`;
    const cachedArticle = await get(cacheKey);

    if (cachedArticle && typeof cachedArticle === 'object' && 'guid' in cachedArticle) {
      return { data: cachedArticle as RssFeedItem, error: null };
    }

    const res = await db.select().from(rssFeed).where(eq(rssFeed.userId, userId));
    const articles = res.flatMap((feed) => feed.feedItems);
    const article = articles.find((article) => article.guid === articleGuid);

    if (!article) {
      return { data: null, error: null };
    }

    await set(cacheKey, article);

    return {
      data: article,
      error: null,
    };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
};
