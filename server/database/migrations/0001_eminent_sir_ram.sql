CREATE TABLE "rss_feed" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"link" text NOT NULL,
	"feed_url" text NOT NULL,
	"last_build_date" timestamp NOT NULL,
	"item_count" integer DEFAULT 0 NOT NULL,
	"feed_items" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rss_feed_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "rss_feed" ADD CONSTRAINT "rss_feed_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;