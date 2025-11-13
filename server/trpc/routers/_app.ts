import { createTRPCRouter } from '../init';

import { favoriteRouter } from './favorites';
import { rssRouter } from './rss';
import { aiRouter } from './ai';
export const appRouter = createTRPCRouter({
  rss: rssRouter,
  favorites: favoriteRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
