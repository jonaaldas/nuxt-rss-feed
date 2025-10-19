import { createAuthClient } from "better-auth/vue";

const {
  public: { betterAuthUrl },
} = useRuntimeConfig();
export const authClient = createAuthClient({
  baseURL: betterAuthUrl,
});
