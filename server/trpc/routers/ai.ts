import { createTRPCRouter, protectedProcedure } from '../../trpc/init';
import { z } from 'zod';
import { getArticle } from '../../database/queries/rss/articles';
import { summarizeArticle } from '~~/server/lib/summarize';
import { RssFeedItem } from '~~/types/rss';

export const aiRouter = createTRPCRouter({
  summarize: protectedProcedure
    .input(
      z.object({
        articleGuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const article = await getArticle(ctx.user.id, input.articleGuid);
      if (!article.data) {
        return { data: null, error: 'Article not found' };
      }
      const summary = await summarizeArticle(article.data);
      return summary;
    }),
});

export type AppRouter = typeof aiRouter;
