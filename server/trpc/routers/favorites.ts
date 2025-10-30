import { createTRPCRouter, protectedProcedure } from '../../trpc/init';
import { z } from 'zod';
import {
  getAllFavorites,
  getFavorites,
  saveFavorite,
  saveFavoriteArticleSnapshot,
  deleteFavorite,
} from '../../database/queries/rss/favorites';
import { RssFeedItem } from '~~/types/rss';

export const favoriteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const favorites = await getAllFavorites(ctx.user.id);
    return favorites;
  }),

  get: protectedProcedure
    .input(z.object({ articleGuid: z.string() }))
    .query(async ({ ctx, input }) => {
      const favorites = await getFavorites(ctx.user.id, input.articleGuid);
      return favorites;
    }),

  create: protectedProcedure
    .input(
      z.object({
        articleGuid: z.string(),
        articleSnapshot: z.any() as z.ZodType<RssFeedItem>,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await saveFavorite(
        ctx.user.id,
        input.articleGuid,
        input.articleSnapshot,
        ctx.event,
      );
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        articleGuid: z.string(),
        articleSnapshot: z.any() as z.ZodType<RssFeedItem>,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await saveFavoriteArticleSnapshot(
        ctx.user.id,
        input.articleGuid,
        input.articleSnapshot,
        ctx.event,
      );
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ articleGuid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await deleteFavorite(
        ctx.user.id,
        input.articleGuid,
        ctx.event,
      );
      return result;
    }),
});

export type AppRouter = typeof favoriteRouter;
