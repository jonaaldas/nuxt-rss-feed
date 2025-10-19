import { baseProcedure, createTRPCRouter } from "../../trpc/init";
import { z } from "zod";

export const appRouter = createTRPCRouter({
  rss: baseProcedure.query(() => {
    return {
      greeting: "Hello World",
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
