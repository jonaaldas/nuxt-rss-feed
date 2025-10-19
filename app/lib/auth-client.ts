import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL! || "http://localhost:9292",
});

export type AuthClient = typeof authClient;
