import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    const { data: session } = await authClient.getSession();
    if (!session) {
      return navigateTo("/login");
    }
  }
});
