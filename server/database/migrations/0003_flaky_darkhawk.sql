ALTER TABLE "favorite_article" ADD COLUMN "article_snapshot" jsonb;--> statement-breakpoint
CREATE UNIQUE INDEX "favorite_article_user_guid_unique" ON "favorite_article" USING btree ("user_id","rss_feed_items_guid");--> statement-breakpoint
CREATE INDEX "favorite_article_user_id_index" ON "favorite_article" USING btree ("user_id");