<script setup lang="ts">
import {
  ExternalLink,
  Calendar,
  User,
  Heart,
  Trash2,
  Loader2,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const router = useRouter();
const favoritesStore = useFavoritesStore();

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const handleArticleSelect = (favorite: any) => {
  if (favorite.articleSnapshot) {
    const articleId = encodeURIComponent(
      favorite.articleSnapshot.link ||
        favorite.articleSnapshot.guid ||
        favorite.articleSnapshot.title ||
        favorite.rssFeedItemsGuid,
    );
    // Find the feed that contains this article
    const dashboardStore = useDashboardStore();
    if (dashboardStore.rssFeeds && 'data' in dashboardStore.rssFeeds) {
      const feed = dashboardStore.rssFeeds.data.find((f: any) => {
        const feedItems = Array.isArray(f.feedItems) ? f.feedItems : [];
        return feedItems.some(
          (item: any) =>
            item.link === favorite.articleSnapshot?.link ||
            item.guid === favorite.articleSnapshot?.guid ||
            item.title === favorite.articleSnapshot?.title,
        );
      });
      if (feed) {
        router.push(`/dashboard/feed/${feed.id}/article/${articleId}`);
        return;
      }
    }
    // Fallback: navigate without feed ID and let the route handler find it
    router.push(`/dashboard/feed/0/article/${articleId}`);
  }
};

const handleDeleteFavorite = async (favorite: any, event: Event) => {
  event.stopPropagation();
  try {
    await favoritesStore.toggleFavorite({
      articleGuid: favorite.rssFeedItemsGuid,
      articleSnapshot: favorite.articleSnapshot || {},
      isFavorite: true,
    });
    toast.success('Favorite removed');
  } catch (error: any) {
    toast.error('Failed to remove favorite', {
      description: error.message || 'An error occurred',
    });
  }
};
</script>

<template>
  <div class="w-full mx-auto px-4 py-8 max-w-7xl">
    <div
      v-if="favoritesStore.asyncStatus === 'loading'"
      class="flex items-center justify-center h-64">
      <Loader2 class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <div
      v-else-if="favoritesStore.favoritesList.length === 0"
      class="flex flex-col items-center justify-center h-64 text-center">
      <Heart class="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
      <h2 class="text-2xl font-bold mb-2">No favorites yet</h2>
      <p class="text-muted-foreground">
        Start favoriting articles to see them here
      </p>
    </div>

    <div v-else class="space-y-6">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Your Favorites</h1>
        <div class="flex items-center gap-2">
          <Badge variant="secondary">
            {{ favoritesStore.favoritesList.length }}
            {{
              favoritesStore.favoritesList.length === 1 ? 'article' : 'articles'
            }}
          </Badge>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="favorite in favoritesStore.favoritesList"
          :key="favorite.id"
          class="hover:shadow-lg transition-shadow cursor-pointer group relative">
          <CardHeader>
            <div class="flex items-start justify-between gap-2">
              <CardTitle
                class="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
                {{ (favorite.articleSnapshot as any)?.title || 'Untitled' }}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8 shrink-0"
                @click.stop="handleDeleteFavorite(favorite, $event)">
                <Trash2
                  v-if="favoritesStore.toggleFavoriteStatus !== 'loading'"
                  class="w-4 h-4 text-destructive" />
                <Loader2 v-else class="w-4 h-4 animate-spin text-destructive" />
              </Button>
            </div>
            <CardDescription
              v-if="favorite.articleSnapshot"
              class="flex flex-wrap items-center gap-3 mt-2">
              <span
                v-if="(favorite.articleSnapshot as any)?.pubDate"
                class="flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5" />
                {{
                  new Date(
                    (favorite.articleSnapshot as any).pubDate,
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              </span>
              <span
                v-if="(favorite.articleSnapshot as any)?.creator"
                class="flex items-center gap-1.5">
                <User class="w-3.5 h-3.5" />
                {{ (favorite.articleSnapshot as any).creator }}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent @click="handleArticleSelect(favorite)">
            <p
              v-if="(favorite.articleSnapshot as any)?.contentSnippet"
              class="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
              {{ (favorite.articleSnapshot as any).contentSnippet }}
            </p>
            <p v-else class="text-muted-foreground italic text-sm">
              No preview available
            </p>
          </CardContent>
          <CardFooter class="flex gap-2" @click.stop>
            <Button
              variant="default"
              size="sm"
              class="flex-1"
              @click="handleArticleSelect(favorite)">
              Read Article
            </Button>
            <Button
              v-if="(favorite.articleSnapshot as any)?.link"
              variant="outline"
              size="sm"
              as-child>
              <a
                :href="(favorite.articleSnapshot as any).link"
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
  </div>
</template>