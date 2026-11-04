// Local build for working copies inside a synced folder (Dropbox/OneDrive lock files while Astro writes them).
// Copies the sources to a local build folder, links node_modules, builds there and indexes for search.
// usage: npm run build:local   → site in $LOCAL_BUILD/dist (default: <tmp>/turova-edition-build/dist)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const src = process.cwd();
const work = process.env.LOCAL_BUILD || path.join(os.tmpdir(), "turova-edition-build");
const skip = new Set(["node_modules", ".git", "dist", ".astro", ".claude"]);
fs.rmSync(path.join(work, "src"), { recursive: true, force: true });
fs.rmSync(path.join(work, "data"), { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });
for (const e of fs.readdirSync(src)) {
  if (skip.has(e)) continue;
  fs.cpSync(path.join(src, e), path.join(work, e), { recursive: true });
}
const nm = path.join(work, "node_modules");
if (!fs.existsSync(nm)) fs.symlinkSync(path.join(src, "node_modules"), nm, "junction");
const env = { ...process.env, OUT_DIR: path.join(work, "dist"), CACHE_DIR: path.join(work, ".cache") };
delete env.LOCAL_BUILD;
execFileSync(process.execPath, [path.join(src, "node_modules/astro/bin/astro.mjs"), "build"], { cwd: work, stdio: "inherit", env });
execFileSync(process.execPath, [path.join(src, "node_modules/pagefind/lib/runner/bin.cjs"), "--site", env.OUT_DIR], { cwd: work, stdio: "inherit" });
console.log(`\nSite built in ${env.OUT_DIR}\nPreview: python -m http.server 4321 --directory "${env.OUT_DIR}"`);
