# Inorganic Chemistry in Tables: digital edition

Interactive, extensible edition of the reaction-network data in N. Ya. Turova, *Neorganicheskaya khimiya v tablitsakh*
(Inorganic Chemistry in Tables), Higher Chemical College RAS, Moscow, 1999. The facts are restated in our own words and layout,
every value carries its source, and modern literature is added alongside the original values.

## Data (`data/`)
* `data/<El>/species/<id>.yaml`: one compound, ion or family (schema: `schema/species.schema.json`)
* `data/<El>/reactions/<id>.yaml`: one transformation (schema: `schema/reaction.schema.json`)
* `data/sources.yaml`: Turova 1999 and the literature it cites; new sources use `doi:…`

Editorial rules: see the editorial policy (hydrates, formal oxidation states, families, inferred values, mineral names).

## Develop
```
npm ci
npm run validate          # schemas + cross-references
npm run dev               # live preview at http://localhost:4321
npm run build             # static site + search index in dist/
```
On a synced folder (Dropbox/OneDrive) build elsewhere: `OUT_DIR=/some/local/dir npm run build`.

## Contribute
Edit or add YAML files, run `npm run validate`, open a pull request. CI validates and builds every pull request;
merges to `main` deploy to GitHub Pages.

Data: CC BY 4.0 · Code: MIT
