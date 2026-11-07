// Bahasa Melayu. Keyed by the English text, so every English string in the app
// (content files, UI strings, inline component strings) gets its Malay form
// without touching the content files. Missing keys fall back to English.
// Regenerate the key list with: node scripts/i18n-strings.mjs out.json
//
// The dictionary (~240 kB) loads only when Malay is chosen, so Chinese and English
// users download less. It is still precached by the service worker for offline use.
let MS = {};
let loading = null;
let version = 0;
export const msReady = () => version > 0;
export function loadMs() {
  if (!loading) loading = import('./ms.json').then(m => { MS = m.default || m; version++; });
  return loading;
}

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
