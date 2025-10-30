import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { session } = storeToRefs(useAuthStore());
  if (!session.value) {
    return navigateTo('/login');
  }
});
