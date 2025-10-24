import { db } from "../../index";
import { RssColumns, rssFeed, rssFeedInsertSchema } from "../../schema";
import { and, eq } from "drizzle-orm";
import { del, get, set } from "../../../lib/redis";
import type { H3Event } from "h3";

export const getRssFeeds = async (userId: string) => {
  try {
    const cachedFeeds = await get(`feed:${userId}`);

    if (cachedFeeds) {
      return cachedFeeds;
    }

    const rssFeeds = await db
      .select()
      .from(rssFeed)
      .where(eq(rssFeed.userId, userId));

    await set(`feed:${userId}`, rssFeeds);

    return rssFeeds;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get RSS feeds");
  }
};

export const saveRssFeed = async (
  rssFeedValues: Omit<RssColumns, "createdAt" | "updatedAt">,
  userId: string,
  event: H3Event,
) => {
  const validatedRssFeedValues = rssFeedInsertSchema.parse(rssFeedValues);
  try {
    const newRssFeed = await db
      .insert(rssFeed)
      .values(validatedRssFeedValues)
      .returning();
    event.waitUntil(del(`feed:${userId}`));
    return { data: newRssFeed, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};

export const updateAllFeeds = async (feeds: RssColumns[], userId: string) => {
  try {
    let promises: any = [];
    feeds.forEach(async (feed) => {
      promises.push(
        db
          .update(rssFeed)
          .set(feed)
          .where(and(eq(rssFeed.url, feed.url), eq(rssFeed.userId, userId))),
      );
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};

export const deleteUrl = async (id: string, userId: string) => {
  try {
    const res = await db
      .delete(rssFeed)
      .where(and(eq(rssFeed.userId, userId), eq(rssFeed.id, id)));

    return res;
  } catch (err) {
    return err;
  }
};
