# Durian IPM — how this app thinks

A pest-and-disease helper for Malaysian durian farmers, in 中文 / English / Bahasa Melayu.
Live at https://stanleywoosweeleong.github.io/DurianIPM/ (GitHub Pages, deployed on every push to `main`).

The owner wants an app with **character**, not one anyone could build. Read this before
changing content or tone. These rules came out of long discussions with the owner;
do not "tidy them away".

## Voice and character

- **Farmer language.** Short, practical sentences, as a trusted neighbour would say them.
- **"One of the ways", never "the only right way".** Farmers' practices vary a lot; a correct
  method stated as the only one makes the app look untrustworthy. Present options, best fit
  first, and say "if what you do now works on your trees, keep doing it".
- **The alternation approach — 一轮化学，一轮有机 (one round chemical, one round organic).**
  This is the app's signature idea. Keep the lesson and the rotation that supports it.
- **Keep the real technical term, and explain it.** Never swap a technical word for a plain
  one — that removes the farmer's chance to learn the word dealers and extension officers use.
  Use the term, then explain it: add it to `src/core/glossary.js` (tap-to-explain underline
  plus the "Words to know" page) or explain it right after in the sentence.
- **Trait-based diagnosis:** "spotted something → best fit". Tiles, not chips (bigger to tap).

## Accuracy

- **Every claim evidence-cited.** Durian sources first; otherwise say it comes from another
  crop or is a general reference (the `scope` on refs). If it cannot be verified, say
  "unverified" — never invent figures.
- **Never name actives banned in Malaysia** anywhere in visible text (only the search answer
  in `REMOVED` may). Tests enforce this, in all three languages.
- **China MRL** (`src/core/mrl.js`, GB 2763-2026): a durian or fruit-group limit if set,
  otherwise "none set". The 0.01 mg/kg is the **EU/Japan default** — a safe target, not a
  China rule; never word it as China's default.
- Owner's field knowledge, already decided:
  - Trunk cankers: **scrape, never cut** into the trunk.
  - Fosetyl-Al gave poor results in the owner's hands; phosphonate is the main tool, and trunk
    injection is "one of the ways" (it wounds the trunk), alongside bark spray.
  - Fruit flies are a **minor** durian pest. Plant bugs mainly matter on **young trees**.
  - Validamycin is **FRAC U18** (no longer 26).
  - Fipronil around cankers is used against ants and insects feeding on the ooze.
- **Mr. Ganick organic range** (`src/core/ganick.js`): organic products are hard to find in
  Malaysia and this reputable range is available, so its products sit **inside the option for
  their way of working** (e.g. T-MAX in insect-killing fungi), listed first. Ranking
  (`recommend.js`): an option holding a Mr. Ganick product ranks above every "Limited" option;
  among equal ratings, Mr. Ganick first, then organic, then chemical. A product sold for a pest
  is **never shown under a "Limited" rating**: if its option is rated Limited, or the page has
  no option of that type, it gets its own "Mr. Ganick" option marked "Maker's use" (厂家用途),
  ranked above every Limited option; the generic option keeps its real evidence rating. Organic only → only organic options and products. Name, actives and what it is for;
  no link to their catalogue (the company runs it now), **no doses**, no praise, only products
  listed for a durian problem, never the catalogue's chemical mix partners. Pests with no
  Mr. Ganick product simply show none. Never suggest a banned active, from any source.
- Content objects are `{ en, zh }`. Malay comes from `src/i18n/ms.json`, keyed by the English
  text; text added later can carry Malay inline with `s3(en, zh, ms)` (or a `ms` key).
- `npm test` fails if any visible English string has no Malay form. To find what is missing:
  `node scripts/i18n-strings.mjs out.json`. Malay is Bahasa Malaysia (not Indonesian), plain,
  with the shared word list (perosak, racun kulat, giliran, kelulut, pangkal batang, kikis,
  bena hijau for leafhoppers — not "lompat daun"…).
- In Malay mode, Chinese product names are hidden. The header button always shows the
  **current** language; the first launch asks for the language and remembers it.

## Look

- One soft **paper** tone (`bg-paper`, #fcfbf7) on every surface — easier on the eyes than
  pure white. Meaning goes in coloured borders, headings and badges, not tinted panels.
- Dark forest green #114b2d for actions. Chinese text is set a step larger and heavier.

## Working on it

- `npm test` (node --test) and `npm run build` before every push; check pages in a browser
  (Playwright) in all three languages. Push to `main`.
- The service worker uses `registerType: 'prompt'` with an update toast (`src/main.jsx`);
  the whole bar is the Update button and it always reloads.
- Errors spotted in a sister app go into `docs/sister-app-fixes.md` (fixed later, one app at a time).
- Sister apps that share facts with this one must be kept in step, and their service-worker
  cache version bumped when changed: the trunk-disease app, the Pinholeborer app and the
  Pest-MoA rotation guide (`moarotationguide`, built with `bash rebuild.sh index.html`).
