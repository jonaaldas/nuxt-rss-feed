import type { Config } from "drizzle-kit";

export default {
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;