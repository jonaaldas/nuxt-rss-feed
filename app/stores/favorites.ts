import { useQuery, useMutation, useQueryCache } from '@pinia/colada';

export const useFavoritesStore = defineStore('favorites', () => {
  const { $trpc } = useNuxtApp();
  const { session } = useAuthStore();
  const userId = computed(
    () => session?.user?.id ?? (undefined as unknown as string),
  );
  const queryCache = useQueryCache();

  const selectedArticle = ref<any>(null);

  const { asyncStatus, data: favorites } = useQuery({
    key: () => ['favorites', userId.value],
    query: async () => {
      try {
        const data = await $trpc.favorites.getAll.query();
        return data;
      } catch (error) {
        throw error;
      }
    },
    enabled: () => userId.value !== undefined,
  });

  const favoritesList = computed(() => {
    if (!favorites.value || !('data' in favorites.value)) return [];
    const data = favorites.value.data;
    if (!Array.isArray(data)) return [];
    return data;
  });

  const selectArticle = (article: any) => {
    selectedArticle.value = article;
  };

  const clearSelection = () => {
    selectedArticle.value = null;
  };

  const selectArticleFromQuery = (articleParam: string) => {
    if (!articleParam || !favorites.value || !('data' in favorites.value))
      return;

    const decodedParam = decodeURIComponent(articleParam);

    const favorite = favoritesList.value.find(
      (f: any) =>
        f.rssFeedItemsGuid === decodedParam ||
        f.articleSnapshot?.link === decodedParam ||
        f.articleSnapshot?.guid === decodedParam ||
        f.articleSnapshot?.title === decodedParam,
    );

    if (favorite && favorite.articleSnapshot) {
      selectedArticle.value = favorite.articleSnapshot;
    }
  };

  const { mutate: toggleFavorite, asyncStatus: toggleFavoriteStatus } =
    useMutation({
      key: ['toggleFavorite', userId.value],
      mutation: async ({
        articleGuid,
        articleSnapshot,
        isFavorite,
      }: {
        articleGuid: string;
        articleSnapshot: any;
        isFavorite: boolean;
      }) => {
        if (isFavorite) {
          return await $trpc.favorites.delete.mutate({ articleGuid });
        } else {
          return await $trpc.favorites.create.mutate({
            articleGuid,
            articleSnapshot,
          });
        }
      },
      onSuccess: () => {
        queryCache.invalidateQueries({
          key: ['favorites', userId.value],
        });
      },
    });

  const { mutate: updateFavorite, asyncStatus: updateFavoriteStatus } =
    useMutation({
      key: ['updateFavorite', userId.value],
      mutation: async ({
        articleGuid,
        articleSnapshot,
      }: {
        articleGuid: string;
        articleSnapshot: any;
      }) => {
        return await $trpc.favorites.update.mutate({
          articleGuid,
          articleSnapshot,
        });
      },
      onSuccess: () => {
        queryCache.invalidateQueries({
          key: ['favorites', userId.value],
        });
      },
    });

  const isFavorite = (articleGuid: string) => {
    return favoritesList.value.some(
      (f: any) => f.rssFeedItemsGuid === articleGuid,
    );
  };

  return {
    favorites,
    favoritesList,
    selectedArticle,
    asyncStatus,
    toggleFavoriteStatus,
    updateFavoriteStatus,
    selectArticle,
    clearSelection,
    selectArticleFromQuery,
    toggleFavorite,
    updateFavorite,
    isFavorite,
  };
});

