// Build-time data access: reads the YAML records in data/ (the single source of truth).
import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";

const ROOT = path.resolve(process.cwd(), "data");
const cache = {};

function readDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort()
    .map((f) => yaml.load(fs.readFileSync(path.join(dir, f), "utf8")));
}

/** Elements that have data (folders under data/ with species). */
export function elementsWithData() {
  return fs.readdirSync(ROOT).filter((d) => fs.existsSync(path.join(ROOT, d, "species")));
}

export function load(el) {
  if (cache[el]) return cache[el];
  const species = readDir(path.join(ROOT, el, "species"));
  const reactions = readDir(path.join(ROOT, el, "reactions"));
  const byId = Object.fromEntries(species.map((s) => [s.id, s]));
  const sources = yaml.load(fs.readFileSync(path.join(ROOT, "sources.yaml"), "utf8"));
  for (const s of species) {
    s.asReactant = reactions.filter((r) => (r.reactants || []).includes(s.id));
    s.asProduct = reactions.filter((r) => (r.products || []).includes(s.id));
    s.members = species.filter((m) => m.family === s.id);
    s.hydrates = species.filter((m) => m.hydrate_of === s.id);
  }
  cache[el] = { species, reactions, byId, sources };
  return cache[el];
}

export const ELEMENT_NAMES = { U: "Uranium" };
// sheet page 1, 2 → book pages (uranium spread = pp. 32–33)
export const BOOK_PAGE_OFFSET = { U: 31 };
