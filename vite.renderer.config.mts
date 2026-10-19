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
    port: Number(process.env.DYAD_HEADLESS_VITE_PORT ?? 4173),
    proxy: {
      "/rpc": {
        target: `http://127.0.0.1:${process.env.DYAD_HEADLESS_PORT ?? 3000}`,
        changeOrigin: true,
      },
      "/ws": {
        target: `ws://127.0.0.1:${process.env.DYAD_HEADLESS_PORT ?? 3000}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
