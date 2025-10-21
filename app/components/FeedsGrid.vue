<script setup lang="ts">
import { BookOpen, Clock } from "lucide-vue-next";

interface FeedItem {
  title: string;
  pubDate?: string;
  [key: string]: any;
}

interface Feed {
  id: number;
  title: string;
  url: string;
  feedItems?: FeedItem[];
  createdAt?: string;
  [key: string]: any;
}

interface Props {
  feeds: Feed[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  selectFeed: [feed: Feed];
}>();

const handleFeedClick = (feed: Feed) => {
  emit("selectFeed", feed);
};

const getLatestArticleDate = (feed: Feed) => {
  if (!feed.feedItems || feed.feedItems.length === 0) return null;

  const sortedItems = [...feed.feedItems].sort((a, b) => {
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  return sortedItems[0]?.pubDate;
};
</script>

<template>
  <div v-if="feeds.length === 0" class="text-center py-20">
    <div class="flex flex-col items-center gap-4">
      <BookOpen class="w-16 h-16 text-muted-foreground" />
      <div>
        <h2 class="text-2xl font-semibold mb-2">No feeds yet</h2>
        <p class="text-muted-foreground">
          Please add a new RSS feed to get started
        </p>
      </div>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Your RSS Feeds</h1>
      <p class="text-muted-foreground">
        Browse and manage your subscribed feeds
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="feed in feeds"
        :key="feed.id"
        class="hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50"
        @click="handleFeedClick(feed)"
      >
        <CardHeader>
          <CardTitle
            class="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2"
          >
            {{ feed.title }}
          </CardTitle>
          <CardDescription class="flex flex-col gap-2 mt-2">
            <span class="flex items-center gap-1.5 text-xs">
              <BookOpen class="w-3.5 h-3.5" />
              {{ feed.feedItems?.length || 0 }} articles
            </span>
            <span
              v-if="getLatestArticleDate(feed)"
              class="flex items-center gap-1.5 text-xs"
            >
              <Clock class="w-3.5 h-3.5" />
              Last update:
              {{
                new Date(getLatestArticleDate(feed)!).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              }}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground truncate">
            {{ feed.url }}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" size="sm" class="w-full">
            View Feed
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
