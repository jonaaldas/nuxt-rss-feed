import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: "http://localhost:9292",
});

export type AuthClient = typeof authClient;
