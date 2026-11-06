import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Badge, Icon, Fold } from './kit.jsx';
import { KillsBadges } from './StagePicker.jsx';
import { MOA_LABELS, GROUP_NAMES, CHART_PESTS } from '../core/moaDb.js';
import { rotationFor, groupsForChartPest } from '../core/rotation.js';
import { moaInfo, moaKeyFromIrac } from '../core/chemDb.js';
import { href } from '../hooks/useRoute.js';

// Target-site colours — one set for the IRAC labels, the legend and the cards.
export const SITE_CARD = {
  neural: 'border-l-sky-500 bg-sky-50', respiratory: 'border-l-orange-500 bg-orange-50',
  growth: 'border-l-violet-500 bg-violet-50', midgut: 'border-l-amber-500 bg-amber-50', unknown: 'border-l-slate-400 bg-slate-50',
};
const RISK_TONE = { low: 'green', mid: 'amber', high: 'red' };

/**
 * Full IRAC rotation table for the pest page — what was the separate Rotate tab.
 * Driven by the page's single "Last sprayed" choice; no pest picker of its own
 * (the page IS the pest). `pests` = rotation-chart pests for this group.
 */
export function RotationTable({ pests, last }) {
  const { t, lang, ui, lmap } = useLang();
  const L = lmap(MOA_LABELS);
  const [pest, setPest] = useState(pests[0]);
  const usable = useMemo(() => groupsForChartPest(pest), [pest]);
  const rot = useMemo(() => (last && usable.includes(last) ? rotationFor(pest, last) : null), [pest, last, usable]);
  const gName = (g) => `${g} · ${lmap(GROUP_NAMES)[g] || ''}`;
  const pestName = (id) => { const p = CHART_PESTS.find(x => x.id === id); return t(p); };

  return (
    <div>
      {pests.length > 1 && (
        <div className="grid gap-1 p-1 rounded-xl bg-slate-200 mb-3" style={{ gridTemplateColumns: `repeat(${pests.length}, 1fr)` }} role="tablist">
          {pests.map(p => (
            <button key={p} role="tab" aria-selected={pest === p} onClick={() => setPest(p)}
              className={`min-h-[40px] rounded-lg font-bold text-[0.875rem] ${pest === p ? 'bg-white shadow' : 'text-slate-600'}`}>{pestName(p)}</button>
          ))}
        </div>
      )}

      {!last && <p className="text-[0.9375rem] text-slate-600 leading-snug">{ui('rot.pickLast')}</p>}
      {last && !usable.includes(last) && <p className="text-[0.9375rem] text-slate-600 leading-snug">{ui('rot.notForPest')}</p>}

      {rot && (
        <div className="space-y-4">
          <div>
            <div className="text-[0.8125rem] font-extrabold text-rose-800 uppercase tracking-wider mb-1.5">✕ {L.rotateAvoid}</div>
            <div className="flex flex-wrap gap-1.5">{rot.avoid.map(a => <ActiveLink key={a.n} a={a} tone="red" />)}</div>
          </div>
          {rot.caution.length > 0 && (
            <div>
              <div className="text-[0.8125rem] font-extrabold text-amber-800 uppercase tracking-wider mb-1.5">⚠ {L.rotateCaution} — {rot.caution.map(c => c.g).join(' / ')}</div>
              <p className="text-[0.875rem] text-amber-900 bg-amber-50 border border-amber-300 rounded-xl p-2.5 leading-snug">
                {rot.crossKind === 'partial' ? L.cautionNote_partial : L.cautionNote_shared}
              </p>
              <div className="space-y-2 mt-2">{rot.caution.map(grp => <GroupBlock key={grp.g} grp={grp} gName={gName} L={L} />)}</div>
            </div>
          )}
          <div>
            <div className="text-[0.8125rem] font-extrabold text-[#114b2d] uppercase tracking-wider">✓ {L.rotateTo}</div>
            <p className="text-[0.8125rem] text-slate-500 mb-1.5">{ui('rot.order')}</p>
            <div className="space-y-2">{rot.suggested.map(grp => <GroupBlock key={grp.g} grp={grp} gName={gName} L={L} />)}</div>
          </div>
        </div>
      )}

      <Fold title={ui('rot.colourTitle')}>
        <p className="text-[0.875rem] leading-snug">{ui('rot.colourText')}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {['neural', 'respiratory', 'growth', 'midgut', 'unknown'].map(s => (
            <span key={s} className={`px-2 py-1 rounded-md border border-slate-200 border-l-4 text-[0.8125rem] font-bold ${SITE_CARD[s]}`}>{L[`site_${s}`]}</span>
          ))}
        </div>
      </Fold>
    </div>
  );
}

function GroupBlock({ grp, gName, L }) {
  return (
    <div className={`rounded-xl border border-slate-200 border-l-4 p-2.5 ${SITE_CARD[grp.site] || SITE_CARD.unknown}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="font-extrabold text-[0.9375rem]">{gName(grp.g)}</div>
        {grp.differentSite === 1 && <Badge tone="green">{L.siteChanger}</Badge>}
      </div>
      <div className="mt-1"><KillsBadges stages={moaInfo(moaKeyFromIrac(grp.g)).stages} /></div>
      <div className="flex flex-wrap gap-1.5 mt-1.5">{grp.items.map(a => <ActiveLink key={a.n} a={a} />)}</div>
    </div>
  );
}

function ActiveLink({ a, tone }) {
  const { lang, lmap } = useLang();
  const L = lmap(MOA_LABELS);
  const label = a.chem ? (lang === 'zh' && a.chem.name.zh !== a.n ? a.chem.name.zh : a.n) : a.n;
  return (
    <a href={a.chem ? href(`chem/${a.chem.id}`) : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-white text-[0.875rem] font-bold ${tone === 'red' ? 'border-rose-300 text-rose-900' : 'border-slate-300'}`}>
      {a.chem?.organic && <Icon name="leaf" className="w-4 h-4 text-lime-700" />}
      {label}
      <Badge tone={RISK_TONE[a.r]} className="text-[0.6875rem]">{L[`risk_${a.r}`]}</Badge>
      {a.chem?.bee === 'high' && <Icon name="bee" className="w-4 h-4 text-rose-600" />}
    </a>
  );
}
