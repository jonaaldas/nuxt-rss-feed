<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next';
import { useMutation, useQueryCache } from '@pinia/colada';
import { ref } from 'vue';
const { session } = useAuthStore();
import { Input } from '@/components/ui/input';
import { toast } from 'vue-sonner';
const { $trpc } = useNuxtApp();
const url = ref<string>('');
const isOpen = ref<boolean>(false);
const queryCache = useQueryCache();

const { mutate: saveRssFeed, asyncStatus: saveRssFeedLoading } = useMutation({
  key: ['rssFeeds', session?.user?.id as string],
  mutation: async ({ url }: { url: string }) => {
    const response = await $trpc.rss.saveRssFeed.mutate({ url });
    if (response.error) {
      throw new Error(response.error as string);
    }
    return response.data;
  },

  onSuccess: (data) => {
    url.value = ''; // Clear the input after success
    isOpen.value = false; // Close the dialog
  },
  onError: (error) => {
    console.error(error);
  },
  onSettled: () => {
    queryCache.invalidateQueries({
      key: ['rssFeeds', session?.user?.id as string],
    });
  },
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline" class="w-[85%]">
        <Icon
          v-if="saveRssFeedLoading == 'idle'"
          name="heroicons:plus"
          class="w-4 h-4" />
        <Icon
          v-else
          name="svg-spinners:180-ring"
          class="w-4 h-4 animate-spin" />
        Add a new feed
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add a new feed</DialogTitle>
        <DialogDescription>
          Add the URL of the feed you want to add.
        </DialogDescription>
      </DialogHeader>
      <Input v-model="url" placeholder="https://example.com/feed.xml" />
      <DialogFooter>
        <Button
          variant="secondary"
          @click="() => saveRssFeed({ url })"
          :disabled="!url || saveRssFeedLoading !== 'idle'">
          <Icon
            v-if="saveRssFeedLoading == 'idle'"
            name="heroicons:plus"
            class="w-4 h-4" />
          <Icon
            v-else
            name="svg-spinners:180-ring"
            class="w-4 h-4 animate-spin" />
          Add feed
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>