import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { glossSplit, glossById, GLOSSARY } from '../core/glossary.js';
import { href } from '../hooks/useRoute.js';

const Ctx = createContext(() => {});

/** Holds the one open explanation card for the whole app. */
export function GlossProvider({ children }) {
  const [open, setOpen] = useState(null);
  return (
    <Ctx.Provider value={setOpen}>
      {children}
      {open && <TermCard id={open} onClose={() => setOpen(null)} />}
    </Ctx.Provider>
  );
}

/**
 * Text with its technical terms explained: the first use of each term is
 * underlined (dotted) and a tap opens what it means. Pass a plain string.
 */
export function G({ children }) {
  const { lang } = useLang();
  const show = useContext(Ctx);
  const parts = useMemo(() => glossSplit(children, lang), [children, lang]);
  if (parts.length === 1 && typeof parts[0] === 'string') return children;
  return parts.map((p, i) => typeof p === 'string' ? <React.Fragment key={i}>{p}</React.Fragment> : (
    <button key={i} type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); show(p.id); }}
      className="inline p-0 m-0 bg-transparent border-0 font-[inherit] text-[length:inherit] leading-[inherit] text-inherit text-left underline decoration-dotted decoration-[#114b2d]/60 underline-offset-[3px] decoration-2 cursor-help">
      {p.text}
    </button>
  ));
}

/** Term in the farmer's language, with the English technical term beside it. */
function termTitle(e, lang, t) {
  const w = t(e.word);
  return lang === 'en' || w.includes(e.word.en) ? w : `${w} · ${e.word.en}`;
}

function TermCard({ id, onClose }) {
  const { t, ui, lang } = useLang();
  const e = glossById(id);
  if (!e) return null;
  return (
    <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center bg-black/30" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={t(e.word)} onClick={ev => ev.stopPropagation()}
        className="w-full max-w-md bg-paper rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
        <div className="text-[0.8125rem] font-bold uppercase tracking-wide text-slate-500">{ui('words.term')}</div>
        <h2 className="mt-0.5 text-[1.25rem] font-extrabold text-slate-900 leading-tight">{termTitle(e, lang, t)}</h2>
        <p className="mt-2 text-[1rem] leading-relaxed text-slate-800">{t(e.means)}</p>
        <div className="mt-4 flex items-center gap-2">
          <a href={href('learn/words')} onClick={onClose} className="flex-1 min-h-[44px] rounded-xl border border-slate-300 bg-paper flex items-center justify-center text-[0.9375rem] font-bold text-[#114b2d]">{ui('words.all')}</a>
          <button onClick={onClose} className="flex-1 min-h-[44px] rounded-xl bg-[#114b2d] text-white text-[0.9375rem] font-extrabold">{ui('words.gotIt')}</button>
        </div>
      </div>
    </div>
  );
}

/** The "Words to know" page: every term, A–Z in the current language. */
export function WordsToKnow({ BackBar }) {
  const { t, ui, lang } = useLang();
  const list = useMemo(() => [...GLOSSARY].sort((a, b) => t(a.word).localeCompare(t(b.word), lang === 'zh' ? 'zh-CN' : lang)), [lang, t]);
  return (
    <div>
      {BackBar && <BackBar />}
      <h1 className="text-xl font-extrabold leading-tight text-slate-900">{ui('words.title')}</h1>
      <p className="text-[0.9375rem] text-slate-500 mt-1 leading-snug">{ui('words.intro')}</p>
      <dl className="mt-4 space-y-2.5">
        {list.map(e => (
          <div key={e.id} id={`w-${e.id}`} className="rounded-xl border border-slate-200 bg-paper p-3.5">
            <dt className="font-extrabold text-[1rem] text-[#114b2d] leading-tight">{termTitle(e, lang, t)}</dt>
            <dd className="mt-1 text-[0.9375rem] leading-snug text-slate-800">{t(e.means)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
