<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const dashboardStore = useDashboardStore();

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

const handleFeedRefresh = (isRefreshing: boolean) => {
  dashboardStore.handleFeedRefresh(isRefreshing);
};

const navigateToHome = () => {
  dashboardStore.clearSelection();
  navigateTo('/dashboard');
};

const navigateToFeed = (feedId: number) => {
  dashboardStore.selectedArticle = null;
  navigateTo({
    path: '/dashboard',
    query: {
      feed: feedId,
    },
  });
};

watch(
  () => dashboardStore.rssFeeds,
  (newValue) => {
    if (newValue && 'data' in newValue) {
      if (route.query.feed) {
        dashboardStore.selectFeedFromQuery(route.query.feed as string);
      }
      if (route.query.article) {
        dashboardStore.selectArticleFromQuery(route.query.article as string);
      }
    }
  },
  { immediate: true },
);

watch(
  () => route.query,
  (newQuery) => {
    if (dashboardStore.rssFeeds && 'data' in dashboardStore.rssFeeds) {
      if (newQuery.feed) {
        dashboardStore.selectFeedFromQuery(newQuery.feed as string);
      } else {
        dashboardStore.selectedFeed = null;
      }

      if (newQuery.article) {
        dashboardStore.selectArticleFromQuery(newQuery.article as string);
      } else {
        dashboardStore.selectedArticle = null;
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
                <BreadcrumbLink
                  as="button"
                  @click="navigateToHome"
                  class="cursor-pointer">
                  RSS Feeds
                </BreadcrumbLink>
              </BreadcrumbItem>
              <template v-if="dashboardStore.selectedFeed">
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink
                    v-if="dashboardStore.selectedArticle"
                    as="button"
                    @click="navigateToFeed(dashboardStore.selectedFeed.id)"
                    class="cursor-pointer">
                    {{ dashboardStore.selectedFeed.title }}
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>
                    {{ dashboardStore.selectedFeed.title }}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </template>
              <template v-if="dashboardStore.selectedArticle">
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage class="line-clamp-1">
                    {{ dashboardStore.selectedArticle.title }}
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

