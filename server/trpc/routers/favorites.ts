import { createTRPCRouter, protectedProcedure } from "../../trpc/init";

export const favoriteRouter = createTRPCRouter({
  get: protectedProcedure.query(() => {
    return true;
  }),
});

// export type definition of API
export type AppRouter = typeof favoriteRouter;
