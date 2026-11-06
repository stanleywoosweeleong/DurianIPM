import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { UI_STRINGS } from './ui.js';
import { toMs, msSide } from './ms.js';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'durianipm_lang';
const DEFAULT_LANG = 'zh'; // Chinese is default per user spec
export const VALID_LANGS = ['zh', 'en', 'ms'];
const HTML_LANG = { zh: 'zh-CN', en: 'en', ms: 'ms' };
// What the language button shows: always the CURRENT language.
export const LANG_LABEL = { zh: '中文', en: 'English', ms: 'Bahasa Melayu' };
export const LANG_SHORT = { zh: '中文', en: 'EN', ms: 'BM' };

export function LanguageProvider({ children }) {
  // `chosen` is false until the user has picked a language once (first-launch gate).
  const [chosen, setChosen] = useState(() => {
    try { return !!localStorage.getItem(STORAGE_KEY); } catch (e) { return true; }
  });
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && VALID_LANGS.includes(saved)) return saved;
    } catch (e) { /* localStorage disabled */ }
    return DEFAULT_LANG;
  });

  const setLang = useCallback((newLang) => {
    if (!VALID_LANGS.includes(newLang)) return;
    setLangState(newLang);
    setChosen(true);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch (e) { /* ignore */ }
    // Update <html lang> for accessibility / SEO
    document.documentElement.lang = HTML_LANG[newLang];
  }, []);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  // Pick translatable field: t({en, zh}) -> string for current language
  // Also accepts a plain string (returns it as-is — useful for already-neutral fields)
  const t = useCallback((field) => {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && (field.en || field.zh)) {
      return pick(field, lang) || field.en || field.zh || '';
    }
    return String(field);
  }, [lang]);

  // Get a UI string by dotted key, e.g. ui('header.title')
  const ui = useCallback((key, fallback = '') => {
    const parts = key.split('.');
    let node = UI_STRINGS;
    for (const p of parts) {
      if (node && typeof node === 'object' && p in node) {
        node = node[p];
      } else {
        return fallback || key;
      }
    }
    if (node && typeof node === 'object' && (node.en || node.zh)) {
      return pick(node, lang) || node.en || node.zh || fallback;
    }
    return fallback || key;
  }, [lang]);

  // A lesson body ({en:[…], zh:[…]}) or any {en, zh} pair of arrays.
  const tl = useCallback((field) => {
    if (!field) return [];
    if (lang === 'ms' && !field.ms) return (field.en || []).map(toMs);
    return field[lang] || field.en || [];
  }, [lang]);

  // A map keyed by language: MOA_LABELS[lang], GROUP_NAMES[lang], TOX_LABEL[lang].
  const lmap = useCallback((map) => (lang === 'ms' ? msSide(map) : map[lang] || map.en), [lang]);

  // Inline pair in components: L('English', '中文').
  const L = useCallback((en, zh) => (lang === 'zh' ? zh : lang === 'ms' ? toMs(en) : en), [lang]);

  // Render DT50 chemical name (always bilingual regardless of lang)
  const bilingualName = useCallback((field) => {
    if (typeof field === 'string') return field; // already bilingual joined form
    if (field?.en && field?.zh) return `${field.en} (${field.zh})`;
    return String(field || '');
  }, []);

  const value = useMemo(() => ({ lang, setLang, t, ui, tl, lmap, L, bilingualName, chosen }), [lang, setLang, t, ui, tl, lmap, L, bilingualName, chosen]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function pick(field, lang) {
  if (lang === 'ms') return field.ms || (typeof field.en === 'string' ? toMs(field.en) : field.en);
  return field[lang];
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
