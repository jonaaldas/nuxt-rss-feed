<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const dashboardStore = useDashboardStore();
const favoritesStore = useFavoritesStore();

const isFavoritesPage = computed(() =>
  route.path.startsWith('/dashboard/favorites'),
);
const isFeedPage = computed(() => route.path.includes('/article/'));
const isFeedListPage = computed(
  () =>
    route.path === '/dashboard/feed' ||
    (route.path.startsWith('/dashboard/feed/') &&
      !route.path.includes('/article/')),
);

const handleArticleSelect = (item: any) => {
  const articleId = encodeURIComponent(item.link || item.guid || item.title);
  const feedId = dashboardStore.selectedFeed?.id;
  if (feedId) {
    router.push(`/dashboard/feed/${feedId}/article/${articleId}`);
  } else {
    // Fallback: find feed that contains this article
    if (dashboardStore.rssFeeds && 'data' in dashboardStore.rssFeeds) {
      const articleLink = item.link || item.guid || item.title;
      const feed = dashboardStore.rssFeeds.data.find((f: any) => {
        const feedItems = Array.isArray(f.feedItems) ? f.feedItems : [];
        return feedItems.some(
          (feedItem: any) =>
            feedItem.link === articleLink ||
            feedItem.guid === articleLink ||
            feedItem.title === articleLink,
        );
      });
      if (feed) {
        router.push(`/dashboard/feed/${feed.id}/article/${articleId}`);
        return;
      }
    }
    router.push(`/dashboard/feed/0/article/${articleId}`);
  }
};

const handleFeedSelect = (feed: any) => {
  dashboardStore.selectedArticle = null;
  dashboardStore.selectFeed(feed);
  router.push({
    path: '/dashboard/feed',
    query: {
      feed: feed.id,
    },
  });
};

const handleFeedRefresh = (isRefreshing: boolean) => {
  dashboardStore.handleFeedRefresh(isRefreshing);
};

const navigateToHome = () => {
  if (isFavoritesPage.value) {
    favoritesStore.clearSelection();
    navigateTo('/dashboard/favorites');
  } else {
    dashboardStore.clearSelection();
    navigateTo('/dashboard/feed');
  }
};

const navigateToFeed = (feedId: number) => {
  dashboardStore.selectedArticle = null;
  navigateTo({
    path: '/dashboard/feed',
    query: {
      feed: feedId,
    },
  });
};

watch(
  () => dashboardStore.rssFeeds,
  (newValue) => {
    if (
      newValue &&
      'data' in newValue &&
      !isFavoritesPage.value &&
      isFeedListPage.value
    ) {
      if (route.query.feed) {
        dashboardStore.selectFeedFromQuery(route.query.feed as string);
      }
    }
  },
  { immediate: true },
);

watch(
  () => route.query,
  (newQuery) => {
    if (isFeedListPage.value) {
      // Handle feed query on feed list pages
      if (dashboardStore.rssFeeds && 'data' in dashboardStore.rssFeeds) {
        if (newQuery.feed) {
          dashboardStore.selectFeedFromQuery(newQuery.feed as string);
        } else if (route.path === '/dashboard/feed') {
          dashboardStore.selectedFeed = null;
        }
      }
    }
  },
);

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      if (newPath.startsWith('/dashboard/favorites')) {
        dashboardStore.clearSelection();
      } else if (oldPath.startsWith('/dashboard/favorites')) {
        favoritesStore.clearSelection();
      } else if (newPath.includes('/article/')) {
        // Navigating to feed article page
        // Handle both UUID and numeric feed IDs
        const match = newPath.match(/\/feed\/([^\/]+)\/article\/(.+)$/);
        if (match && match[1] && match[2]) {
          const feedId = match[1];
          const articleId = match[2];
          // Select feed first
          if (dashboardStore.rssFeeds && 'data' in dashboardStore.rssFeeds) {
            const feed = dashboardStore.rssFeeds.data.find(
              (f: any) => f.id === feedId || f.id === parseInt(feedId),
            );
            if (feed) {
              dashboardStore.selectFeed(feed);
            }
          }
          // Then select article
          if (dashboardStore.rssFeeds && 'data' in dashboardStore.rssFeeds) {
            dashboardStore.selectArticleFromQuery(articleId);
          }
        }
      } else if (oldPath.includes('/article/') && isFeedListPage.value) {
        // Navigating from feed article page back to feed list
        dashboardStore.selectedArticle = null;
        // Feed will be selected from query param via query watcher
      }
    }
  },
);
</script>

<template>
  <SidebarProvider>
    <AppSidebar
      :loading="dashboardStore.asyncStatus === 'loading'"
      :navMain="dashboardStore.navMain"
      @select-article="handleArticleSelect"
      @refresh-feed="handleFeedRefresh"
      @select-feed="handleFeedSelect" />
    <SidebarInset>
      <header
        class="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbPage v-if="isFavoritesPage">
                  Favorites
                </BreadcrumbPage>
                <BreadcrumbLink
                  v-else
                  as="button"
                  @click="navigateToHome"
                  class="cursor-pointer">
                  RSS Feeds
                </BreadcrumbLink>
              </BreadcrumbItem>
              <template
                v-if="
                  !isFavoritesPage &&
                  (dashboardStore.selectedFeed || isFeedListPage)
                ">
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink
                    v-if="isFeedPage && dashboardStore.selectedFeed"
                    as="button"
                    @click="navigateToFeed(dashboardStore.selectedFeed.id)"
                    class="cursor-pointer">
                    {{ dashboardStore.selectedFeed.title }}
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else-if="dashboardStore.selectedFeed">
                    {{ dashboardStore.selectedFeed.title }}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </template>
              <template
                v-if="
                  (isFeedPage && dashboardStore.selectedArticle) ||
                  (!isFavoritesPage &&
                    !isFeedPage &&
                    dashboardStore.selectedArticle)
                ">
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage class="line-clamp-1">
                    {{ dashboardStore.selectedArticle?.title }}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="flex items-center gap-2">
          <ThemeSwitcher class="ml-auto" />
          <UserAvatar />
        </div>
      </header>
      <div
        v-if="dashboardStore.refreshFeed"
        class="flex items-center justify-center h-full opacity-50">
        <Loader2 class="w-4 h-4 animate-spin" />
      </div>
      <slot v-else />
    </SidebarInset>
  </SidebarProvider>
</template>
