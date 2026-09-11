import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
      router: {
        routesDirectory: path.resolve(__dirname, "src/routes"),
        generatedRouteTree: path.resolve(__dirname, "src/routeTree.gen.ts"),
        autoCodeSplitting: false,
        codeSplittingOptions: {
          addHmr: false,
        },
        tmpDir: path.resolve(__dirname, ".tanstack-tmp"),
      },
    }),
    tailwindcss(),
    react(),
  ],
  server: { port: 8080, host: true, hmr: { overlay: false } },
  css: {
    transformer: "lightningcss",
  },
  resolve: {
    alias: { "@": "/src" },
    tsconfigPaths: true,
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
    ignoreOutdatedRequests: true,
  },
});