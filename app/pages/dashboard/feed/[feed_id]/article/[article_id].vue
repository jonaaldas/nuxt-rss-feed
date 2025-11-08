<script setup lang="ts">
import { useRoute } from 'vue-router';
import DOMPurify from 'dompurify';
const { $trpc } = useNuxtApp();
const authStore = useAuthStore();
const userId = computed(() => authStore.session?.user?.id ?? '');
const route = useRoute();
const dashboardStore = useDashboardStore();
const favoritesStore = useFavoritesStore();

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const articleContent = computed(() => {
  if (!dashboardStore.selectedArticle) return null;

  try {
    const feedItem = dashboardStore.selectedArticle;
    if (feedItem['content:encoded']) {
      const sanitizedContent = DOMPurify.sanitize(feedItem['content:encoded'] || '');
      return sanitizedContent;
    }
    if (feedItem.content) {
      const sanitizedContent = DOMPurify.sanitize(feedItem.content || '');
      return sanitizedContent;
    }
    const sanitizedContent = DOMPurify.sanitize(feedItem.contentSnippet || '');
    return sanitizedContent;
  } catch (error) {
    return null;
  }
});

// Watch route params and rssFeeds to select article when component mounts or data loads
watch(
  [() => route.path, () => dashboardStore.rssFeeds],
  ([path, feeds]) => {
    if (feeds && 'data' in feeds && path) {
      // Extract feedId and articleId from path: /dashboard/feed/[feedId]/article/[articleId]
      const match = path.match(/\/feed\/([^\/]+)\/article\/(.+)$/);
      if (match && match[1] && match[2]) {
        const feedId = match[1];
        const articleId = match[2];

        // Select feed first
        const feed = feeds.data.find((f: any) => String(f.id) === feedId || f.id === feedId);
        if (feed) {
          dashboardStore.selectFeed(feed);
        }

        // Then select article
        dashboardStore.selectArticleFromQuery(articleId);
      }
    }
  },
  { immediate: true },
);

const articleGuid = computed(() => {
  if (!dashboardStore.selectedArticle) return null;
  return dashboardStore.selectedArticle.guid || dashboardStore.selectedArticle.link || null;
});

const isArticleFavorite = computed(() => {
  if (!articleGuid.value) return false;
  return favoritesStore.isFavorite(articleGuid.value);
});

const handleToggleFavorite = () => {
  if (!dashboardStore.selectedArticle || !articleGuid.value) return;

  favoritesStore.toggleFavorite({
    articleGuid: articleGuid.value,
    articleSnapshot: dashboardStore.selectedArticle,
    isFavorite: isArticleFavorite.value,
  });
};

const articleWordCount = computed(() => {
  if (!articleContent.value) return 0;
  const text = articleContent.value.replace(/<[^>]*>/g, ' ');
  return text.split(/\s+/).filter((word: string) => word.length > 0).length;
});

const {
  data: summarizeArticleData,
  mutate: summarizeArticle,
  asyncStatus: summarizeArticleLoading,
} = useMutation({
  key: ['summarizeArticle', userId.value ?? ''],
  mutation: async () => {
    const response = await $trpc.ai.summarize.mutate({
      articleGuid: articleGuid.value,
    });
    return response;
  },
});
</script>

<template>
  <div class="w-full mx-auto px-4 py-8 max-w-4xl">
    <div v-if="!dashboardStore.selectedArticle" class="flex items-center justify-center h-64">
      <Icon name="lucide:loader-circle" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <article
      v-else
      class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:leading-tight prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-foreground prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-foreground prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-p:text-base prose-p:leading-7 prose-p:mb-6 prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:font-semibold prose-strong:text-foreground prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg prose-pre:shadow-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-primary prose-ol:list-decimal prose-ol:pl-6 prose-hr:border-border prose-hr:my-8 prose-table:overflow-hidden prose-th:bg-muted prose-th:font-semibold prose-td:border-border">
      <div class="flex items-start justify-between gap-4 mb-4">
        <h1 class="flex-1">{{ dashboardStore.selectedArticle.title }}</h1>
        <button
          @click="handleToggleFavorite"
          class="shrink-0 p-1 cursor-pointer"
          :class="{ 'text-red-500': isArticleFavorite }"
          :disabled="!articleGuid || favoritesStore.toggleFavoriteStatus === 'loading'">
          <Icon
            :name="isArticleFavorite ? 'heroicons:heart-solid' : 'heroicons:heart'"
            class="w-6 h-6 transition-all duration-300 hover:scale-110"
            :class="{ 'scale-110': isArticleFavorite }" />
        </button>
      </div>
      <div class="text-sm text-muted-foreground mb-1 flex items-center justify-between">
        <div class="flex items-center gap-1 justify-center">
          <time v-if="dashboardStore.selectedArticle.pubDate">{{ new Date(dashboardStore.selectedArticle.pubDate).toLocaleDateString() }}</time>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <a
                  v-if="dashboardStore.selectedArticle.link"
                  :href="dashboardStore.selectedArticle.link"
                  target="_blank"
                  class="m-1 flex items-center justify-center">
                  <Icon name="heroicons:arrow-top-right-on-square" size="16" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Original Article</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Icon
                  @click="summarizeArticle"
                  :name="summarizeArticleLoading === 'loading' ? 'svg-spinners:180-ring' : 'heroicons:sparkles'"
                  size="16" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Summarize Article</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ReadTime :total-words="articleWordCount" />
      </div>
      <blockquote v-if="summarizeArticleData?.data" className="mt-6 border-l-2 pl-6 italic">
        {{ summarizeArticleData?.data }}
      </blockquote>
      <div v-html="articleContent"></div>
    </article>
  </div>
</template>
