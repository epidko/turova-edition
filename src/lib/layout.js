// Build-time layout of the element map: x = oxidation state (true scale), y = compound class band.
import { CLASS_ORDER, CLASS_LABEL, plainFormula } from "./chem.js";

export const COL = 640;   // px per oxidation-state unit
const NODE_W = 128, NODE_H = 30, GAP_X = 8, GAP_Y = 8;
// integer oxidation states get wide cells (3 per row); mixed-valence compounds a narrow column halfway between
const perRow = (bin) => (Number.isInteger(bin) || bin === NA ? 3 : 1);
const NA = -1.2;

export function mapLayout(species, reactions) {
  // x bins: "—" (undefined) at -1, otherwise the oxidation state rounded to 0.25
  const binOf = (s) => {
    const ox = s.oxidation_state;
    if (ox == null) return NA;
    return Math.abs(ox - Math.round(ox)) < 0.01 ? Math.round(ox) : Math.floor(ox) + 0.5;
  };
  const classes = CLASS_ORDER.filter((c) => species.some((s) => s.class === c));
  const cells = {};
  for (const s of species) (cells[`${s.class}|${binOf(s)}`] ??= []).push(s);
  for (const k in cells) cells[k].sort((a, b) => (a.kind === "family" ? -1 : 0) - (b.kind === "family" ? -1 : 0)
    || (a.oxidation_state ?? 0) - (b.oxidation_state ?? 0) || a.formula.localeCompare(b.formula));

  // band height = tallest cell in that class
  let y = 0;
  const bands = [];
  for (const c of classes) {
    const tallest = Math.max(...Object.entries(cells).filter(([k]) => k.startsWith(c + "|")).map(([k, v]) => Math.ceil(v.length / perRow(+k.split("|")[1]))));
    const h = tallest * (NODE_H + GAP_Y) + 34;
    bands.push({ cls: c, label: CLASS_LABEL[c] || c, y, h });
    y += h;
  }
  const bandY = Object.fromEntries(bands.map((b) => [b.cls, b.y]));

  const nodes = [];
  for (const [k, list] of Object.entries(cells)) {
    const [cls, bin] = k.split("|");
    const cx = +bin * COL;
    const pr = perRow(+bin);
    list.forEach((s, i) => {
      const col = i % pr, row = Math.floor(i / pr);
      const width = Math.min(list.length, pr) * (NODE_W + GAP_X) - GAP_X;
      nodes.push({ data: { id: s.id, label: plainFormula(s.formula), cls: s.class, ox: s.oxidation_state, family: s.kind === "family" ? 1 : 0,
                            name: s.names?.en || "", deg: (s.asReactant?.length || 0) + (s.asProduct?.length || 0) },
                   position: { x: cx - width / 2 + col * (NODE_W + GAP_X) + NODE_W / 2, y: bandY[cls] + 28 + row * (NODE_H + GAP_Y) + NODE_H / 2 } });
    });
  }

  const ids = new Set(species.map((s) => s.id));
  const edges = [];
  for (const r of reactions) {
    for (const a of r.reactants || []) for (const b of r.products || []) {
      if (!ids.has(a) || !ids.has(b) || a === b) continue;
      edges.push({ data: { id: `${r.id}:${a}>${b}`, source: a, target: b, rid: r.id, type: r.type, eq: r.equilibrium ? 1 : 0,
                           label: [...(r.reagents || []).map(plainFormula), r.conditions?.temperature_C != null ? `${r.conditions.temperature_C} °C` : ""].filter(Boolean).join(", ") } });
    }
  }

  const oxTicks = [NA, 0, 1, 2, 3, 4, 5, 6];
  return { nodes, edges, bands, col: COL, xmin: NA * COL - 260, xmax: 6.5 * COL + 200,
           oxTicks: oxTicks.map((b) => ({ x: b * COL, label: b === NA ? "n/a" : b === 0 ? "0" : `+${b}` })), height: y };
}
