import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../database/schema';
const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const databaseUrl = isProduction
  ? process.env.DATABASE_URL!
  : process.env.DATABASE_URL_DEV!;

export const migrationClient = postgres(databaseUrl, { max: 1 });
const queryClient = postgres(databaseUrl);
export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
