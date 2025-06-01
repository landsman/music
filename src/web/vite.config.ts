import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { lingui } from "@lingui/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react(), lingui()],
  optimizeDeps: {
    include: ["@tanstack/react-query"],
  },
  base: "./",
});
