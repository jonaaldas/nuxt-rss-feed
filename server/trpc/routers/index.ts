import { fetchRssFeed } from "~~/server/lib/rss";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../../trpc/init";
import { z } from "zod";
import { saveRssFeed } from "../../database/queries/rss";

export const appRouter = createTRPCRouter({
  rss: protectedProcedure.query((ctx) => {
    console.log(ctx.ctx.session);
    return ctx.ctx.session;
  }),
  saveRssFeed: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      const url = input.url;

      const feed = await fetchRssFeed(url);
      const data = {
        userId: user.id,
        url,
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
