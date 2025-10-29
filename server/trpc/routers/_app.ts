import { mergeRouters } from "../init";

import { favoriteRouter } from "./favorites";
import { rssRouter } from "./rss";

export const appRouter = mergeRouters(rssRouter, favoriteRouter);

export type AppRouter = typeof appRouter;
