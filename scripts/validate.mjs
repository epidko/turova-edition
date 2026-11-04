// Validate all data before build: JSON schemas + cross-references. Exit code 1 on any problem.
// usage: npm run validate
import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import Ajv2020 from "ajv/dist/2020.js";

const ROOT = path.resolve("data");
const ajv = new Ajv2020({ allErrors: true, strict: false });
const speciesSchema = ajv.compile(JSON.parse(fs.readFileSync("schema/species.schema.json", "utf8")));
const reactionSchema = ajv.compile(JSON.parse(fs.readFileSync("schema/reaction.schema.json", "utf8")));
const sources = yaml.load(fs.readFileSync(path.join(ROOT, "sources.yaml"), "utf8"));
const problems = [];
const readDir = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith(".yaml")).map((f) => [f, yaml.load(fs.readFileSync(path.join(d, f), "utf8"))]) : []);

for (const el of fs.readdirSync(ROOT).filter((d) => fs.existsSync(path.join(ROOT, d, "species")))) {
  const species = readDir(path.join(ROOT, el, "species"));
  const reactions = readDir(path.join(ROOT, el, "reactions"));
  const ids = new Set(species.map(([, s]) => s.id));
  for (const [f, s] of species) {
    if (!speciesSchema(s)) problems.push(`${el}/species/${f}: ${ajv.errorsText(speciesSchema.errors)}`);
    if (`${s.id}.yaml` !== f) problems.push(`${el}/species/${f}: file name does not match id ${s.id}`);
    for (const k of ["family", "hydrate_of"]) if (s[k] && !ids.has(s[k])) problems.push(`${s.id}: ${k} ${s[k]} does not exist`);
    for (const r of s.refs || []) if (!sources[r]) problems.push(`${s.id}: source ${r} missing in sources.yaml`);
    for (const p of s.properties || []) if (p.source && !sources[p.source] && !p.source.startsWith("doi:")) problems.push(`${s.id}: property source ${p.source} unknown`);
  }
  const rids = new Set();
  for (const [f, r] of reactions) {
    if (!reactionSchema(r)) problems.push(`${el}/reactions/${f}: ${ajv.errorsText(reactionSchema.errors)}`);
    if (rids.has(r.id)) problems.push(`${r.id}: duplicate id`); rids.add(r.id);
    for (const i of [...(r.reactants || []), ...(r.products || [])]) if (!ids.has(i)) problems.push(`${r.id}: species ${i} does not exist`);
    if (r.source && !sources[r.source] && !r.source.startsWith("doi:")) problems.push(`${r.id}: source ${r.source} unknown`);
  }
  console.log(`${el}: ${species.length} species, ${reactions.length} reactions checked`);
}
if (problems.length) { console.error(problems.join("\n")); console.error(`\n${problems.length} problem(s)`); process.exit(1); }
console.log("All data valid.");
