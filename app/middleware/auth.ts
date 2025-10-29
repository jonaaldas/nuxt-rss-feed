
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { session } = useAuthStore();
  if (!session) {
    return navigateTo('/login');
  }
});