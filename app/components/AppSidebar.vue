<script setup lang="ts">
import { toast } from "vue-sonner";
import { useFuse } from "@vueuse/integrations/useFuse";
import type { SidebarProps } from "@/components/ui/sidebar";
import {
    ChevronRight,
    Rss,
    Calendar,
    RefreshCcw,
    Loader2,
} from "lucide-vue-next";
import SearchForm from "@/components/SearchForm.vue";
import { useMutation, useQueryCache } from "@pinia/colada";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "../components/ui/badge";
import AddModal from "@/components/add-modal.vue";
import type NavItem from "../../types/rss";

const { $trpc } = useNuxtApp();
const queryCache = useQueryCache();
const props = defineProps<SidebarProps & { navMain: NavItem[] }>();
const { session } = useAuthStore();

const { mutate: refreshFeed, asyncStatus: refreshLoading } = useMutation({
    key: ["saveRssFeed", session?.user?.id as string],
    mutation: async () => {
        const response = await $trpc.refresh.mutate();
        if (response.error) {
            throw new Error(response.error as string);
        }
        return response.data;
    },
    onMutate: () => {
        emit("refreshFeed", true);
    },
    onSuccess: (data) => {
        emit("refreshFeed", false);
        toast("Feeds refreshed successfully");
    },
    onError: (error) => {
        console.error(error);
        toast.error("Failed to refresh feeds", {
            description: error.message,
        });
    },
    onSettled: () => {
        queryCache.invalidateQueries({
            key: ["saveRssFeed", session?.user?.id as string],
        });
        queryCache.invalidateQueries({
            key: ["rssFeeds", session?.user?.id as string],
        });
    },
});

const emit = defineEmits<{
    selectArticle: [item: NavItem];
    selectFeed: [feed: NavItem];
    refreshFeed: [refresh: boolean];
}>();

const handleArticleClick = (item: NavItem) => {
    emit("selectArticle", item);
};

const handleFeedClick = (feed: NavItem) => {
    emit("selectFeed", feed);
};

const handleFeedRefresh = () => {
    emit("refreshFeed", true);
};

const data = [
    "John Smith",
    "John Doe",
    "Jane Doe",
    "Phillip Green",
    "Peter Brown",
];

const input = shallowRef("");
const searching = ref(false);
const sideBarData = ref<NavItem[]>(props.navMain);
const isOpen = computed(() => (input.value == "" ? false : true));
const handleSearchInput = (value: string) => {
    const options = {
        fuseOptions: {
            includeScore: true,
            keys: ["items.title", "items.content"],
            includeMatches: true,
        },
    };
    input.value = value;
    const { results } = useFuse(input.value, props.navMain, options);
    console.log(results.value);
    sideBarData.value = results.value.map((res) => {
        const items = res.item.items;
        if (!items) return res.item;
        const matches = res.matches;
        const refIndex = matches?.map((match) => match.refIndex);
        if (!refIndex) return res.item;
        const filteredItems = items.filter((item, index) =>
            refIndex.includes(index),
        );
        return {
            ...res.item,
            items: filteredItems,
        };
    });
};

const searchResults = computed(() => {
    if (input.value) {
        return sideBarData.value;
    } else {
        return props.navMain;
    }
});
</script>

<template>
    <Sidebar v-bind="props" class="border-r border-border/50">
        <SidebarHeader class="border-b border-border/50 p-4">
            <div class="flex items-center gap-2 mb-4">
                <Rss class="w-6 h-6 text-primary" />
                <h2 class="text-lg font-semibold">RSS Feeds</h2>
            </div>
            <SearchForm @input="handleSearchInput" />
        </SidebarHeader>
        <SidebarContent class="gap-3 p-3">
            <div
                v-if="refreshLoading === 'loading'"
                class="flex items-center justify-center h-full opacity-50"
            >
                <Loader2 class="w-4 h-4 animate-spin" />
            </div>
            <Collapsible
                v-else
                v-for="item in searchResults"
                :key="item.title"
                :title="item.title"
                class="group/collapsible"
                :default-open="isOpen"
                :open="isOpen ? true : undefined"
            >
                <SidebarGroup class="p-0">
                    <SidebarGroupLabel
                        as-child
                        class="group/label p-4 text-sm font-medium text-sidebar-foreground hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/20 group-data-[state=open]/collapsible:border-border/30"
                    >
                        <CollapsibleTrigger
                            class="flex items-center justify-between w-full"
                        >
                            <div
                                class="flex items-center gap-3 min-w-0 flex-1 pr-3"
                                @click.stop="handleFeedClick(item)"
                            >
                                <Rss class="w-4 h-4 text-primary shrink-0" />
                                <span class="truncate text-left flex-1">{{
                                    item.title
                                }}</span>
                                <Badge
                                    variant="secondary"
                                    class="text-xs px-2 py-0.5 shrink-0"
                                >
                                    {{ item.items?.length || 0 }}
                                </Badge>
                            </div>
                            <ChevronRight
                                class="w-4 h-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                            />
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent
                        class="transition-all duration-200 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                    >
                        <SidebarGroupContent class="p-2">
                            <SidebarMenu class="space-y-1">
                                <SidebarMenuItem
                                    v-for="childItem in item.items"
                                    :key="childItem.title"
                                    class="group"
                                >
                                    <SidebarMenuButton
                                        :is-active="childItem.isActive"
                                        class="p-3 hover:bg-muted/70 cursor-pointer data-[active=true]:bg-primary/10 data-[active=true]:border-l-2 data-[active=true]:border-primary"
                                        @click="handleArticleClick(childItem)"
                                    >
                                        <div
                                            class="flex items-center gap-3 w-full"
                                        >
                                            <Calendar
                                                class="text-muted-foreground shrink-0 w-4 h-4"
                                            />
                                            <div class="flex-1 min-w-0">
                                                <p
                                                    class="text-sm truncate font-medium leading-5 text-foreground group-hover:text-primary transition-colors group-data-[active=true]:text-primary group-data-[active=true]:font-semibold"
                                                >
                                                    {{ childItem.title }}
                                                </p>
                                            </div>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        </SidebarContent>
        <SidebarFooter class="flex flex-row gap-2">
            <AddModal />
            <Button variant="secondary" class="w-[15%]" @click="refreshFeed">
                <RefreshCcw class="w-4 h-4" />
            </Button>
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
</template>
