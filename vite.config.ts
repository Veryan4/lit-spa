import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  preview: {
    port: 3000,
  },
  build: {
    target: "esnext",
    lib: {
      name: "lit-spa",
      fileName: "lit-spa",
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: /^lit/,
    },
  },
  plugins: [dts()],
});
