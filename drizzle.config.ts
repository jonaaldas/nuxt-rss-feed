import { defineConfig } from "drizzle-kit";
const {
  private: { databaseUrl },
} = useRuntimeConfig();
export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
