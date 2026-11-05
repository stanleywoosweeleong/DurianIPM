import { useEffect, useState } from 'react';

// Per-device orchard context: crop stage, weather, last-sprayed groups.
// Kept in localStorage (wrapped — private mode must not break the app).
const KEY = 'durianipm_orchard_v1';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

export function useOrchard() {
  const [state, setState] = useState(() => ({ stage: null, weather: null, recentMoa: [], ...read() }));
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);
  const set = (patch) => setState(s => ({ ...s, ...patch }));
  return [state, set];
}

const FS_KEY = 'durianipm_fontscale';
// Chinese characters read smaller and thinner than Latin text at the same size,
// so every size step is a little larger in Chinese.
const ZH_BOOST = 1.1;
export function useFontScale(lang) {
  const [scale, setScale] = useState(() => { try { const v = Number(localStorage.getItem(FS_KEY)) || 1; return v >= 1.2 ? 1.2 : v > 1 ? 1.1 : 1; } catch { return 1; } });
  useEffect(() => {
    document.documentElement.style.fontSize = `${scale * (lang === 'zh' ? ZH_BOOST : 1) * 100}%`;
    try { localStorage.setItem(FS_KEY, String(scale)); } catch { /* ignore */ }
  }, [scale, lang]);
  return [scale, setScale];
}
