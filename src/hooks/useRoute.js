import { useEffect, useState, useCallback } from 'react';

// Tiny hash router: "#/group/thrips" → { name: 'group', id: 'thrips' }.
// Hash routing keeps GitHub Pages happy and makes the phone's back button work.
// A malformed link (e.g. "#/group/%") must never stop the app from starting.
const decode = (s) => { try { return decodeURIComponent(s); } catch { return null; } };
const parse = () => {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').map(decode);
  if (parts.some(p => p === null)) return { name: 'home', id: null, sub: null };
  const [name = 'home', id = null, sub = null] = parts;
  return { name: name || 'home', id, sub };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const go = (path) => { window.location.hash = path.startsWith('#') ? path : `#/${path}`; };
export const back = () => (window.history.length > 1 ? window.history.back() : go(''));
export const href = (path) => `#/${path}`;
export const useGo = () => useCallback(go, []);
