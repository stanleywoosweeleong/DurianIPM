import React, { useMemo, useState } from 'react';
import { G } from '../ui/Gloss.jsx';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Section, Icon, Badge, Callout, BackBar, Bullets, Fold, openExternal } from '../ui/kit.jsx';
import { GroupArt } from '../components/Art.jsx';
import { groupById, FEEDING } from '../core/groups.js';
import { recommend } from '../core/recommend.js';
import { OrganicToggle } from '../ui/OrganicToggle.jsx';
import { CHART_FOR_GROUP, groupsForChartPest } from '../core/rotation.js';
import { RotationTable } from '../ui/RotationTable.jsx';
import { GROUP_NAMES } from '../core/moaDb.js';
import { moaKeyFromIrac } from '../core/chemDb.js';
import { examplesFor } from '../core/examples.js';
import { SPRAY_WHERE } from '../core/sprayWhere.js';
import { RELATED } from '../core/related.js';
import { BorerGrade } from '../ui/BorerGrade.jsx';
import { MrlLine } from '../ui/MrlLine.jsx';
import { coverFor } from '../core/photos.js';
import { STAGES } from '../core/stages.js';
import { href } from '../hooks/useRoute.js';
import { StagePicker, KillsBadges } from '../ui/StagePicker.jsx';

import { WikiCover } from '../components/WikiPhotoStrip.jsx';

const FIT_TONE = { best: 'green', good: 'blue', limited: 'grey' };
// How directly a reference applies: a durian study beats the same pest on another crop.
const SCOPE_TONE = { durian: 'green', other: 'amber', general: 'grey' };
const WARN_TONE = { beeBlock: 'red', beeHigh: 'amber', beeEvening: 'amber', copperFlower: 'amber', phi: 'violet', resistance: 'grey', rotate: 'red', crossRes: 'amber', noAdults: 'red', noYoung: 'red', youngBest: 'green', ovicide: 'green', pairAdult: 'amber' };
const TOX_TONE = { Ia: 'red', Ib: 'red', II: 'amber', III: 'grey', U: 'green', NL: 'grey' };

export const moaCode = (info) => (info.irac ? `IRAC ${info.irac}` : info.key.startsWith('FRAC') ? info.key : null);

export function ChemChip({ c }) {
  const { t } = useLang();
  return (
    <a href={href(`chem/${c.id}`)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-paper text-[0.875rem] font-bold active:bg-slate-100">
      {c.organic && <Icon name="leaf" className="w-4 h-4 text-lime-700" />}
      <span>{t(c.name)}</span>
      {c.bee === 'high' && <Icon name="bee" className="w-4 h-4 text-rose-600" />}
      {(c.tox === 'Ia' || c.tox === 'Ib') && <span className="text-rose-700 text-[0.75rem]">WHO {c.tox}</span>}
    </a>
  );
}

// `intro` / `onBack` / `initialPestStage` let the diagnosis show its result AS this page (no extra step).
export default function GroupPage({ id, orchard, setOrchard, intro = null, onBack, initialPestStage = null }) {
  const { t, ui, lang, lmap } = useLang();
  const g = groupById(id);
  const [pestStage, setPestStage] = useState(initialPestStage);

  const track = orchard.track === 'organic' ? 'organic' : 'all';
  const rec = useMemo(() => g && recommend(g, { stage: orchard.stage, recentMoa: orchard.recentMoa, track, pestStage }), [g, orchard.stage, orchard.recentMoa, track, pestStage]);
  if (!g) return <div><BackBar /><p>Not found.</p></div>;

  const examples = examplesFor(g.id);
  const chart = CHART_FOR_GROUP[g.id];
  // ONE "Last sprayed" choice drives the Best-fit ranking, the suggested
  // rotation and the full IRAC table. Insect/mite pests in the rotation chart
  // choose from every IRAC group used on them; other groups from their options.
  const chartGroups = chart ? [...new Set(chart.flatMap(groupsForChartPest))].sort((a, b) => {
    const A = a.startsWith('UN') ? 999 : parseInt(a, 10), B = b.startsWith('UN') ? 999 : parseInt(b, 10);
    return A - B || a.localeCompare(b);
  }) : null;
  const lastValue = chart ? (orchard.lastIrac || '') : (orchard.recentMoa[0] || '');
  const setLast = (v) => (chart
    ? setOrchard({ lastIrac: v || null, recentMoa: v ? [moaKeyFromIrac(v)] : [] })
    : setOrchard({ lastIrac: null, recentMoa: v ? [v] : [] }));

  const share = () => {
    const lines = [
      `${ui('app.title')} — ${t(g.name)}`, t(g.examples), '', t(g.why), '',
      `${ui('group.nonChem')}:`, ...g.nonChem.map(n => `• ${t(n)}`),
    ];
    if (rec.rotation.length) {
      lines.push('', `${ui('group.rotation')}:`);
      rec.rotation.forEach((o, i) => lines.push(`${i + 1}. ${t(o.moaInfo.name)}${moaCode(o.moaInfo) ? ` (${moaCode(o.moaInfo)})` : ''} — ${o.actives.slice(0, 3).map(a => t(a.name)).join(', ')}`));
    }
    lines.push('', ui('common.disclaimer'));
    const url = `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  };


  const avoidCard = rec.avoid.length > 0 && (
    <div className="mt-3 rounded-2xl bg-paper border border-rose-200 p-3">
      <div className="font-extrabold text-[1rem] text-rose-900">{ui('group.avoid')}</div>
      <div className="mt-2 space-y-2">
        {rec.avoid.map(a => (
          <div key={a.moa}>
            <div className="font-extrabold text-[0.9375rem] text-rose-900">✕ {t(a.moaInfo.name)} {moaCode(a.moaInfo) && `· ${moaCode(a.moaInfo)}`}</div>
            <div className="text-[0.9375rem] text-rose-900 leading-snug"><G>{t(a.why)}</G></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <BackBar onBack={onBack} />
      {intro}
      <WikiCover photo={coverFor(g.id)} lang={lang} className="h-48 mb-3" />
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-paper border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
          <GroupArt id={g.id} className="w-8 h-8" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold leading-tight text-slate-900">{t(g.name)}</h1>
          <p className="text-[0.875rem] text-slate-600 leading-snug line-clamp-2">{t(g.examples)}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge tone="blue">{t(FEEDING[g.feeding])}</Badge>
      </div>

      <p className="mt-3 text-[1rem] leading-relaxed text-slate-800"><G>{t(g.why)}</G></p>

      <div className="mt-3 text-[0.9375rem] leading-snug rounded-xl bg-paper border border-slate-200 px-3 py-2 divide-y divide-slate-100">
        <p className={SPRAY_WHERE[g.id] && g.chem.length > 0 ? 'pb-1.5' : ''}><b>{ui('diag.first')}:</b> <G>{t(g.nonChem[0])}</G></p>
        {SPRAY_WHERE[g.id] && g.chem.length > 0 && <p className="pt-1.5"><b>{ui('group.sprayWhere')}:</b> <G>{t(SPRAY_WHERE[g.id])}</G></p>}
      </div>
      {g.id === 'shot-hole' && <BorerGrade />}
      {RELATED[g.id] && (
        <div className="mt-2 rounded-xl bg-paper border border-amber-200 px-3 py-2">
          <div className="text-[0.875rem] font-extrabold text-amber-900">{ui('group.related')}</div>
          <div className="mt-1 space-y-1.5">
            {RELATED[g.id].map(([rid, why]) => (
              <a key={rid} href={href(`group/${rid}`)} className="flex items-start gap-2 active:opacity-70">
                <GroupArt id={rid} className="w-6 h-6 text-slate-700 shrink-0 mt-0.5" />
                <span className="min-w-0 flex-1 text-[0.875rem] leading-snug"><b className="text-[#114b2d] underline">{t(groupById(rid).name)}</b> — {t(why)}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      {g.chem.length === 0 ? (
        <Section><Callout tone="blue" icon="leaf">{ui('group.noChem')}</Callout></Section>
      ) : (
        <Section title={ui('group.chem')}>
          <p className="text-[0.8125rem] text-slate-500 mb-2 leading-snug">{ui('group.rankedNote')}</p>
          <div className="mb-3"><OrganicToggle on={track === 'organic'} onChange={v => setOrchard({ track: v ? 'organic' : 'all' })} /></div>
          <StagePicker groupId={g.id} value={pestStage} onChange={setPestStage} compact />

          {rec.options.length === 0 && track === 'organic' && <div className="mt-3"><Callout tone="lime" icon="leaf">{ui('group.organicEmpty')}</Callout></div>}

          {rec.options.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-[0.875rem]">
              <label className="block min-w-0">
                <span className="block font-bold text-slate-600 leading-tight mb-1">{ui('group.lastUsedShort')}</span>
                <select id="last-sprayed" name="last-sprayed" value={lastValue} onChange={e => setLast(e.target.value || null)}
                  className="block w-full max-w-full min-h-[44px] rounded-lg border border-slate-300 bg-paper px-2 font-bold text-[0.9375rem]">
                  <option value="">{ui('group.lastUsedNone')}</option>
                  {chartGroups
                    ? chartGroups.map(code => <option key={code} value={code}>{`IRAC ${code} · ${lmap(GROUP_NAMES)[code] || ''}`}</option>)
                    : rec.options.map(o => <option key={o.moa} value={o.moa}>{moaCode(o.moaInfo) ? `${moaCode(o.moaInfo)} · ${t(o.moaInfo.name)}` : t(o.moaInfo.name)}</option>)}
                </select>
              </label>
              <label className="block min-w-0">
                <span className="block font-bold text-slate-600 leading-tight mb-1">{ui('group.treeStage')}</span>
                <select id="tree-stage" name="tree-stage" value={orchard.stage || ''} onChange={e => setOrchard({ stage: e.target.value || null })}
                  className="block w-full max-w-full min-h-[44px] rounded-lg border border-slate-300 bg-paper px-2 font-bold text-[0.9375rem]">
                  <option value="">—</option>
                  {STAGES.map(st => <option key={st.id} value={st.id}>{t(st.name)}</option>)}
                </select>
              </label>
            </div>
          )}

          {orchard.stage === 'flowering' && rec.options.length > 0 && (
            <a href={href('learn/pollinators')} className="mt-3 flex items-start gap-2 rounded-xl bg-paper border border-amber-300 p-3 active:bg-amber-50">
              <Icon name="bee" className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <span className="flex-1 text-[0.875rem] leading-snug"><b>{ui('home.flowerWarn')}</b> <span className="text-[#114b2d] underline font-bold">{ui('group.whyFlowering')}</span></span>
            </a>
          )}
          <div className="space-y-2 mt-3">
            {rec.options.map((o, i) => <OptionCard key={o.moa} o={o} rank={i + 1} />)}
          </div>
          {rec.rotationWithheld && <div className="mt-4"><Callout tone="blue" icon="leaf">{ui('group.rotationSite')}</Callout></div>}
          {rec.rotation.length > 1 && (
            <div className="mt-4 rounded-2xl bg-paper border border-emerald-200 p-3">
              <div className="font-extrabold text-[1rem]">{ui('group.rotation')}</div>
              <ol className="mt-2 space-y-1.5">
                {rec.rotation.map((o, i) => (
                  <li key={o.moa} className="flex gap-2 items-start">
                    <span className="w-6 h-6 rounded-full bg-[#114b2d] text-white font-extrabold text-[0.8125rem] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-[0.9375rem] leading-snug"><b>{moaCode(o.moaInfo) || t(o.moaInfo.name)}</b> — {o.actives.slice(0, 2).map(a => t(a.name)).join(', ')}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-[0.8125rem] text-slate-600 leading-snug">🌿 {ui('alt.tip')} <a href={href('learn/alternate')} className="font-bold text-[#114b2d] underline">{ui('alt.learn')}</a></p>
            </div>
          )}
          {avoidCard}
          {chart && (
            <Fold key={lastValue || 'none'} open={!!lastValue} title={ui('rot.tableTitle')}
              hint={lastValue ? `${ui('group.lastUsedShort')}: IRAC ${lastValue}` : ui('rot.pickLast')}>
              <RotationTable pests={chart} last={lastValue} />
            </Fold>
          )}
        </Section>
      )}

      <Fold title={ui('group.nonChem')} hint={t(g.nonChem[0])}>
        <Bullets items={g.nonChem} t={t} />
      </Fold>
      <Fold title={ui('group.scout')} hint={t(g.threshold)}>
        <p className="text-[1rem] leading-snug"><G>{t(g.scout)}</G></p>
        <div className="mt-3 text-[0.875rem] font-bold text-slate-500">{ui('group.threshold')}</div>
        <p className="text-[1rem] leading-snug font-semibold"><G>{t(g.threshold)}</G></p>
        <p className="mt-2 text-[0.8125rem] text-slate-500 leading-snug">{ui('group.thresholdBasis')}</p>
      </Fold>
      <Fold title={ui('group.about')} hint={t(g.hides)}>
        <div className="grid grid-cols-1 gap-3">
          <Fact label={ui('group.hides')} value={t(g.hides)} />
          <Fact label={ui('group.stage')} value={t(g.damagingStage)} />
          <Fact label={ui('group.taxon')} value={t(g.taxon)} />
        </div>
      </Fold>

      {g.chem.length === 0 && avoidCard}

      {examples.length > 0 && (
        <Fold title={`${ui('group.examples')} (${examples.length})`} hint={examples.slice(0, 3).map(p => t(p.common)).join(', ')}>
          <div className="space-y-3">
            {examples.map(p => (
              <div key={p.id} className="border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                <div className="font-extrabold text-[1rem]">{t(p.common)}</div>
                <div className="text-[0.8125rem] italic text-slate-500">{p.scientific}</div>
                <p className="text-[0.9375rem] mt-1 leading-snug"><G>{t(p.symptoms)}</G></p>
              </div>
            ))}
          </div>
        </Fold>
      )}

      <Fold title={ui('group.sources')} hint={g.refs?.length ? `${g.refs.length} ${ui('group.refsCount')}` : ui('group.refsBasis')}>
        {g.refs?.length ? (
          <ol className="space-y-2 list-decimal pl-5">
            {g.refs.map(r => (
              <li key={r.url} className="text-[0.875rem] leading-snug">
                <a href={r.url} onClick={e => openExternal(e, r.url)} className="text-[#114b2d] underline">{r.t}</a>
                {(r.scope || r.supports) && (
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    {r.scope && <Badge tone={SCOPE_TONE[r.scope] || 'grey'}>{ui(`group.scope.${r.scope}`)}</Badge>}
                    {r.supports && <span className="text-[0.8125rem] text-slate-500">{ui('group.supports')}: {r.supports}</span>}
                  </div>
                )}
              </li>
            ))}
          </ol>
        ) : null}
        <p className={`text-[0.8125rem] text-slate-500 leading-snug ${g.refs?.length ? 'mt-3' : ''}`}>{ui('group.refsBasis')}</p>
      </Fold>

      <button onClick={share} className="mt-5 w-full min-h-[52px] rounded-xl bg-[#25D366] text-white font-extrabold flex items-center justify-center gap-2">
        <Icon name="share" /> {ui('group.share')}
      </button>
      <p className="mt-3 text-[0.8125rem] text-slate-500 leading-snug">{ui('common.disclaimer')}</p>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <div className="text-[0.8125rem] font-bold text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="text-[1rem] font-semibold leading-snug">{value}</div>
    </div>
  );
}

// Warnings that matter most first; at most two are shown on the card face.
const WARN_PRIORITY = ['beeBlock', 'rotate', 'noAdults', 'noYoung', 'crossRes', 'youngBest', 'ovicide', 'pairAdult', 'copperFlower', 'beeHigh', 'beeEvening', 'phi', 'resistance'];

function OptionCard({ o, rank }) {
  const { t, ui } = useLang();
  const info = o.moaInfo;
  const blocked = o.warnings.includes('beeBlock');
  const warns = WARN_PRIORITY.filter(w => o.warnings.includes(w)).slice(0, 2);
  return (
    <Card className={`p-3 ${blocked ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-2">
        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[0.875rem] flex items-center justify-center shrink-0">{rank}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 font-extrabold text-[1rem] leading-tight">{t(info.name)}{moaCode(info) && <span className="text-[#114b2d]"> · {moaCode(info)}</span>}</div>
            <Badge tone={FIT_TONE[o.fit]} className="shrink-0 whitespace-nowrap">{ui(`fit.${o.fit}`)}</Badge>
          </div>
          <p className="text-[0.9375rem] leading-snug mt-1 text-slate-800"><G>{t(o.why)}</G></p>
          <div className="mt-1.5"><KillsBadges stages={info.stages} /></div>
          {warns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {warns.map(w => <Badge key={w} tone={WARN_TONE[w]}>{ui(`warn.${w}`)}</Badge>)}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {o.actives.map(c => <ChemChip key={c.id} c={c} />)}
          </div>
          {o.actives.length > 0 && <MrlLine actives={o.actives} />}
        </div>
      </div>
    </Card>
  );
}

export { TOX_TONE };
