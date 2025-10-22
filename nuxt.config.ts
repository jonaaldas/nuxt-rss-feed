import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

const env = process.env.NODE_ENV;
const isProduction = env === "production";
const script = isProduction
  ? [
      {
        defer: true,
        src: isProduction
          ? "https://umami-production-772f.up.railway.app/script.js"
          : "",
        "data-website-id": "91f3aa7f-b2a0-4ce5-a388-db6824353524",
      },
    ]
  : [];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    head: {
      script,
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: [
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@pinia/colada-nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  colorMode: {
    classSuffix: "",
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  css: ["./styles.css"],
  alias: {
    "@": fileURLToPath(new URL("./app", import.meta.url)),
  },
  vite: {
    plugins: [tailwindcss(), tsconfigPaths()],
  },
  devServer: {
    port: 9292,
  },
  build: {
    transpile: ["trpc-nuxt"],
  },
  ssr: false,
  runtimeConfig: {
    public: {
      betterAuthUrl: process.env.NUXT_BETTER_AUTH_URL!,
    },
    private: {
      betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET!,
      databaseUrl: process.env.NUXT_DATABASE_URL!,
      googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID!,
      googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET!,
      productionDatabaseUrl: process.env.NUXT_PRODUCTION_DATABASE_URL!,
    },
  },
  nitro: {
    devStorage: {
      cache: {
        driver: "fs",
        base: "./cache",
      },
    },
    storage: {
      cache: {
        driver: "upstash",
        base: process.env.NUXT_REDIS_URL,
      },
    },
  },
});
