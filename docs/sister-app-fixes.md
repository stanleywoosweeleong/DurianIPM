# Errors spotted in the sister apps — to fix later

Found while working on Durian IPM. Fix each in its own app, then tick it here.
The Mr. Ganick catalogue app is now taken over by the company itself (the owner built the
demo for them). Its items below are notes to pass on to Mr. Ganick, not for us to fix.

## Mr. Ganick product catalogue
App: https://stanleywoosweeleong.github.io/Mr.Ganickproductcatalogue/ (single `index.html`; data in `const PRODUCTS` / `const PROBLEMS`)

- [ ] **Chlorpyrifos listed as a mix partner** (LEPID 007 SL → durian fruit / flower borer).
      It is on Durian IPM's list of actives banned in Malaysia — remove it, never suggest it.
      Check the other mix partners against the same list when fixing.
- [ ] **BST BOOST SP — "活性磷酸盐" is wrong.** The salt is a phosphonate: **亚磷酸盐**
      (磷酸盐 = phosphate, which is a fertiliser and does not act on Phytophthora).
- [ ] **"PGPR (Plant Growth Promoting Regulator)" is wrong** (BST WP, BST GOLD WP).
      PGPR = **plant growth-promoting rhizobacteria** (植物根际促生菌).
- [ ] **BST GOLD WP percentages add up to 109%** (99% w/w + 10% w/w). BST WP is 90% + 10%;
      check the label for GOLD's real split.
- [ ] **Spelling: "Papillionaceae" → "Papilionaceae"** (LEPID 007 SL, BST BOOST SP).
- [ ] **Whitefly is named "白粉蝶" in Chinese** (SCALE EX-LITE EW; problem `whitefly`).
      白粉蝶 is the cabbage white butterfly; whitefly is **粉虱**.
