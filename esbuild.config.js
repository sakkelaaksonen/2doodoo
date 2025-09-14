// esbuild.config.js
import { build } from "esbuild";

build({
  entryPoints: [
    "src/js/main.js", // main app
    "src/js/browsertest.js", // QUnit browser tests
  ],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: "esm",
  outdir: "_site/js", // output directory for all bundles
  splitting: false, // set to true if you use code splitting
}).catch(() => process.exit(1));
