import { fetchRssFeed } from "~~/server/lib/rss";
import { createTRPCRouter, protectedProcedure } from "../../trpc/init";
import { z } from "zod";
import {
  getRssFeeds,
  saveRssFeed,
  updateAllFeeds,
} from "../../database/queries/rss";

export const appRouter = createTRPCRouter({
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
        feedItems: feed.items,
        itemCount: feed.items.length,
      };
      const { data: rssFeed, error } = await saveRssFeed(data);
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
          feedItems: feed.items,
          itemCount: feed.items.length,
        };
        return data;
      })
    );
    // ctx.wait(updateAllFeeds(feeds, ctx.user.id));
    updateAllFeeds(feeds, ctx.user.id);
    return { data: true, error: null };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
