import { useQuery } from '@pinia/colada';

export const useDashboardStore = defineStore('dashboard', () => {
  const { $trpc } = useNuxtApp();
  const { session } = useAuthStore();
  const userId = computed(() => session?.user?.id ?? '');

  const selectedFeed = ref<any>(null);
  const selectedArticle = ref<any>(null);
  const refreshFeed = ref(false);

  const { asyncStatus, data: rssFeeds } = useQuery({
    key: () => ['rssFeeds', userId.value],
    query: async () => {
      try {
        const data = await $trpc.rss.rss.query();
        return data;
      } catch (error) {
        throw error;
      }
    },
    enabled: () => userId.value !== undefined,
  });

  const navMain = computed(() => {
    if (!rssFeeds.value || !('data' in rssFeeds.value)) return [];
    const data = rssFeeds.value.data;
    return data?.map((feed) => {
      const feedItems = Array.isArray(feed.feedItems) ? feed.feedItems : [];
      return {
        title: feed.title,
        url: '/rss/',
        id: feed.id,
        items: feedItems.map((item: any) => ({
          title: item.title,
          url: '/rss/',
          isActive: selectedArticle.value?.link === item.link,
          ...item,
        })),
      };
    });
  });

  const selectFeed = (feed: any) => {
    const transformedFeed = navMain.value.find(
      (f: any) => f.id === feed.id,
    ) || {
      ...feed,
      items: Array.isArray(feed.feedItems) ? feed.feedItems : [],
    };
    selectedFeed.value = transformedFeed;
    selectedArticle.value = null;
  };

  const selectArticle = (item: any) => {
    selectedArticle.value = item;
  };

  const handleFeedRefresh = (isRefreshing: boolean) => {
    refreshFeed.value = isRefreshing;
  };

  const clearSelection = () => {
    selectedFeed.value = null;
    selectedArticle.value = null;
  };

  const selectFeedFromQuery = (feedParam: string) => {
    if (!feedParam || !rssFeeds.value || !('data' in rssFeeds.value)) return;

    const feed = rssFeeds.value.data.find(
      (f: any) => f.id === feedParam || f.id === parseInt(feedParam),
    );
    if (feed) {
      const transformedFeed = navMain.value.find(
        (f: any) => f.id === feed.id,
      ) || {
        ...feed,
        items: Array.isArray(feed.feedItems) ? feed.feedItems : [],
      };
      selectedFeed.value = transformedFeed;
    }
  };

  const selectArticleFromQuery = (articleParam: string) => {
    if (!articleParam || !rssFeeds.value || !('data' in rssFeeds.value)) return;

    const decodedParam = decodeURIComponent(articleParam);

    for (const feed of rssFeeds.value.data) {
      const feedItems = Array.isArray(feed.feedItems) ? feed.feedItems : [];
      const article = feedItems.find(
        (item: any) =>
          item.link === decodedParam ||
          item.guid === decodedParam ||
          item.title === decodedParam,
      );

      if (article) {
        selectedArticle.value = article;
        const transformedFeed = navMain.value.find(
          (f: any) => f.id === feed.id,
        ) || {
          ...feed,
          items: feedItems,
        };
        selectedFeed.value = transformedFeed;
        break;
      }
    }
  };

  return {
    rssFeeds,
    navMain,
    selectedFeed,
    selectedArticle,
    refreshFeed,
    asyncStatus,
    selectFeed,
    selectArticle,
    handleFeedRefresh,
    clearSelection,
    selectFeedFromQuery,
    selectArticleFromQuery,
  };
});

