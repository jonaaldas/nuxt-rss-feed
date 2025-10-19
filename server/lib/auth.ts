import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database";
import * as authSchema from "../database/schema";
const {
  private: { betterAuthSecret, googleClientId, googleClientSecret },
  public: { betterAuthUrl },
} = useRuntimeConfig();
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authSchema.user,
      account: authSchema.account,
      session: authSchema.session,
      verification: authSchema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
  baseURL: betterAuthUrl,
  secret: betterAuthSecret,
});
