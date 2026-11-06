# DurianIPM content corrections — evidence and verification

Reviewed 6 November 2026. Baseline: `b88b4a8cdc0f5dc4bb6dcdf2041d55cccab14811`.

This change addresses reproducible content and logic problems. It does not add, replace or search for diagnostic photographs, and does not add look-alike comparisons. It is not a complete agronomic or regulatory validation of the catalogue.

## Evidence and changes

| Issue and reproducible proof | Change | Basis and limits |
| --- | --- | --- |
| `src/core/mrl.js` defined a 0.01 default explicitly borrowed from EU/Japan. `MrlLine.jsx` merged `none` and `unknown` into that default, while `ui.js` called it a China MRL and equated it with non-detection. | Removed numerical fallback; preserve named, checked-absence and unchecked states. Retain recorded values and exemptions as existing app data, show source-check date and official links. | The code itself proves the unsupported jurisdiction transfer and loss of data-state distinction. No claim that the Chinese rule has now been exhaustively determined: unresolved entries require verification. [Chinese official standard publication](https://www.nhc.gov.cn/sps/c100088/202602/c0c4a9266f7e43cda1bf3bec59fc2786.shtml). [Malaysia DOA durian table](https://mymrl.doa.gov.my/Commodities/15) is explicitly a different market. |
| Root → whole-tree yellowing/wilting → no creature returned a likely disease and treatment options. The app's evidence lesson already states its scores are not field-validated. | Every result states it is provisional; nonspecific whole-tree wilt without an observed culprit is low-confidence. Add a root-specific inspection prompt and review of non-pest causes. | Avoid claiming a validated probability from heuristic scores. The candidate list remains available; this is not a newly validated diagnostic model. [EPA IPM principles](https://www.epa.gov/safepestcontrol/integrated-pest-management-ipm-principles) supports identification and monitoring before control. |
| The same Phytophthora result generated P07 → 4 → 40 even though the option text describes injection/root/canker treatment and leaf/fruit treatment. | Withhold the automatic sequence and explain that treatments for different affected parts are not interchangeable. Options remain readable. | Proven by the app's own option descriptions and ranking loop. No replacement disease programme is invented. Regression checks cover all/organic/conventional filters, crop-stage choices and last-used groups. |
| The first lesson promised halved harm and prescribed a chemical/organic sequence with a 5–7-day repeat. | Replace with monitoring-led choices; remove blanket repeated-spray timing and universal two-spray rule; add insecticide windows and label limits. | [EPA IPM principles](https://www.epa.gov/safepestcontrol/integrated-pest-management-ipm-principles) and [IRAC intermediate training](https://irac-online.org/documents/insecticide-resistance-training-intermediate-module/). Neither establishes a universal 50% harm reduction from alternation. The revision makes no numerical risk-reduction promise. |
| Two diamide recommendations used blanket bee-safety language; the flowering lesson treated absence of a red warning as permission. | Qualify risk by product and exposure, and state that absence of a warning does not establish safety. | [NPIC chlorantraniliprole fact sheet](https://npic.orst.edu/factsheets/chlorantraniliprole.html) describes formulation, exposure and bee-life-stage distinctions. [EPA registration fact sheet](https://www3.epa.gov/pesticides/chem_search/reg_actions/registration/fs_PC-090100_01-Apr-08.pdf) documents test-specific endpoints. This does not reclassify every diamide's hazard. |
| A government advisory appeared as “Durian study”; a green-ash injection-wound study appeared as “Same pest, other crop”. | Scope badges now mean durian-related, other crop/context, or general reference. The evidence lesson explains that scope is not study quality or study design. | Reproducible from the references already listed on the Phytophthora page. We did not invent study-design classifications for unreviewed papers. |
| Confirmation and full nonchemical actions were collapsed after treatment recommendations. | Move both before chemical options and open them by default; disclose the existing threshold-validation limitation at point of use. | Browser-verified order. [EPA IPM principles](https://www.epa.gov/safepestcontrol/integrated-pest-management-ipm-principles) supports monitoring, identification and prevention before control. |

## Verification

- `npm test`: 32 passing tests, including three new behavioural regressions.
- `npm run build`: completed, including PWA service-worker generation.
- Existing test filesystem traversal fixed with `fileURLToPath` so it works on Windows paths containing spaces; photo implementation unchanged.
- Browser: English and Chinese residue cards; fruit-borer page order and revised pollinator wording; whole-tree wilt flow, root prompt, provisional result, withheld disease rotation; revised first lesson.
- Browser text checks: provisional result present; mixed-site rotation notice present; suggested sequence absent on the disease result; nonchemical actions occur before chemical options.
- Screenshots accompany the deliverable. They show the local revised version, not an already deployed GitHub Pages release.

## Remaining limits

No new Malaysian registration, PHI or Chinese residue value was asserted. Existing recorded limits and exemptions still need primary-standard validation. The broader chemical catalogue, application rates, photographs and offline field behaviour were not fully audited. The install reported 17 dependency advisories, and the build reported an existing large-bundle warning; dependency upgrades are outside this content change.
