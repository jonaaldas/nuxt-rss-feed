import { db } from '../../index';
import { RssColumns, rssFeed, rssFeedInsertSchema, rssFeedUpdateSchema } from '../../schema';
import { and, eq } from 'drizzle-orm';
import { del, get, set } from '../../../lib/redis';
import type { H3Event } from 'h3';
import type { RssFeedSelectSchema, rssFeedSelectSchema } from '../../schema';

export const getRssFeeds = async (userId: string): Promise<RssFeedSelectSchema[]> => {
  try {
    const cachedFeeds = await get(`feed:${userId}`);

    if (cachedFeeds) {
      return cachedFeeds;
    }

    const rssFeeds = await db.select().from(rssFeed).where(eq(rssFeed.userId, userId));

    await set(`feed:${userId}`, rssFeeds);

    return rssFeeds;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get RSS feeds');
  }
};

export const saveRssFeed = async (rssFeedValues: Omit<RssColumns, 'createdAt' | 'updatedAt'>, userId: string, event: H3Event) => {
  const validatedRssFeedValues = rssFeedInsertSchema.parse(rssFeedValues);
  try {
    const newRssFeed = await db.insert(rssFeed).values(validatedRssFeedValues).returning();
    event.waitUntil(del(`feed:${userId}`));
    return { data: newRssFeed, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};

export const updateAllFeeds = async (feeds: Array<Omit<RssColumns, 'createdAt' | 'updatedAt'>>, userId: string) => {
  try {
    const updatePromises = feeds.map(async (feed) => {
      const validatedFeed = rssFeedUpdateSchema.parse(feed);
      return db
        .update(rssFeed)
        .set(validatedFeed)
        .where(and(eq(rssFeed.userId, userId), eq(rssFeed.url, feed.url)));
    });
    const updatedFeeds = await Promise.all(updatePromises);
    await del(`feed:${userId}`);
    return updatedFeeds;
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};

export const deleteUrl = async (id: string, userId: string) => {
  try {
    const res = await db.delete(rssFeed).where(and(eq(rssFeed.userId, userId), eq(rssFeed.id, id)));

    return res;
  } catch (err) {
    return err;
  }
};
