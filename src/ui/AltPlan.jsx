import React from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { href } from '../hooks/useRoute.js';

const code = (info) => (info.irac ? `IRAC ${info.irac}` : info.key.startsWith('FRAC') ? info.key : null);

/** Round-by-round alternating programme: chemical → organic → chemical → organic. */
export function AltPlan({ plan, ChemChip }) {
  const { t, ui } = useLang();
  if (!plan.length) return null;
  return (
    <div>
      <ol className="space-y-2">
        {plan.map(({ round, kind, option: o }) => {
          const org = kind === 'organic';
          return (
            <li key={o.moa} className={`rounded-xl border p-2.5 ${org ? 'bg-lime-50 border-lime-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[12px] font-extrabold ${org ? 'bg-lime-600 text-white' : 'bg-[#114b2d] text-white'}`}>
                  {ui('alt.round')} {round} · {org ? ui('alt.organic') : ui('alt.chemical')}
                </span>
              </div>
              <div className="mt-1 text-[15px] font-bold leading-tight">{t(o.moaInfo.name)}{code(o.moaInfo) && <span className="text-[#114b2d]"> · {code(o.moaInfo)}</span>}</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">{o.actives.slice(0, 3).map(c => <ChemChip key={c.id} c={c} />)}</div>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-[13px] text-slate-600 leading-snug">
        {ui('alt.why')} <a href={href('learn/alternate')} className="font-bold text-[#114b2d] underline">{ui('alt.learn')}</a>
      </p>
    </div>
  );
}
