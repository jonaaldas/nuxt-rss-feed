<script setup lang="ts">
import { toast } from 'vue-sonner';

const { session } = useAuthStore();
const { $trpc } = useNuxtApp();
const queryCache = useQueryCache();

interface FeedItem {
  title: string;
  pubDate?: string;
  [key: string]: any;
}

interface Feed {
  id: string;
  title: string;
  url: string;
  feedItems?: FeedItem[];
  createdAt?: string;
  [key: string]: any;
  updatedAt: string;
  userId: string;
}

interface Props {
  feeds: Feed[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  selectFeed: [feed: Feed];
}>();

const handleFeedClick = (feed: Feed) => {
  emit('selectFeed', feed);
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

const { mutate: deleteUrl, asyncStatus: refrefLoadingDeleteUrl } = useMutation({
  key: ['saveRssFeed', session?.user?.id as string],
  mutation: async (id: string) => {
    const response = await $trpc.rss.delete.mutate({ id });
    return response;
  },
  onSuccess: () => {
    queryCache.invalidateQueries({
      key: ['saveRssFeed', session?.user?.id as string],
    });
    queryCache.invalidateQueries({
      key: ['rssFeeds', session?.user?.id as string],
    });
    toast('Feed deleted successfully');
  },
  onError: (error) => {
    toast.error('Failed to delete feed', {
      description: 'There was an error deleting the feed',
    });
  },
});
</script>

<template>
  <Empty v-if="feeds && feeds.length === 0" class="h-full flex flex-col gap-6 justify-center items-center">
    <EmptyHeader class="flex flex-col items-center justify-center">
      <EmptyMedia variant="icon">
        <Icon name="heroicons:rss-20-solid" size="10rem" />
      </EmptyMedia>
      <EmptyTitle>No RSS Feeds Yet</EmptyTitle>
      <EmptyDescription> You haven't added any RSS feeds yet. Get started by adding your first RSS feed. </EmptyDescription>
    </EmptyHeader>
    <EmptyContent class="flex justify-center items-center w-full">
      <div class="flex justify-center items-center w-full min-w-[120px] max-w-40">
        <AddModal class="w-auto min-w-[120px] max-w-40" />
      </div>
    </EmptyContent>
  </Empty>

  <div v-else class="space-y-6">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Your RSS Feeds</h1>
      <p class="text-muted-foreground">Browse and manage your subscribed feeds</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="feed in feeds" :key="feed.id" class="hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50">
        <CardHeader>
          <CardTitle class="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2 w-full flex items-center justify-between">
            <span>{{ feed.title }}</span>
            <Popover class="inline-block ml-auto">
              <PopoverTrigger class="inline-block">
                <Icon v-if="refrefLoadingDeleteUrl == 'idle'" name="heroicons:ellipsis-vertical-20-solid" class="w-4 h-4" />
                <Icon v-else name="svg-spinners:180-ring" class="w-4 h-4 animate-spin" />
              </PopoverTrigger>
              <PopoverContent class="inline-block w-fit">
                <Button @click="deleteUrl(feed.id)" variant="destructive">
                  <Icon name="heroicons:trash-20-solid" class="size-2" />
                </Button>
              </PopoverContent>
            </Popover>
          </CardTitle>
          <CardDescription class="flex flex-col gap-2 mt-2">
            <span class="flex items-center gap-1.5 text-xs">
              <BookOpen class="w-3.5 h-3.5" />
              {{ feed.feedItems?.length || 0 }} articles
            </span>
            <span v-if="getLatestArticleDate(feed)" class="flex items-center gap-1.5 text-xs">
              <Clock class="w-3.5 h-3.5" />
              Last update:
              {{
                new Date(getLatestArticleDate(feed)!).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
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
          <Button @click="handleFeedClick(feed)" variant="secondary" size="sm" class="w-full"> View Feed </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
