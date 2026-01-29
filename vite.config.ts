import { defineConfig } from "vite";
import { resolve as r } from "path";
import dts from "vite-plugin-dts";
import { rollupPluginHTML } from "@web/rollup-plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import minifyHTML from "@lit-labs/rollup-plugin-minify-html-literals";
import { compression } from "vite-plugin-compression2";

export default defineConfig((config) => {
  if (config.mode == "lib") {
    return {
      build: {
        outDir: "dist/lib",
        target: "esnext",
        lib: {
          name: "lit-spa",
          entry: {
            "lit-spa": r(import.meta.dirname, "src/index.ts"),
            router: r(import.meta.dirname, "src/entries/router.ts"),
            http: r(import.meta.dirname, "src/entries/http.ts"),
            state: r(import.meta.dirname, "src/entries/state.ts"),
            services: r(import.meta.dirname, "src/entries/services.ts"),
            components: r(import.meta.dirname, "src/entries/components.ts"),
          },
          formats: ["es"],
          fileName: (_format, entryName) => `${entryName}.js`,
        },
        rollupOptions: {
          external: [/^lit/],
          output: {
            chunkFileNames: "chunks/[name].js",
          },
        },
      },
      plugins: [dts({ tsconfigPath: "./tsconfig.lib.json" })],
      publicDir: false,
    };
  }

  return {
    build: {
      outDir: "dist/web",
      rollupOptions: {
        plugins: [
          rollupPluginHTML({
            input: "index.html",
          }),
          resolve(),
          // Minify HTML template literals
          minifyHTML(),
          // Minify JS
          terser({
            ecma: 2020,
            module: true,
          }),
        ],
        preserveEntrySignatures: "strict",
      },
    },
    plugins: [compression()],
  };
});
