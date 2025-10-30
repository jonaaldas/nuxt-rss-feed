import { createTRPCRouter } from '../init';

import { favoriteRouter } from './favorites';
import { rssRouter } from './rss';

export const appRouter = createTRPCRouter({
  rss: rssRouter,
  favorites: favoriteRouter,
});

export type AppRouter = typeof appRouter;
