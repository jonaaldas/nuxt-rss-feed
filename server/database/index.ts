import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../database/schema";
const {
  private: { databaseUrl },
} = useRuntimeConfig();

export const migrationClient = postgres(databaseUrl, { max: 1 });
const queryClient = postgres(databaseUrl);
export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
