import { fetchRssFeed } from "~~/server/lib/rss";
import { createTRPCRouter, protectedProcedure } from "../../trpc/init";
import { z } from "zod";
import {
  deleteUrl,
  getRssFeeds,
  saveRssFeed,
  updateAllFeeds,
} from "../../database/queries/rss";
import { del } from "../../lib/redis";
import { RssFeedItem } from "~~/types/rss";

export const rssRouter = createTRPCRouter({
  rss: protectedProcedure.query(async ({ ctx }) => {
    const rssFeeds = await getRssFeeds(ctx.user.id);
    return { data: rssFeeds, error: null };
  }),
  saveRssFeed: protectedProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const feed = await fetchRssFeed(input.url);
      const data = {
        userId: user.id,
        url: input.url,
        title: feed.title,
        link: feed.link,
        feedUrl: feed.feedUrl,
        lastBuildDate: new Date(feed.lastBuildDate),
        feedItems: feed.items as RssFeedItem[],
        itemCount: feed.items.length,
      };
      const { data: rssFeed, error } = await saveRssFeed(
        data,
        ctx.user.id,
        ctx.event,
      );
      if (error) {
        return { data: null, error: error };
      }
      return { data: rssFeed, error: null };
    }),
  refresh: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.user;
    const rssFeeds = await getRssFeeds(user.id);

    const feedsURLS = rssFeeds.map((feed) => feed.url);

    const feeds = await Promise.all(
      feedsURLS.map(async (url) => {
        const feed = await fetchRssFeed(url);
        const data = {
          userId: ctx.user.id,
          url: url,
          title: feed.title,
          link: feed.link,
          feedUrl: feed.feedUrl,
          lastBuildDate: new Date(feed.lastBuildDate),
          feedItems: feed.items as RssFeedItem[],
          itemCount: feed.items.length,
        };
        return data;
      }),
    );
    // ctx.wait(updateAllFeeds(feeds, ctx.user.id));
    updateAllFeeds(feeds, ctx.user.id);
    return { data: true, error: null };
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const feedId = input.id;
      const res = await deleteUrl(feedId, userId);
      ctx.event.waitUntil(del(`feed:${userId}`));
      return res;
    }),
});

// export type definition of API
export type AppRouter = typeof rssRouter;
