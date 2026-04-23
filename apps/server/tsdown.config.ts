import { defineConfig } from "tsdown";
import { copyFileSync } from "fs";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  noExternal: [/@unspokenscreen\/.*/],
  outExtensions: () => ({ js: ".js" }),
  hooks: {
    "build:done": () => {
      copyFileSync("./src/data/responses.csv", "./dist/responses.csv");
    },
  },
});
