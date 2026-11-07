import { useEffect, useState } from 'react';

// Per-device orchard context: crop stage, weather, last-sprayed groups.
// Kept in localStorage (wrapped — private mode must not break the app).
const KEY = 'durianipm_orchard_v1';
const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
// Saved data is checked before use: a malformed value must never crash a pest page.
const read = () => {
  let s; try { s = obj(JSON.parse(localStorage.getItem(KEY))); } catch { s = {}; }
  const lastBy = {};
  for (const [gid, v] of Object.entries(obj(s.lastBy))) {
    const recentMoa = Array.isArray(v?.recentMoa) ? v.recentMoa.filter(k => typeof k === 'string') : [];
    lastBy[gid] = { lastIrac: typeof v?.lastIrac === 'string' ? v.lastIrac : null, recentMoa };
  }
  const trackBy = {};
  for (const [gid, v] of Object.entries(obj(s.trackBy))) if (v === 'organic' || v === 'all') trackBy[gid] = v;
  return {
    stage: typeof s.stage === 'string' ? s.stage : null,
    weather: typeof s.weather === 'string' ? s.weather : null,
    // Products to show: the farmer's usual choice (settings panel), and per-pest changes.
    track: s.track === 'organic' ? 'organic' : 'all',
    trackBy,
    // "Last sprayed" is remembered per pest.
    lastBy,
  };
};

export function useOrchard() {
  const [state, setState] = useState(read);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);
  const set = (patch) => setState(s => ({ ...s, ...patch }));
  return [state, set];
}

const FS_KEY = 'durianipm_fontscale';
// Chinese characters read smaller and thinner than Latin text at the same size,
// so every size step is a little larger in Chinese.
const ZH_BOOST = 1.1;
export function useFontScale(lang) {
  // Steps are 1 / 1.2 / 1.4; older saves (1.1, 1.2) map onto them.
  const [scale, setScale] = useState(() => { try { const v = Number(localStorage.getItem(FS_KEY)) || 1; return v >= 1.3 ? 1.4 : v > 1 ? 1.2 : 1; } catch { return 1; } });
  useEffect(() => {
    document.documentElement.style.fontSize = `${scale * (lang === 'zh' ? ZH_BOOST : 1) * 100}%`;
    try { localStorage.setItem(FS_KEY, String(scale)); } catch { /* ignore */ }
  }, [scale, lang]);
  return [scale, setScale];
}
