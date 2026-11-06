// Bahasa Melayu. Keyed by the English text, so every English string in the app
// (content files, UI strings, inline component strings) gets its Malay form
// without touching the content files. Missing keys fall back to English.
// Regenerate the key list with: node scripts/i18n-strings.mjs out.json
import MS_DICT from './ms.json';

export const MS = MS_DICT;
export const toMs = (s) => (typeof s === 'string' && MS[s]) || s;

// A lang-keyed map ({zh:{…}, en:{…}}) gets its Malay side built from English.
const cache = new WeakMap();
export function msSide(map) {
  if (map.ms) return map.ms;
  if (!cache.has(map)) {
    const out = {};
    for (const [k, v] of Object.entries(map.en || {})) out[k] = typeof v === 'string' ? toMs(v) : v;
    cache.set(map, out);
  }
  return cache.get(map);
}
