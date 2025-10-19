import { fetchRssFeed } from "~~/server/lib/rss";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../../trpc/init";
import { z } from "zod";
import { getRssFeeds, saveRssFeed } from "../../database/queries/rss";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
