// Build the static search index for the built site (OUT_DIR or ./dist).
import { execFileSync } from "node:child_process";
const site = process.env.OUT_DIR || "dist";
execFileSync(process.execPath, ["node_modules/pagefind/lib/runner/bin.cjs", "--site", site], { stdio: "inherit" });
