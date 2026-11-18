# Errors spotted in the sister apps — to fix later

Found while working on Durian IPM. Fix each in its own app, then tick it here.
The Mr. Ganick catalogue app is now taken over by the company itself (the owner built the
demo for them and shared the corrected code). Fixed in v1.11.4 (7 Nov 2026), except BST GOLD.

## Mr. Ganick product catalogue
App: https://stanleywoosweeleong.github.io/Mr.Ganickproductcatalogue/ (single `index.html`; data in `const PRODUCTS` / `const PROBLEMS`)

- [x] **Chlorpyrifos listed as a mix partner** (LEPID 007 SL → durian fruit / flower borer).
      It is on Durian IPM's list of actives banned in Malaysia — remove it, never suggest it.
      Check the other mix partners against the same list when fixing.
- [x] **BST BOOST SP — "活性磷酸盐" is wrong.** The salt is a phosphonate: **亚磷酸盐**
      (磷酸盐 = phosphate, which is a fertiliser and does not act on Phytophthora).
- [x] **"PGPR (Plant Growth Promoting Regulator)" is wrong** (BST WP, BST GOLD WP).
      PGPR = **plant growth-promoting rhizobacteria** (植物根际促生菌).
- [ ] **BST GOLD WP percentages add up to 109%** (99% w/w + 10% w/w). BST WP is 90% + 10%;
      check the label for GOLD's real split. **Still open — for Mr. Ganick:** the printed brochure
      itself says 99% + 10% (owner's photo, 7 Nov 2026), so the app copies the source correctly;
      only the company can give the real split. The catalogue (v1.11.5) shows a note on BST GOLD WP
      saying the percentages are as printed and await the company's confirmation.
      Web check (7 Nov 2026): Baba's own shop (babashop.com.my, 277 products) lists only regular BST
      (90% + 10%, matching the catalogue); BST GOLD and BST BOOST are not listed online. Ask Mr. Ganick.

### For Mr. Ganick's next brochure print (the printed page has these too)
- BST GOLD WP: ingredients add up to 109% (99% + 10% w/w).
- "Natural PGPR (Natural Plant Growth Promoting **Regulator**)" → PGPR = plant growth-promoting
  **rhizobacteria**.
- "Papillionaceae" → **Papilionaceae** (BST BOOST SP; also LEPID 007 SL in the catalogue).
- [x] **Spelling: "Papillionaceae" → "Papilionaceae"** (LEPID 007 SL, BST BOOST SP).
- [x] **Whitefly is named "白粉蝶" in Chinese** (SCALE EX-LITE EW; problem `whitefly`).
      白粉蝶 is the cabbage white butterfly; whitefly is **粉虱**.

## Stem, bark and pinhole borers — keep in step with Durian IPM (18 Nov 2026)
Durian IPM now: (1) longhorn stem borer = Cerambycidae only, with Rhytidodera simulans and a
second Batocera ("B. gultata" as printed, unverified) from Brown 1997; (2) a new **Bark borers**
page (Indarbela/Squamura bark-eating caterpillars, Conopia/Synanthedon clearwing moths) — rarely
kills a grown tree; (3) **chlorantraniliprole**: *Limited* on longhorn grubs (no tunnel trial; 38–55%
vs imidacloprid 59–86% by trunk infusion on Anoplophora), *Best fit* on bark borers (best of 8 on
Indarbela in pomegranate; US extension bark spray for clearwings); (4) **emamectin benzoate**:
strongest longhorn evidence (89% fewer grubs, >99% less frass in year 2, Anoplophora, willow) and
now *Good* for pinhole borers (Vietnam durian program; sycamore injection −65%);
(5) pinhole borer species on durian: Xyleborus similis (trunk/base), X. fornicatus (branches after
harvest) — Lương Thị Duyên et al. 2018, sanitation + light traps + stage-timed trunk sprays: 4% vs 32%.
- [ ] **Trunk-disease app** — borer species list and any chlorantraniliprole wording to match.
- [ ] **Pinholeborer app** — add the Vietnam durian program (timing: after harvest, each flush,
      flowering, fruit set; light traps; remove attacked branches) and emamectin; X. similis on the trunk.
      Do not name the banned active used in that program.
- [ ] **Pest-MoA rotation guide** — check stem-borer rows: chlorantraniliprole is not a longhorn-grub tool.
- [ ] **agripro-dipm-app** — its `moa.js` still lists chlorantraniliprole for the mango stem borer.
