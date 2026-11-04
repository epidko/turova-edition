// Chemistry helpers shared by pages (build time) and the map script (client side, pure functions only).
import katex from "katex";
import "katex/contrib/mhchem";

/** Render an mhchem formula to HTML (build time). */
export function ce(f) {
  if (!f) return "";
  try {
    return katex.renderToString(`\\ce{${f}}`, { throwOnError: false, output: "html", strict: false });
  } catch {
    return escapeHtml(f);
  }
}

/** Render a reagent string: formulas via mhchem, free text as text. */
export function reagent(x) {
  if (!x) return "";
  const f = String(x).replace(/\$/g, "");
  return /^[A-Za-z0-9()[\]{}+\-.^_ ·]+$/.test(f) && /[A-Z]/.test(f) ? ce(f) : prose(x);
}

/** English text with chemical formulas typeset: tokens like UF4, C2H4Cl2, [UO2]2+ get Unicode sub/superscripts. */
export function prose(t) {
  return escapeHtml(t).replace(/(?<![\w-])((?:\(?[A-Z][a-z]?\d*\)?\d*){2,}|[A-Z][a-z]?\d+)(?![\w])/g,
    (tok) => (/\d/.test(tok) ? plainFormula(tok) : tok));
}

export function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
export function oxLabel(s) {
  const ox = s.oxidation_state;
  if (ox === null || ox === undefined) return "—";
  const v = Number.isInteger(ox) ? (ox === 0 ? "0" : `+${ox}`) : `+${(+ox).toFixed(2).replace(/0$/, "")}`;
  return v;
}
export function oxRoman(ox) {
  return Number.isInteger(ox) ? ROMAN[ox] : null;
}

export const CLASS_LABEL = {
  element: "Element", isotope: "Isotopes", hydride: "Hydrides", oxide: "Oxides", hydroxide: "Hydroxides & oxide hydrates",
  oxoacid_salt: "Oxoacid salts", uranate: "Uranates", peroxo: "Peroxo compounds", halide: "Halides", oxohalide: "Oxohalides",
  pseudohalide: "Pseudohalides", chalcogenide: "Chalcogenides", pnictide: "Pnictides", carbide: "Carbides", silicide: "Silicides",
  boron_compound: "Boron compounds", alkoxide: "Alkoxides", amide: "Amides", carboxylate: "Carboxylates",
  organometallic: "Organometallics", coordination_compound: "Coordination compounds", aqua_ion: "Aqua ions", other: "Other",
};
// Row order of the element map, following Turova's column logic (oxide → hydrated forms → salts → binaries → complexes).
export const CLASS_ORDER = ["element", "isotope", "oxide", "hydroxide", "uranate", "peroxo", "oxoacid_salt", "carboxylate",
  "halide", "oxohalide", "pseudohalide", "coordination_compound", "chalcogenide", "pnictide", "carbide", "silicide", "hydride",
  "boron_compound", "alkoxide", "amide", "organometallic", "aqua_ion", "other"];

export const PROP_LABEL = {
  melting_point: "Melting point", boiling_point: "Boiling point", sublimation_temperature: "Sublimation temperature",
  decomposition_temperature: "Decomposition temperature", transition_temperature: "Phase transition", ignition_temperature: "Ignition temperature",
  enthalpy_formation: "ΔH°f (298 K)", density: "Density", magnetic_moment: "μ_eff", solubility_product: "Solubility product",
  stability_constant: "Stability constant", hydrolysis_constant: "Hydrolysis constant", acidity_constant: "Acidity constant",
  electrode_potential: "Electrode potential E°", lattice_a: "Lattice a", lattice_b: "Lattice b", lattice_c: "Lattice c",
  bond_distance: "Bond distance", bond_angle: "Bond angle", coordination_number: "Coordination number", half_life: "Half-life",
  natural_abundance: "Natural abundance", electronegativity: "Electronegativity", other: "Other",
};
export const PROP_ORDER = Object.keys(PROP_LABEL);

export const TYPE_LABEL = { oxidation: "oxidation", reduction: "reduction", no_redox: "no redox change",
  disproportionation: "disproportionation", comproportionation: "comproportionation", unknown: "unclassified" };

export function propValue(p) {
  let v = p.value;
  if (typeof v === "string" && /^1e-?\d+$/.test(v)) v = `10<sup>${v.slice(2)}</sup>`;
  else if (typeof v === "number" && v < 0) v = `−${Math.abs(v)}`;
  else v = escapeHtml(v);
  const max = p.value_max != null ? `–${p.value_max}` : "";
  return `${p.approx ? "~" : ""}${v}${max}${p.unit ? " " + escapeHtml(p.unit) : ""}`;
}

/** mhchem input → plain Unicode (for graph labels and titles). */
const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉", "+": "₊", "-": "₋", n: "ₙ", x: "ₓ", m: "ₘ", ".": ".", "/": "/" };
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "-": "⁻", I: "ᴵ", V: "ⱽ" };
const toSub = (t) => [...t].map((c) => SUB[c] ?? c).join("");
const toSup = (t) => [...t].map((c) => SUP[c] ?? c).join("");
export function plainFormula(f) {
  if (!f) return "";
  let s = String(f).replace(/\$/g, "");
  s = s.replace(/\^\{([^}]*)\}/g, (_, t) => toSup(t)).replace(/\^([0-9]*[+\-])/g, (_, t) => toSup(t));
  s = s.replace(/_\{([^}]*)\}/g, (_, t) => toSub(t));
  s = s.replace(/\.(\d*\/?\d*)/g, (_, k) => "·" + k);           // hydrate dot, keep coefficient
  s = s.replace(/([A-Za-z)\]])(\d+)/g, (_, a, d) => a + toSub(d)); // stoichiometric digits
  return s;
}
