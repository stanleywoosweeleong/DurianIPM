import React from 'react';
import { G } from './Gloss.jsx';
import { useLang } from '../i18n/useLang.jsx';
import { Badge } from './kit.jsx';
import { STAGE_TERMS } from '../core/groups.js';
import { STAGE_LABEL } from '../core/moa.js';
import { href } from '../hooks/useRoute.js';

/** "Which stage do you see most?" — eggs / young / adults / mixed, in the group's own words. */
export function StagePicker({ groupId, value, onChange }) {
  const { t, ui } = useLang();
  const terms = STAGE_TERMS[groupId];
  if (!terms) return null;
  const opts = [
    ['young', t(terms.young)],
    ['adults', t(terms.adult)],
    ['eggs', ui('stage.eggs')],
    ['mixed', ui('stage.mixed')],
  ];
  return (
    <div className="rounded-xl border-2 border-sky-200 bg-paper p-3">
      <div className="font-extrabold text-[1rem] leading-snug">{ui('stage.question')}</div>
      <a href={href('learn/lifecycle')} className="inline-flex items-center min-h-[36px] text-[0.875rem] font-bold text-sky-800 underline">{ui('stage.why')} →</a>
      <div className="grid grid-cols-2 auto-rows-fr gap-2 mt-1">
        {opts.map(([k, label]) => {
          const on = value === k;
          // "Nymphs (wingless young)" → big "Nymphs", small "wingless young" underneath.
          const m = label.match(/^(.+?)\s*[（(](.+)[）)]\s*$/);
          return (
            <button key={k} type="button" aria-pressed={on} onClick={() => onChange(on ? null : k)}
              className={`min-h-[64px] px-2 py-2 rounded-xl border flex flex-col items-center justify-center text-center leading-tight transition-colors ${on
                ? 'bg-[#114b2d] border-[#114b2d] text-white shadow-md'
                : 'bg-paper border-slate-200 text-slate-800 active:bg-slate-50'}`}>
              <span className="font-extrabold text-[1rem]">{m ? m[1] : label}</span>
              {m && <span className={`mt-0.5 text-[0.8125rem] font-semibold ${on ? 'text-emerald-100' : 'text-slate-500'}`}>{m[2]}</span>}
            </button>
          );
        })}
      </div>
      {value === 'adults' && terms.adultNote && <p className="mt-2 text-[0.875rem] text-sky-900 leading-snug font-semibold"><G>{t(terms.adultNote)}</G></p>}
    </div>
  );
}

/** "Kills: eggs · young · adults" — which life stages a class works on. */
export function KillsBadges({ stages }) {
  const { t, ui } = useLang();
  if (!stages?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[0.8125rem] font-bold text-slate-500">{ui('stage.kills')}</span>
      {['egg', 'young', 'adult'].map(s => (
        <Badge key={s} tone={stages.includes(s) ? 'blue' : 'grey'} className={stages.includes(s) ? '' : 'line-through opacity-60'}>{t(STAGE_LABEL[s])}</Badge>
      ))}
    </div>
  );
}
