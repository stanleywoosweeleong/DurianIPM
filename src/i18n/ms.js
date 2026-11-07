// Bahasa Melayu. Keyed by the English text, so every English string in the app
// (content files, UI strings, inline component strings) gets its Malay form
// without touching the content files. Missing keys fall back to English.
// Regenerate the key list with: node scripts/i18n-strings.mjs out.json
//
// Shipped in the main bundle: Malaysia is on 4G/5G, and loading it with the app means
// Malay never flashes English first.
import MS_DICT from './ms.json';
const MS = MS_DICT;
let version = 1;
export const msReady = () => true;
export const loadMs = () => Promise.resolve();

export const toMs = (s) => (typeof s === 'string' && MS[s]) || s;

// A lang-keyed map ({zh:{…}, en:{…}}) gets its Malay side built from English.
const cache = new WeakMap();
export function msSide(map) {
  if (map.ms) return map.ms;
  const hit = cache.get(map);
  if (hit && hit.version === version) return hit.out;
  const out = {};
  for (const [k, v] of Object.entries(map.en || {})) out[k] = typeof v === 'string' ? toMs(v) : v;
  cache.set(map, { version, out });
  return out;
}
