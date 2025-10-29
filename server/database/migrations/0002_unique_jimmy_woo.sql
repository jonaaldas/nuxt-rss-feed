CREATE TABLE "favorite_article" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"rss_feed_items_guid" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favorite_article" ADD CONSTRAINT "favorite_article_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "favorite_article_rss_feed_items_guid_index" ON "favorite_article" USING btree ("rss_feed_items_guid");