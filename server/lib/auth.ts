import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database';
import * as authSchema from '../database/schema';

const betterAuthSecret = process.env.NUXT_BETTER_AUTH_SECRET!;
const googleClientId = process.env.NUXT_GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.NUXT_GOOGLE_CLIENT_SECRET!;
const betterAuthUrl = process.env.NUXT_BETTER_AUTH_URL!;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
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
  trustedOrigins: [betterAuthUrl],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 72 * 60 * 60, // 72 hours
    },
  },
});
