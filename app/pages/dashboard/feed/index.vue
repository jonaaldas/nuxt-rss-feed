<script setup lang="ts">
import { ExternalLink, Calendar, User } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
const router = useRouter();
const dashboardStore = useDashboardStore();

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const handleArticleSelect = (item: any) => {
  const articleId = encodeURIComponent(item.link || item.guid || item.title);
  const feedId = dashboardStore.selectedFeed?.id;
  if (feedId) {
    router.push(`/dashboard/feed/${feedId}/article/${articleId}`);
  }
};

const handleFeedSelect = (feed: any) => {
  dashboardStore.selectFeed(feed);
  router.push({
    query: {
      feed: feed.id,
    },
  });
};
</script>

<template>
  <div class="w-full mx-auto px-4 py-8" :class="!dashboardStore.selectedFeed ? 'max-w-7xl' : 'max-w-4xl'">
    <FeedsGrid v-if="!dashboardStore.selectedFeed" :feeds="dashboardStore.rssFeeds?.data as any[]" @select-feed="handleFeedSelect" />

    <div v-else-if="dashboardStore.selectedFeed" class="space-y-6">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">
          {{ dashboardStore.selectedFeed.title }}
        </h1>
        <div class="flex items-center gap-2">
          <Badge variant="secondary"> {{ dashboardStore.selectedFeed.items?.length || 0 }} articles </Badge>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <Card
          v-for="item in dashboardStore.selectedFeed.items"
          :key="item.link || item.guid"
          class="hover:shadow-lg transition-shadow cursor-pointer group"
          @click="handleArticleSelect(item)">
          <CardHeader>
            <CardTitle class="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {{ item.title }}
            </CardTitle>
            <CardDescription class="flex flex-wrap items-center gap-3 mt-2">
              <span v-if="item.pubDate" class="flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5" />
                {{
                  new Date(item.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              </span>
              <span v-if="item.creator" class="flex items-center gap-1.5">
                <User class="w-3.5 h-3.5" />
                {{ item.creator }}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p v-if="item.contentSnippet" class="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
              {{ item.contentSnippet }}
            </p>
            <p v-else class="text-muted-foreground italic text-sm">No preview available</p>
          </CardContent>
          <CardFooter class="flex gap-2">
            <Button variant="default" size="sm" class="flex-1" @click="handleArticleSelect(item)"> Read Article </Button>
            <Button v-if="item.link" variant="outline" size="sm" as-child @click.stop>
              <a :href="item.link" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5">
                <ExternalLink class="w-3.5 h-3.5" />
                Original
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
