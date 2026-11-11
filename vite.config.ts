import { defineConfig } from "vite";

export default defineConfig({
  base: "/AmpliYorker/",
  build: {
    outDir: "dist",
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});
