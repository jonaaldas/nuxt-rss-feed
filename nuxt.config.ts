import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";
// <script
//   defer
//   src="https://umami-production-772f.up.railway.app/script.js"
//   data-website-id="91f3aa7f-b2a0-4ce5-a388-db6824353524"
// ></script>;
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        {
          defer: true,
          src: "https://umami-production-772f.up.railway.app/script.js",
          "data-website-id": "91f3aa7f-b2a0-4ce5-a388-db6824353524",
        },
      ],
    },
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
});
