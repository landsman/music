import process from "node:process";
import { defineConfig, type Plugin } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { lingui } from "@lingui/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";

function denoFmtOnSave(): Plugin {
  const exts = /\.(ts|tsx|js|jsx|css|json|md)$/;
  return {
    name: "deno-fmt-on-save",
    apply: "serve",
    handleHotUpdate({ file }) {
      if (!exts.test(file)) return;
      new Deno.Command("deno", {
        args: ["fmt", file],
        stdout: "null",
        stderr: "inherit",
      }).spawn();
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    denoFmtOnSave(),
    deno(),
    react({
      babel: {
        plugins: ["@lingui/babel-plugin-lingui-macro"],
      },
    }),
    lingui(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: {
        name: process.env.VITE_RELEASE,
        setCommits: { auto: true },
        deploy: { env: process.env.NODE_ENV ?? "production" },
      },
      sourcemaps: {
        filesToDeleteAfterUpload: ["dist/**/*.map"],
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["@tanstack/react-query"],
  },
  base: "./",
});
