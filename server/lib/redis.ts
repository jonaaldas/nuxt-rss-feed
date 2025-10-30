import {
  RssFeedSelectSchema,
  FavoriteArticleSelectSchema,
} from '../database/schema';

const isProduction = process.env.NODE_ENV === 'production';

const getKey = (key: string) => {
  const prefix = isProduction ? 'prod' : 'dev';
  return `RSS_FEED_${prefix}:${key}`;
};

export const get = async (key: string) => {
  const str = getKey(key);
  const value = await useStorage<RssFeedSelectSchema[]>('cache').getItem(str);
  return value;
};

export const set = async (key: string, value: RssFeedSelectSchema[]) => {
  const str = getKey(key);
  await useStorage<RssFeedSelectSchema[]>('cache').setItem(str, value);
};

export const getFavorite = async (key: string) => {
  const str = getKey(key);
  const value =
    await useStorage<FavoriteArticleSelectSchema[]>('cache').getItem(str);
  return value;
};

export const setFavorite = async (
  key: string,
  value: FavoriteArticleSelectSchema[],
) => {
  const str = getKey(key);
  await useStorage<FavoriteArticleSelectSchema[]>('cache').setItem(str, value);
};

export const del = async (key: string) => {
  const str = getKey(key);
  await useStorage('cache').removeItem(str);
};
