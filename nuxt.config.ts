import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["shadcn-nuxt"],
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
});
