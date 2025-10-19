<script lang="ts"></script>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ExternalLink, Calendar, User } from "lucide-vue-next";
const { $trpc } = useNuxtApp();

const route = useRoute();
const router = useRouter();
const selectedArticle = ref<any>(null);
const selectedFeed = ref<any>(null);

const res = useFetch("rssFeed", async () => {
  const { data: rssFeed } = await $trpc.saveRssFeed.mutate({
    url: "https://www.google.com",
  });
  return rssFeed;
});

// const { data: rssFeeds } = useQuery({
//   key: ["rssFeeds1"],
//   query: async () => {
//     try {
//       const data = await client.rss.$get();
//       return data.json();
//     } catch (error) {
//       throw error;
//     }
//   },
// });

// const articleContent = computed(() => {
//   if (!selectedArticle.value) return null;

//   try {
//     const feedItem = selectedArticle.value;
//     if (feedItem["content:encoded"]) {
//       return feedItem["content:encoded"];
//     }
//     if (feedItem.content) {
//       return feedItem.content;
//     }
//     return feedItem.contentSnippet || null;
//   } catch (error) {
//     return null;
//   }
// });

// const navMain = computed(() => {
//   if (!rssFeeds.value || !("data" in rssFeeds.value)) return [];
//   const data = rssFeeds.value.data;
//   return data?.map((feed) => {
//     const feedItems = Array.isArray(feed.feedItems) ? feed.feedItems : [];
//     return {
//       title: feed.title,
//       url: "/rss/",
//       id: feed.id,
//       items: feedItems.map((item: any) => ({
//         title: item.title,
//         url: "/rss/",
//         isActive: selectedArticle.value?.link === item.link,
//         ...item,
//       })),
//     };
//   });
// });

// const handleArticleSelect = (item: any) => {
//   selectedArticle.value = item;
//   router.push({
//     query: {
//       feed: selectedFeed.value?.id,
//       article: encodeURIComponent(item.link || item.guid || item.title),
//     },
//   });
// };

// const handleFeedSelect = (feed: any) => {
//   selectedFeed.value = feed;
//   selectedArticle.value = null;
//   router.push({
//     query: {
//       feed: feed.id,
//     },
//   });
// };

// const selectFeedFromQuery = () => {
//   const feedParam = route.query.feed as string;
//   if (!feedParam || !rssFeeds.value || !("data" in rssFeeds.value)) return;

//   const feed = rssFeeds.value.data.find(
//     (f: any) => f.id === parseInt(feedParam)
//   );
//   if (feed) {
//     selectedFeed.value = feed;
//   }
// };

// const selectArticleFromQuery = () => {
//   const articleParam = route.query.article as string;
//   if (!articleParam || !rssFeeds.value || !("data" in rssFeeds.value)) return;

//   const decodedParam = decodeURIComponent(articleParam);

//   for (const feed of rssFeeds.value.data) {
//     const feedItems = Array.isArray(feed.feedItems) ? feed.feedItems : [];
//     const article = feedItems.find(
//       (item: any) =>
//         item.link === decodedParam ||
//         item.guid === decodedParam ||
//         item.title === decodedParam
//     );

//     if (article) {
//       selectedArticle.value = article;
//       selectedFeed.value = feed;
//       break;
//     }
//   }
// };

// watch(
//   () => rssFeeds.value,
//   (newValue) => {
//     if (newValue && "data" in newValue) {
//       if (route.query.feed) {
//         selectFeedFromQuery();
//       }
//       if (route.query.article) {
//         selectArticleFromQuery();
//       }
//     }
//   },
//   { immediate: true }
// );

// watch(
//   () => route.query,
//   (newQuery) => {
//     if (rssFeeds.value && "data" in rssFeeds.value) {
//       if (newQuery.feed) {
//         selectFeedFromQuery();
//       } else {
//         selectedFeed.value = null;
//       }

//       if (newQuery.article) {
//         selectArticleFromQuery();
//       } else {
//         selectedArticle.value = null;
//       }
//     }
//   }
// );
</script>

<template>
  <SidebarProvider>
    <AppSidebar :navMain="[]" />
    <SidebarInset>
      <header
        class="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 justify-between"
      >
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/">RSS Feeds</BreadcrumbLink>
              </BreadcrumbItem>
              <template v-if="selectedFeed">
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink
                    v-if="selectedArticle"
                    :href="`/?feed=${selectedFeed.id}`"
                  >
                    {{ selectedFeed.title }}
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>
                    {{ selectedFeed.title }}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </template>
              <template v-if="selectedArticle">
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage class="line-clamp-1">
                    {{ selectedArticle.title }}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ThemeSwitcher class="ml-auto" />
      </header>
      <!-- <div class="flex flex-1 flex-col gap-4 p-4 lg:mx-72">
        <Input type="text" placeholder="Enter RSS URL" v-model="url" />
        <Button @click="saveRss(url)">Add</Button>
      </div> -->
      <div class="w-full max-w-4xl mx-auto px-4 py-8">
        <div
          v-if="!selectedFeed && !selectedArticle"
          class="text-center text-muted-foreground py-20"
        >
          <p class="text-lg">
            Select a feed or article from the sidebar to read
          </p>
        </div>

        <div v-else-if="selectedFeed && !selectedArticle" class="space-y-6">
          <div class="mb-8">
            <h1 class="text-4xl font-bold mb-2">{{ selectedFeed.title }}</h1>
            <div class="flex items-center gap-2">
              <Badge variant="secondary">
                {{ selectedFeed.items?.length || 0 }} articles
              </Badge>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <Card
              v-for="item in selectedFeed.items"
              :key="item.link || item.guid"
              class="hover:shadow-lg transition-shadow cursor-pointer group"
              @click="() => {}"
            >
              <CardHeader>
                <CardTitle
                  class="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2"
                >
                  {{ item.title }}
                </CardTitle>
                <CardDescription class="flex flex-wrap items-center gap-3 mt-2">
                  <span v-if="item.pubDate" class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5" />
                    {{
                      new Date(item.pubDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
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
                  class="text-muted-foreground line-clamp-4 text-sm leading-relaxed"
                >
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
                  @click="() => {}"
                >
                  Read Article
                </Button>
                <Button
                  v-if="item.link"
                  variant="outline"
                  size="sm"
                  as-child
                  @click.stop
                >
                  <a
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1.5"
                  >
                    <ExternalLink class="w-3.5 h-3.5" />
                    Original
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <article
          v-else-if="selectedArticle"
          class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:leading-tight prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-foreground prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-foreground prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-p:text-base prose-p:leading-7 prose-p:mb-6 prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:font-semibold prose-strong:text-foreground prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg prose-pre:shadow-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-primary prose-ol:list-decimal prose-ol:pl-6 prose-hr:border-border prose-hr:my-8 prose-table:overflow-hidden prose-th:bg-muted prose-th:font-semibold prose-td:border-border"
        >
          <h1>{{ selectedArticle.title }}</h1>
          <div class="text-sm text-muted-foreground mb-8">
            <time v-if="selectedArticle.pubDate">{{
              new Date(selectedArticle.pubDate).toLocaleDateString()
            }}</time>
            <a
              v-if="selectedArticle.link"
              :href="selectedArticle.link"
              target="_blank"
              class="ml-4"
              >Read original →</a
            >
          </div>
          <div v-html="'<p>Hello World</p>'"></div>
        </article>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
