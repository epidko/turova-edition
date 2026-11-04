# Contributing

Thank you for helping to keep this edition accurate and up to date. There are two ways to contribute.

## A. Without git: open an issue

Use one of the forms under **Issues → New issue**:

* **Correction**: something on the site differs from the book, or is wrong.
* **Literature update**: a modern value, structure or reaction, with its DOI.

The maintainer turns accepted issues into data changes.

## B. With git: edit the data and open a pull request

1. Fork the repository (or create a branch if you are a collaborator).
2. Edit or add YAML files under `data/` (format: [docs/DATA_MODEL.md](docs/DATA_MODEL.md)).
3. Run the checks locally:
   ```bash
   npm ci
   npm run validate
   npm run dev        # look at the result at http://localhost:4321
   ```
4. Open a pull request and fill in the template. CI validates the data and builds the site; the maintainer reviews.

### Rules

* **Never overwrite Turova's printed values.** Add a new property item with your source next to them:
  ```yaml
  properties:
    - { property: melting_point, value: 64, unit: °C, conditions: under pressure, source: turova1999 }
    - { property: melting_point, value: 64.05, unit: °C, conditions: "triple point, 151.6 kPa", source: "doi:10.xxxx/yyyy" }
  ```
* **Every value needs a source.** Use `turova1999`, a Turova literature group (`turova-U-14`), or `doi:…`.
* **Corrections of transcription errors** (the site differs from the printed book) cite the book page in the pull request.
* **Probable errors in the book**: keep the printed value and add an `issues` item explaining the problem. Add the correct
  modern value as a separate property with its DOI.
* **New compounds**: new file `data/<El>/species/<id>.yaml`. The id is the element, `-`, then the formula with brackets → `_` and
  the hydrate dot → `-`, e.g. `U-UO2_NO3_2-6H2O`. Ids are permanent.
* **New reactions**: next free number `U-r-NNNN`. Set `type` from the oxidation-state change.
* Follow the [editorial policy](docs/EDITORIAL_POLICY.md) (hydrates, families, formal oxidation states, mineral names).
* Write descriptions in your own words. Do not paste text from copyrighted sources.

### Changing the website

The site is built with [Astro](https://astro.build). Pages are in `src/pages/`, the element map in
`src/pages/[el]/index.astro` and `src/lib/layout.js`, and chemistry helpers in `src/lib/chem.js`. Run `npm run build` before
opening a pull request.

## Licence of contributions

By contributing you agree that your data contributions are licensed under CC BY 4.0 and code under MIT.
