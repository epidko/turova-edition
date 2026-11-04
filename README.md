# Inorganic Chemistry in Tables: digital edition

**Live site:** https://epidko.github.io/turova-edition/

An interactive, open and extensible edition of the reaction-network chemistry compiled by **N. Ya. Turova** in
*Neorganicheskaya khimiya v tablitsakh* (Inorganic Chemistry in Tables), Higher Chemical College of the Russian Academy
of Sciences, Moscow, 1999.

For every element the book shows its compounds in each oxidation state, with properties and structures, and the
reactions that connect them, backed by ~5800 literature references. This project turns that knowledge into
**structured, citable, machine-readable data**: one record per compound and per reaction, every value with its source.
It also presents the data as an interactive website that can be **updated with modern literature**.

> This is not a reproduction of the book. Facts (compounds, numbers, reactions, conditions) were extracted, verified
> against the printed pages and restated in our own words and layout, with attribution. See [Method](docs/METHOD.md).

| | |
|---|---|
| Elements available | **U** (uranium): 239 compounds/families, 118 reactions, 36 literature groups (112 references) |
| Maintainer | Evgeny A. Pidko, TU Delft |
| Data licence | [CC BY 4.0](data/LICENSE.md) |
| Code licence | [MIT](LICENSE) |

---

## What you can do on the site

* **Periodic table** → pick an element.
* **Element map**: compounds arranged by oxidation state (left → right) and compound class (top → bottom), joined by
  reaction arrows styled as in Turova's diagrams (dashed = oxidation, dash-dot = reduction, solid = no change).
  Click a compound to highlight its chemistry; double-click to open it.
* **Compound pages**: properties with units and sources, structure, appearance and solubility, how it is formed, what
  it reacts to, family and hydrate links, mineral names, the literature Turova cites, and open editorial notes.
* **Search** by formula (`UF6`), name (`uranyl nitrate`) or mineral (`liebigite`, also old names such as `uranothallite`).

## Repository layout

```
data/
  sources.yaml              bibliography: Turova 1999 and the literature it cites (+ new sources by DOI)
  U/species/<id>.yaml       one compound, ion or compound family
  U/reactions/<id>.yaml     one transformation
schema/                     JSON Schemas for species and reactions (the contract for all data)
src/                        Astro website (pages, element map, components)
scripts/validate.mjs        schema + cross-reference checks (run in CI on every pull request)
docs/                       data model, editorial policy, method
.github/                    CI/CD workflow, issue and pull-request templates
```

Example record (abridged):

```yaml
# data/U/species/U-UF6.yaml
id: U-UF6
formula: UF6                 # mhchem notation
names: { en: uranium hexafluoride }
oxidation_state: 6
oxidation_state_basis: formula
class: halide
properties:
  - { property: melting_point, value: 64, unit: °C, conditions: under pressure, source: turova1999 }
  - { property: enthalpy_formation, value: -2180, unit: kJ/mol, source: turova1999 }
refs: [turova-U-14]
turova: [{ page: 2, block: p2D-06, entry: 0 }]    # pointer to the original sheet (book p. 33)
```

Full description: **[docs/DATA_MODEL.md](docs/DATA_MODEL.md)**. Editorial rules: **[docs/EDITORIAL_POLICY.md](docs/EDITORIAL_POLICY.md)**.

## Quality and provenance

Every record went through: transcription from 300-dpi scans → independent second reading → automated chemistry checks
(oxidation states from formulas, bond-length and m.p./b.p. plausibility, the book's own abbreviation list) → manual
review against the scan → normalization into English records → schema and cross-reference validation.
Probable misprints in the original are **kept and flagged**, never silently "fixed". Turova's printed values are never
overwritten; newer values are added next to them, with a DOI. Details: **[docs/METHOD.md](docs/METHOD.md)**.

## Contributing

Corrections and modern literature values are very welcome. You can contribute without git through an issue form, or
with a pull request that edits the YAML files. CI validates every change, and the maintainer reviews it before it goes live.
See **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Run locally

Requires Node.js ≥ 22.

```bash
npm ci
npm run validate   # check all data
npm run dev        # http://localhost:4321 with live reload
npm run build      # static site + search index in dist/
```

If your working copy lives in a synced folder (Dropbox, OneDrive), use `npm run build:local` instead of `npm run build`.
The sync client locks files while Astro writes them. `build:local` copies the sources to a local temporary folder,
builds there, and prints the output path (set `LOCAL_BUILD` to choose the folder).

Deployment: every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
(validate → build → GitHub Pages). Pull requests are validated and built, but not deployed.

## How to cite

Please cite both this edition and the original book (see [CITATION.cff](CITATION.cff)):

* Pidko, E. A. (ed.) *Inorganic Chemistry in Tables: digital edition.* https://github.com/epidko/turova-edition
* Turova, N. Ya. *Neorganicheskaya khimiya v tablitsakh.* Moscow: Higher Chemical College RAS, 1999.

## Acknowledgements

All chemical knowledge in the base layer comes from N. Ya. Turova's tables and the literature they cite.
Digitization and normalization were assisted by AI tools under the maintainer's supervision and review.
