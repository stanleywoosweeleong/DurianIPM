// China GB 2763-2026 maximum residue limits that apply to DURIAN, per active.
// Fetched from the FoodMate GB 2763 portal (2763.foodmate.net) on 2026-11-05.
// Rule: a 榴莲 row if there is one; otherwise the most specific fruit GROUP
// that contains durian (spiny inedible-peel tropical fruit → inedible-peel
// tropical fruit → tropical & subtropical fruit → all fruit). Limits set for
// another single fruit (pineapple, mango…) do NOT apply to durian.
// Re-run the fetch when GB 2763 is revised.

// Chart actives, keyed by English name. basis: 'durian' = durian row; 'tropical' = whole tropical-fruit group.
export const CHINA_DURIAN_BY_NAME = {"Acephate": {"mrl": "0.02", "basis": "tropical"}, "Carbosulfan": {"mrl": "0.01", "basis": "tropical"}, "Cypermethrin": {"mrl": "1", "basis": "durian"}, "Dimethoate": {"mrl": "0.01", "basis": "tropical"}, "Fenitrothion": {"mrl": "0.5", "basis": "tropical"}};
// Local actives, keyed by app id.
export const CHINA_DURIAN_BY_ID = {};
// Actives whose GB 2763 page was checked and has NO limit covering durian.
export const CHINA_CHECKED_NAMES = new Set(["Bifenazate", "Etoxazole", "Abamectin", "Acephate", "Acetamiprid", "Afidopyropen", "Amitraz", "Azadirachtin", "Bifenthrin", "Buprofezin", "Carbaryl", "Carbosulfan", "Cartap hydrochloride", "Chlorantraniliprole", "Chlorfenapyr", "Chromafenozide", "Clothianidin", "Cyantraniliprole", "Cyflumetofen", "Cypermethrin", "Deltamethrin", "Diafenthiuron", "Diflubenzuron", "Dimethoate", "Dinotefuran", "Emamectin benzoate", "Esfenvalerate", "Ethiprole", "Etofenprox", "Fenitrothion", "Fenobucarb", "Fenoxycarb", "Fenpyroximate", "Fenthion", "Fipronil", "Flonicamid", "Flubendiamide", "Flupyradifurone", "Hexaflumuron", "Hexythiazox", "Imidacloprid", "Indoxacarb", "Isoprocarb", "Lambda-cyhalothrin", "Lufenuron", "Malathion", "Metaflumizone", "Methoxyfenozide", "Novaluron", "Propargite", "Pymetrozine", "Pyridaben", "Pyridalyl", "Pyriproxyfen", "Rotenone", "Spinetoram", "Spinosad", "Spirodiclofen", "Spirotetramat", "Sulfoxaflor", "Thiamethoxam", "Tolfenpyrad", "Triflumezopyrim"]);
export const CHINA_CHECKED_IDS = new Set(["metaldehyde", "pyraclostrobin", "azoxystrobin", "carbendazim", "copper", "cyazofamid", "difenoconazole", "dimethomorph", "fosetyl", "glufosinate", "hexaconazole", "mancozeb", "metalaxyl", "permethrin", "prochloraz", "propiconazole", "propineb", "spiromesifen", "tebuconazole", "thiophanate-methyl", "validamycin"]);
// GB 2763 exempt list (豁免农药清单): no MRL needed. App ids.
export const CHINA_EXEMPT = new Set(['bacillus-thuringiensis', 'bacillus-subtilis', 'trichoderma', 'beauveria-bassiana', 'metarhizium', 'purpureocillium']);

// Where no limit is set, the EU (Reg. 396/2005, Art. 18) and Japan apply a default of 0.01 mg/kg —
// in practice "no detectable residue". Used as the safe working limit when China sets none.
export const DEFAULT_MRL = 0.01;

/** { kind: 'value'|'exempt'|'none'|'unknown', mrl?, basis? } for an active from CHEMICALS. */
export function chinaMrl(c) {
  if (CHINA_EXEMPT.has(c.id)) return { kind: 'exempt' };
  const hit = CHINA_DURIAN_BY_ID[c.id] || CHINA_DURIAN_BY_NAME[c.name?.en];
  if (hit) return { kind: 'value', mrl: hit.mrl, basis: hit.basis };
  if (CHINA_CHECKED_IDS.has(c.id) || CHINA_CHECKED_NAMES.has(c.name?.en)) return { kind: 'none' };
  return { kind: 'unknown' };
}
