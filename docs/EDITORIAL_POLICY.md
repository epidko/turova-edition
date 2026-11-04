# Editorial policy for the public edition

Decided by E. A. Pidko, 2026-11-04. Applies to every element. Applied during normalization in the private working repository (`tools/apply_policy.py`),
with every change logged.

| # | Topic | Rule | Data field |
|---|---|---|---|
| 1 | **Hydrates, solvates, adducts** | Own species record **when distinct**: the book gives it its own property values, or an arrow starts or ends at it. Otherwise it stays a note in the parent. Dehydration arrows then connect two real records. | `hydrate_of: <parent id>` |
| 2 | **Oxidation states** | Charge-balance value for everything. For metallic, nonstoichiometric and mixed-valence solids (sulfides, nitrides, phosphides, hydrides, phases such as UO₂₊ₓ, U₃O₈) it is labelled **formal**. Left blank where undefined: carbides, silicides, solid solutions such as U(O,N,C). Values set editorially (generic families, column position) are labelled **inferred**. | `oxidation_state`, `oxidation_state_basis: formula / formal / inferred` |
| 3 | **Arrows to a box heading** | Point to a **family record** for the whole box (e.g. *uranyl salts*, *uranates(VI)*, *peroxouranates*). Members link to their family. Group statements printed in the heading (colour, typical distances) live on the family, not repeated on each member. | species `kind: family`; members `family: <id>` |
| 4 | **Implied, unprinted values** | Allowed, but **marked inferred** and shown de-emphasised on the site (e.g. C.N. 6 for octahedral UF₆). | property `inferred: true`; `structure.inferred: [field]` |
| 5 | **Mineral names** | Show the **current IMA-accepted name**. Turova's name is kept as `book_name` and shown as a synonym. Varieties are shown as "uraninite (var. bröggerite)". Discredited or redefined names are flagged for checking. | `names.minerals[].{en, book_name, status, printed_ru}` |
| 6 | **Obvious misprints in reactions** | Recorded in corrected form when the chemistry is unambiguous (e.g. «−O₂F₂» → UO₂F₂ in 2 UF₄ + O₂ → UF₆ + UO₂F₂), with an issue note quoting the print. | reaction `issues` |
| 7 | **Arrows across the gutter** (pp. 32 ↔ 33) | Joined into **one reaction** with both Turova pointers. Pairings made only by geometry, without a chemical confirmation, are flagged `to_check`. | reaction `turova.continues` |

General principles (from the architecture): facts only, our own English wording; every value carries `source`;
Turova's printed values are never overwritten. Modern values are added next to them, with a DOI.
