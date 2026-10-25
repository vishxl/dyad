import "./scripts/lib/legacy-env.mjs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const ReactCompilerConfig = {};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: Number(process.env.NEXTBILLION_HEADLESS_VITE_PORT ?? 4173),
    // Hosted deployments reach Vite through a reverse proxy that forwards the
    // public Host header (see context/nextbillion-web-deployment.md). Vite's default
    // allowedHosts check blocks unknown Host headers — allowlist ours.
    allowedHosts: process.env.NEXTBILLION_VITE_ALLOWED_HOSTS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    proxy: {
      "/rpc": {
        target: `http://127.0.0.1:${process.env.NEXTBILLION_HEADLESS_PORT ?? 3000}`,
        changeOrigin: true,
      },
      "/ws": {
        target: `ws://127.0.0.1:${process.env.NEXTBILLION_HEADLESS_PORT ?? 3000}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
