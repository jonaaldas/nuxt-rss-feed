import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { RssFeedItem } from '../../types/rss';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { eq } from 'drizzle-orm';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const rssFeed = pgTable('rss_feed', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  url: text('url').notNull().unique(),
  title: text('title').notNull(),
  link: text('link').notNull(),
  feedUrl: text('feed_url').notNull(),
  lastBuildDate: timestamp('last_build_date').notNull(),
  itemCount: integer('item_count').default(0).notNull(),
  feedItems: jsonb('feed_items').notNull().$type<RssFeedItem[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const rssFeedSelectSchema = createSelectSchema(rssFeed);
export const rssFeedInsertSchema = createInsertSchema(rssFeed).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const rssFeedUpdateSchema = createUpdateSchema(rssFeed).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RssColumns = typeof rssFeed.$inferInsert;
export type RssFeedSelectSchema = typeof rssFeed.$inferSelect;
export type RssFeedUpdateSchema = typeof rssFeedUpdateSchema;

export const favoriteArticle = pgTable(
  'favorite_article',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    rssFeedItemsGuid: text('rss_feed_items_guid').notNull(),
    articleSnapshot: jsonb('article_snapshot').$type<RssFeedItem>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('favorite_article_user_guid_unique').on(
      table.userId,
      table.rssFeedItemsGuid,
    ),
    index('favorite_article_user_id_index').on(table.userId),
    index('favorite_article_rss_feed_items_guid_index').on(
      table.rssFeedItemsGuid,
    ),
  ],
);
export const favoriteArticleSelectSchema = createSelectSchema(favoriteArticle);
export const favoriteArticleInsertSchema = createInsertSchema(
  favoriteArticle,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type FavoriteArticleColumns = typeof favoriteArticle.$inferInsert;
export type FavoriteArticleSelectSchema = typeof favoriteArticle.$inferSelect;
