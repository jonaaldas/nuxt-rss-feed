import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../database/schema";

const databaseUrl = process.env.NUXT_DATABASE_URL!;

export const migrationClient = postgres(databaseUrl, { max: 1 });
const queryClient = postgres(databaseUrl);
export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
