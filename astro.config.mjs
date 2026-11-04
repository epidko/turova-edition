// Deployed as a GitHub Pages project site: set SITE and BASE in CI, e.g. SITE=https://<user>.github.io BASE=/turova
import { defineConfig } from "astro/config";
export default defineConfig({
  site: process.env.SITE || "http://localhost:4321",
  base: process.env.BASE || "/",
  trailingSlash: "always",
  build: { format: "directory" },
  // OUT_DIR lets local builds go outside a synced folder (Dropbox locks files during the build)
  outDir: process.env.OUT_DIR || "./dist",
  cacheDir: process.env.CACHE_DIR || "./node_modules/.astro",
});
