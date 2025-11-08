<script setup lang="ts">
import { authClient } from '@/lib/auth-client';
import SettingsModal from '@/components/settings-modal.vue';

const authStore = useAuthStore();
const { session } = storeToRefs(authStore);
const router = useRouter();
const isPopoverOpen = ref(false);

const getUserInitials = () => {
  if (!session) return '?';
  const email = session.value?.user?.email || '';
  return email.charAt(0).toUpperCase();
};

const handleLogout = async () => {
  await authClient.signOut();
  router.push('/');
};

const goToDashboard = () => {
  router.push('/dashboard/feed');
};

const handleSettingsClick = (event: Event) => {
  event.stopPropagation();
  isPopoverOpen.value = false;
};
</script>

<template>
  <Popover v-if="session" v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <Button variant="ghost" class="relative h-10 w-10 rounded-full p-0">
        <Avatar class="h-10 w-10 cursor-pointer">
          <AvatarFallback class="bg-primary text-primary-foreground">
            {{ getUserInitials() }}
          </AvatarFallback>
        </Avatar>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-56 p-2" align="end">
      <div class="flex flex-col gap-1">
        <div class="px-2 py-1.5">
          <p class="text-sm font-medium">{{ session.user?.email }}</p>
        </div>
        <Separator />
        <Button variant="ghost" class="w-full justify-start" @click="goToDashboard">
          <Icon name="heroicons:rss-solid" class="w-4 h-4" />
          Dashboard
        </Button>
        <SettingsModal />
        <Separator />
        <Button variant="ghost" class="w-full justify-start text-destructive hover:text-destructive" @click="handleLogout">
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
          Logout
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
