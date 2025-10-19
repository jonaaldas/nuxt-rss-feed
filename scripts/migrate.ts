import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const databaseUrl = process.env.NUXT_PRODUCTION_DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const main = async () => {
  console.log("Running migrations...");

  const migrationClient = postgres(databaseUrl, { max: 1 });
  const db = drizzle(migrationClient);

  await migrate(db, { migrationsFolder: "./server/database/migrations" });

  await migrationClient.end();

  console.log("Migrations completed!");
};

main().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
