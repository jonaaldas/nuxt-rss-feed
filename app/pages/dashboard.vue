<script setup lang="ts">
import { ExternalLink, Calendar, User } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const dashboardStore = useDashboardStore();

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const articleContent = computed(() => {
  if (!dashboardStore.selectedArticle) return null;

  try {
    const feedItem = dashboardStore.selectedArticle;
    if (feedItem['content:encoded']) {
      return feedItem['content:encoded'];
    }
    if (feedItem.content) {
      return feedItem.content;
    }
    return feedItem.contentSnippet || null;
  } catch (error) {
    return null;
  }
});

const handleArticleSelect = (item: any) => {
  dashboardStore.selectArticle(item);
  router.push({
    query: {
      feed: dashboardStore.selectedFeed?.id,
      article: encodeURIComponent(item.link || item.guid || item.title),
    },
  });
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
  <div
    class="w-full mx-auto px-4 py-8"
    :class="
      !dashboardStore.selectedFeed && !dashboardStore.selectedArticle
        ? 'max-w-7xl'
        : 'max-w-4xl'
    ">
    <FeedsGrid
      v-if="!dashboardStore.selectedFeed && !dashboardStore.selectedArticle"
      :feeds="dashboardStore.rssFeeds?.data as any[]"
      @select-feed="handleFeedSelect" />

    <div
      v-else-if="dashboardStore.selectedFeed && !dashboardStore.selectedArticle"
      class="space-y-6">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">
          {{ dashboardStore.selectedFeed.title }}
        </h1>
        <div class="flex items-center gap-2">
          <Badge variant="secondary">
            {{ dashboardStore.selectedFeed.items?.length || 0 }} articles
          </Badge>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <Card
          v-for="item in dashboardStore.selectedFeed.items"
          :key="item.link || item.guid"
          class="hover:shadow-lg transition-shadow cursor-pointer group"
          @click="handleArticleSelect(item)">
          <CardHeader>
            <CardTitle
              class="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
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
            <p
              v-if="item.contentSnippet"
              class="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
              {{ item.contentSnippet }}
            </p>
            <p v-else class="text-muted-foreground italic text-sm">
              No preview available
            </p>
          </CardContent>
          <CardFooter class="flex gap-2">
            <Button
              variant="default"
              size="sm"
              class="flex-1"
              @click="handleArticleSelect(item)">
              Read Article
            </Button>
            <Button
              v-if="item.link"
              variant="outline"
              size="sm"
              as-child
              @click.stop>
              <a
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5">
                <ExternalLink class="w-3.5 h-3.5" />
                Original
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>

    <article
      v-else-if="dashboardStore.selectedArticle"
      class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:leading-tight prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-foreground prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-foreground prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-p:text-base prose-p:leading-7 prose-p:mb-6 prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:font-semibold prose-strong:text-foreground prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg prose-pre:shadow-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-primary prose-ol:list-decimal prose-ol:pl-6 prose-hr:border-border prose-hr:my-8 prose-table:overflow-hidden prose-th:bg-muted prose-th:font-semibold prose-td:border-border">
      <h1>{{ dashboardStore.selectedArticle.title }}</h1>
      <div
        class="text-sm text-muted-foreground mb-1 flex items-center justify-between">
        <div>
          <time v-if="dashboardStore.selectedArticle.pubDate">{{
            new Date(
              dashboardStore.selectedArticle.pubDate,
            ).toLocaleDateString()
          }}</time>
          <a
            v-if="dashboardStore.selectedArticle.link"
            :href="dashboardStore.selectedArticle.link"
            target="_blank"
            class="ml-4"
            >Read original →</a
          >
        </div>
        <ReadTime
          :total-words="
            dashboardStore.selectedArticle['content:encodedSnippet']?.split(' ')
              .length || 0
          " />
      </div>
      <div v-html="articleContent"></div>
    </article>
  </div>
</template>