import { defineConfig } from "vite";
import { resolve as r } from "path";
import dts from "vite-plugin-dts";
import eslintPlugin from "vite-plugin-eslint";
import {rollupPluginHTML} from "@web/rollup-plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import viteCompression from "vite-plugin-compression";

export default defineConfig((config) => {
  if (config.mode == "lib") {
    return {
      preview: {
        port: 3000,
      },
      build: {
        outDir: "dist/lib",
        target: "esnext",
        lib: {
          name: "lit-spa",
          fileName: "lit-spa",
          entry: r(__dirname, "src/index.ts"),
          formats: ["es"],
        },
        rollupOptions: {
          external: [/^lit/, 'demo/**'],
        },
        exclude: ['demo/**'],
      },
      plugins: [dts()],
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
          (minifyHTML as any).default(),
          // Minify JS
          terser({
            ecma: 2020,
            module: true,
          }),
        ],
        preserveEntrySignatures: "strict",
      },
    },
    plugins: [
      eslintPlugin(),
      viteCompression({
        verbose: false,
        filter: (fileName: string) =>
          /\.(js|css|html|txt|xml|json|svg|ico|ttf|otf|eot)$/.test(fileName),
        algorithm: "brotliCompress",
        ext: ".br",
      }),
    ],
  };
});
