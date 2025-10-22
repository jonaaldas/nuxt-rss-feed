import { authClient } from "~/lib/auth-client";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    const { data: session } = await authClient.getSession();
    if (!session) {
      return navigateTo("/login");
    }

    const authStore = useAuthStore();
    authStore.session = session;
  }
});
