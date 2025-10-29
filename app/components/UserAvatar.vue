<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';

const { session } = useAuthStore();
const router = useRouter();

const getUserInitials = () => {
  if (!session) return '?';
  const email = session.user?.email || '';
  return email.charAt(0).toUpperCase();
};

const handleLogout = async () => {
  await authClient.signOut();
  router.push('/');
};

const goToDashboard = () => {
  router.push('/dashboard');
};
</script>

<template>
  <Popover v-if="session">
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
        <Button
          variant="ghost"
          class="w-full justify-start"
          @click="goToDashboard">
          Dashboard
        </Button>
        <Button
          variant="ghost"
          class="w-full justify-start text-destructive hover:text-destructive"
          @click="handleLogout">
          Logout
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>