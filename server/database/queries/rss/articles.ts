import { eq } from 'drizzle-orm';
import { db } from '../..';
import { rssFeed } from '../../schema';
import { get, set } from '~~/server/lib/redis';
import { RssFeedItem } from '~~/types/rss';

export const getArticle = async (userId: string, articleGuid: string) => {
  try {
    const cacheKey = `article:${userId}:${articleGuid}`;
    const cachedArticle = await get(cacheKey);

    if (cachedArticle && Array.isArray(cachedArticle)) {
      return { data: cachedArticle, error: null };
    }

    const res = await db.select().from(rssFeed).where(eq(rssFeed.userId, userId));
    const articles = res.flatMap((feed) => feed.feedItems);
    const article = articles.find((article) => article.guid === articleGuid) as RssFeedItem;

    if (article) {
      await set(cacheKey, article);
    }

    return {
      data: {
        // @ts-ignore
        article: article['content:encodedSnippet'],
        guid: article.guid,
      },
      error: null,
    };
  } catch (err) {
    console.error(err);
    return { data: null, error: err };
  }
};
