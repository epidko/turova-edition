# Method: from printed tables to verified data

The base layer of this edition was produced from the printed book in five stages. The pilot element is uranium
(book pp. 32–33, with its reference list on pp. 121–122 and the conventions on pp. 4–5). The scans, the verbatim
Russian transcription and the review logs are kept in a private working repository. Only the facts, restated in our own words, are
published here.

## 1. Scanning and transcription
* Pages scanned at 300 dpi. The scanner's embedded OCR was unusable: it read the Cyrillic as Latin characters.
* Each sheet was split into regions. Every text block, compound entry, table cell and reaction arrow was transcribed
  verbatim from zoomed crops, with formulas in mhchem notation and the original coordinates kept.
* Uncertainties were recorded at token level as *illegible*, *ambiguous* or *source_suspect* (read clearly but chemically
  doubtful).

## 2. Independent second reading
* A second, independent pass compared every block and arrow with the scan, character by character.
* For uranium it found 2 real errors (one arrow direction, one misplaced reagent label) and ~15 minor position notes.
  The 112 literature references were also read twice; no transcription errors were found.
* Corrections were applied through a logged corrections file, never by silent edits.

## 3. Automated checks
* Oxidation state of the central atom computed from each formula, compared with its column on the sheet. This catches
  misread subscripts.
* Physical plausibility: m.p. < b.p. (except subliming compounds), bond lengths within element-specific ranges, sign of ΔH.
* Every abbreviation checked against the book's own list (p. 5).
* Footnote marks matched one-to-one with the reference list.
* Arrow line style (oxidation / reduction / no change) checked against the oxidation states of its end points.

## 4. Manual review
* Every block was reviewed by the editor in a side-by-side tool (scan crop next to the rendered transcription).
  Decisions and comments were applied as traceable actions.
* Probable misprints in the book are kept, flagged and explained, e.g.:
  * U–Br distance of 2.16 Å for UBr₄ (U–Br bonds are ~2.6–2.8 Å);
  * "uranocene" for U(C₅H₅)₄ (uranocene is U(C₈H₈)₂);
  * by-product printed as O₂F₂ in UF₄ + O₂ → UF₆ (recorded as UO₂F₂).

## 5. Normalization into English records
* Each compound entry became a species record with typed properties and units. Each arrow, and each transformation
  written inside the text, became a reaction record with exact end points, checked on the scan.
* Descriptions are concise English statements, not translations of Turova's sentences.
* Editorial decisions that apply to the whole book are documented in [EDITORIAL_POLICY.md](EDITORIAL_POLICY.md).
* All records validate against the schemas, and all cross-references resolve.

## What remains open
* Each compound page lists its open editorial points (to check against modern literature).
* DOIs for the literature cited by Turova are still to be added.
* Further elements will be added following the same procedure.
