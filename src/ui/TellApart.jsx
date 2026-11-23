import React from 'react';
import { G } from './Gloss.jsx';
import { useLang } from '../i18n/useLang.jsx';
import { Fold, openExternal } from './kit.jsx';
import { TELL_APART as C } from '../core/tellApart.js';

// "Dieback or Fusarium?" — six checks side by side, each with its basis,
// then a bag test, the same first steps, and the sources (durian papers first).
export function TellApart() {
  const { t } = useLang();
  return (
    <Fold title={t(C.title)} hint={t(C.hint)}>
      <div>
        <p className="text-[0.9375rem] leading-snug text-slate-800"><G>{t(C.intro)}</G></p>
        <div className="mt-2 rounded-xl border border-rose-200 bg-paper px-3 py-2 text-[0.875rem] leading-snug text-rose-900"><G>{t(C.phyto)}</G></div>

        <div className="mt-3 space-y-2">
          {C.rows.map((r, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-paper p-2.5">
              <div className="font-extrabold text-[0.9375rem] text-slate-900">{t(r.check)}</div>
              <div className="mt-1.5 grid grid-cols-2 gap-2 text-[0.875rem] leading-snug">
                <div className="border-l-4 border-violet-300 pl-2">
                  <div className="text-[0.75rem] font-bold text-violet-800">{t(C.head.dieback)}</div>
                  <div><G>{t(r.dieback)}</G></div>
                </div>
                <div className="border-l-4 border-teal-400 pl-2">
                  <div className="text-[0.75rem] font-bold text-teal-800">{t(C.head.fusarium)}</div>
                  <div><G>{t(r.fusarium)}</G></div>
                </div>
              </div>
              <div className="mt-1.5 text-[0.8125rem] text-slate-500 leading-snug">{t(r.basis)}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-amber-200 bg-paper p-2.5">
          <div className="font-extrabold text-[0.9375rem] text-amber-900">{t(C.bagTitle)}</div>
          <p className="mt-1 text-[0.875rem] leading-snug"><G>{t(C.bag)}</G></p>
          <p className="mt-1.5 text-[0.875rem] leading-snug text-slate-700">{t(C.lab)}</p>
        </div>

        <div className="mt-3 rounded-xl border border-emerald-200 bg-paper p-2.5">
          <div className="font-extrabold text-[0.9375rem] text-[#114b2d]">{t(C.sameTitle)}</div>
          <ul className="mt-1 list-disc pl-5 space-y-1 text-[0.875rem] leading-snug">
            {C.same.map((x, i) => <li key={i}><G>{t(x)}</G></li>)}
          </ul>
        </div>

        <div className="mt-3">
          <div className="font-extrabold text-[0.875rem] text-slate-700">{t(C.srcTitle)}</div>
          <ol className="mt-1 space-y-2 text-[0.8125rem] leading-snug">
            {C.sources.map(s => (
              <li key={s.n} className="flex gap-1.5">
                <span className="font-bold text-slate-600">[{s.n}]</span>
                <span className="min-w-0">
                  <a href={s.url} onClick={e => openExternal(e, s.url)} className="text-[#114b2d] underline break-words">{s.t}</a>
                  {' '}<span className="inline-block rounded bg-emerald-50 border border-emerald-200 px-1 text-[0.75rem] font-bold text-emerald-800">{t(C.durian)}</span>
                  {' '}<a href={s.pdf} onClick={e => openExternal(e, s.pdf)} className="text-[#114b2d] underline font-bold">{t(C.pdf)}</a>
                  <span className="block text-slate-500">{t(s.note)}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[0.8125rem] text-slate-500 leading-snug">{t(C.general)}</p>
        </div>
      </div>
    </Fold>
  );
}
