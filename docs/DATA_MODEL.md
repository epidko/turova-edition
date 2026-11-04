# Data model

All data are plain YAML files validated against the JSON Schemas in [`schema/`](../schema). One file = one record;
the file name equals the record `id`. Run `npm run validate` after any change.

## Species: `data/<El>/species/<id>.yaml`

A compound, an ion, a nonstoichiometric phase, an isotope, or a **family** (a group of compounds treated together).

| Field | Meaning |
|---|---|
| `id` | Stable identifier: element + `-` + formula slug, e.g. `U-UO2_NO3_2-6H2O`. Never change or reuse an id. |
| `formula` | Formula in [mhchem](https://mhchem.github.io/MathJax-mhchem/) input notation: `UO2(NO3)2.6H2O`, `[UO2(H2O)6]^2+`, `UO_{2+x}`. |
| `names.en` | English name. `names.trivial_en`: other names. |
| `names.minerals[]` | `en` = current IMA name; `book_name` = name used by Turova if different; `status` = accepted / variety / discredited / to_check; `printed_ru` = Russian name as printed. |
| `element` | The element whose sheet the record belongs to. |
| `oxidation_state` | Oxidation state of that element (decimal for mixed valence, e.g. 5.333 for U₃O₈). |
| `oxidation_state_basis` | `formula` (charge balance), `formal` (charge-balance value for metallic, nonstoichiometric or mixed-valence solids), `inferred` (assigned editorially, e.g. for generic families). Blank where undefined (carbides, silicides). |
| `class` | Compound class (oxide, halide, oxohalide, uranate, oxoacid_salt, coordination_compound, …). It sets the row on the element map. |
| `kind` | compound / ion / family / phase / solid_solution / isotope. |
| `generic` | For families with a placeholder in the formula: `{symbol: M, values: [K, Rb, Cs]}`. |
| `family` | Id of the family record this compound belongs to. |
| `hydrate_of` | For hydrates, solvates and adducts: id of the parent record. |
| `appearance`, `solubility`, `reactivity` | Short English statements in our own words. |
| `structure` | `description`, `structure_type`, `crystal_system`, `coordination_number`, `polyhedron`; `inferred: [fields]` lists values implied but not printed. |
| `properties[]` | Typed numerical data, see below. |
| `notes[]` | Further English remarks. |
| `issues[]` | Open or resolved editorial points: `type` = source_suspect / ambiguous / to_check / confirmed / done, `text`, `by`, `date`. |
| `refs[]` | Keys into `data/sources.yaml` (Turova's literature groups, or `doi:…`). |
| `turova[]` | Pointers to where the compound appears on the original sheets (`page`: sheet page, `block`, `entry`). |

### Properties

```yaml
- property: bond_distance      # controlled list, see schema
  value: 2.41                  # number, or a string such as ">1900", "1e-22"
  value_max: 2.51              # optional, for ranges
  unit: Å                      # controlled list: °C, K, kJ/mol, g/cm3, μB, Å, °, V, years, %
  pair: U–Cl                   # for bond distances/angles
  site: terminal               # terminal, bridging, axial, equatorial …
  phase: α                     # polymorph or state (α, β, gas, crystal)
  conditions: under pressure
  approx: true                 # printed with "~"
  inferred: true               # implied, not printed
  source: turova1999           # or doi:10.xxxx/…
  note: free text
```

Units follow the book: temperatures in °C, ΔH°f (298 K) in kJ/mol, distances in Å, density in g/cm³, μ_eff in μB.

**Adding a modern value:** add a new list item with `source: doi:…`. Leave the Turova item in place, so the site shows both.

## Reactions: `data/<El>/reactions/<id>.yaml`

```yaml
id: U-r-0037
reactants: [U-UF4]                # species ids
products: [U-U4F17]
reagents: [XeF2, UF6]             # other reagents; alternatives listed separately
byproducts: []
conditions: { temperature_C: 300, pressure: null, irradiation: null, solvent: null, catalyst: null, electrochemical: null, text: null }
type: oxidation                   # oxidation / reduction / no_redox / disproportionation / comproportionation / unknown
equilibrium: false
notes: [ … ]
issues: [ … ]
source: turova1999
turova: { page: 1, arrow: p1D-a09, block: null, continues: null }
```

`type` follows the line style in Turova's diagrams: solid = no change of oxidation state, dashed = oxidation,
dash-dot = reduction. The redox change can be on any element (e.g. a peroxide ligand), not only the central one.

## Sources: `data/sources.yaml`

* `turova1999`: the book.
* `turova-<El>-<n>`: literature group *n* of that element's reference list in the book (footnote mark *n* on the
  sheet). Each has a list of `works` with the printed citation (`raw`), the abstract code of *Referativnyi Zhurnal
  Khimiya* (`rzh`), authors, journal, year, volume, pages and `doi` (to be filled).
* New literature: add an entry keyed `doi:<DOI>`, or cite the DOI directly in a property's `source`.
