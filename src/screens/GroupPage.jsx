import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Section, Icon, Badge, Callout, BackBar, Bullets, Fold } from '../ui/kit.jsx';
import { GroupArt } from '../components/Art.jsx';
import { groupById, FEEDING } from '../core/groups.js';
import { recommend } from '../core/recommend.js';
import { OrganicToggle } from '../ui/OrganicToggle.jsx';
import { CHART_FOR_GROUP, groupsForChartPest } from '../core/rotation.js';
import { RotationTable } from '../ui/RotationTable.jsx';
import { GROUP_NAMES } from '../core/moaDb.js';
import { moaKeyFromIrac } from '../core/chemDb.js';
import { examplesFor } from '../core/examples.js';
import { coverFor } from '../core/photos.js';
import { STAGES } from '../core/stages.js';
import { href } from '../hooks/useRoute.js';
import { StagePicker, KillsBadges } from '../ui/StagePicker.jsx';

import { WikiPhotoStrip, WikiCover } from '../components/WikiPhotoStrip.jsx';

const FIT_TONE = { best: 'green', good: 'blue', limited: 'grey' };
const WARN_TONE = { beeBlock: 'red', beeHigh: 'amber', beeEvening: 'amber', phi: 'violet', resistance: 'grey', rotate: 'red', crossRes: 'amber', noAdults: 'red', noYoung: 'red', youngBest: 'green', ovicide: 'green', pairAdult: 'amber' };
const TOX_TONE = { Ia: 'red', Ib: 'red', II: 'amber', III: 'grey', U: 'green', NL: 'grey' };

export const moaCode = (info) => (info.irac ? `IRAC ${info.irac}` : info.key.startsWith('FRAC') ? info.key : null);

export function ChemChip({ c }) {
  const { t } = useLang();
  return (
    <a href={href(`chem/${c.id}`)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[14px] font-bold active:bg-slate-100">
      {c.organic && <Icon name="leaf" className="w-4 h-4 text-lime-700" />}
      <span>{t(c.name)}</span>
      {c.bee === 'high' && <Icon name="bee" className="w-4 h-4 text-rose-600" />}
      {(c.tox === 'Ia' || c.tox === 'Ib') && <span className="text-rose-700 text-[12px]">WHO {c.tox}</span>}
    </a>
  );
}

export default function GroupPage({ id, orchard, setOrchard }) {
  const { t, ui, lang } = useLang();
  const g = groupById(id);
  const [showAll, setShowAll] = useState(false);
  const [pestStage, setPestStage] = useState(null);

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

  const TOP = 3;
  const shown = showAll ? rec.options : rec.options.slice(0, TOP);
  const hidden = rec.options.length - shown.length;

  return (
    <div>
      <BackBar />
      <WikiCover photo={coverFor(g.id)} lang={lang} className="h-48 mb-3" />
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
          <GroupArt id={g.id} className="w-8 h-8" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold leading-tight text-slate-900">{t(g.name)}</h1>
          <p className="text-[14px] text-slate-600 leading-snug line-clamp-2">{t(g.examples)}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge tone="blue">{t(FEEDING[g.feeding])}</Badge>
      </div>

      <p className="mt-3 text-[16px] leading-relaxed text-slate-800">{t(g.why)}</p>

      <p className="mt-3 text-[15px] leading-snug rounded-xl bg-white border border-slate-200 px-3 py-2"><b>{ui('diag.first')}:</b> {t(g.nonChem[0])}</p>
      {g.chem.length === 0 ? (
        <Section><Callout tone="blue" icon="leaf">{ui('group.noChem')}</Callout></Section>
      ) : (
        <Section title={ui('group.chem')}>
          <p className="text-[13px] text-slate-500 mb-2 leading-snug">{ui('group.rankedNote')}</p>
          <div className="mb-3"><OrganicToggle on={track === 'organic'} onChange={v => { setOrchard({ track: v ? 'organic' : 'all' }); setShowAll(false); }} /></div>
          <StagePicker groupId={g.id} value={pestStage} onChange={setPestStage} compact />

          {rec.options.length === 0 && track === 'organic' && <div className="mt-3"><Callout tone="lime" icon="leaf">{ui('group.organicEmpty')}</Callout></div>}

          {rec.options.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-[14px]">
              <label className="block min-w-0">
                <span className="block font-bold text-slate-600 leading-tight mb-1">{ui('group.lastUsedShort')}</span>
                <select value={lastValue} onChange={e => setLast(e.target.value || null)}
                  className="block w-full max-w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-2 font-bold text-[15px]">
                  <option value="">{ui('group.lastUsedNone')}</option>
                  {chartGroups
                    ? chartGroups.map(code => <option key={code} value={code}>{`IRAC ${code} · ${GROUP_NAMES[lang][code] || ''}`}</option>)
                    : rec.options.map(o => <option key={o.moa} value={o.moa}>{moaCode(o.moaInfo) ? `${moaCode(o.moaInfo)} · ${t(o.moaInfo.name)}` : t(o.moaInfo.name)}</option>)}
                </select>
              </label>
              <label className="block min-w-0">
                <span className="block font-bold text-slate-600 leading-tight mb-1">{ui('group.treeStage')}</span>
                <select value={orchard.stage || ''} onChange={e => setOrchard({ stage: e.target.value || null })}
                  className="block w-full max-w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-2 font-bold text-[15px]">
                  <option value="">—</option>
                  {STAGES.map(st => <option key={st.id} value={st.id}>{t(st.name)}</option>)}
                </select>
              </label>
            </div>
          )}

          <div className="space-y-2 mt-3">
            {shown.map((o, i) => <OptionCard key={o.moa} o={o} rank={i + 1} />)}
          </div>
          {hidden > 0 && (
            <button onClick={() => setShowAll(true)} className="mt-2 w-full min-h-[48px] rounded-xl border-2 border-dashed border-slate-300 font-bold text-slate-700">
              + {hidden} {ui('group.moreOptions')}
            </button>
          )}
          {rec.rotation.length > 1 && (
            <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
              <div className="font-extrabold text-[16px]">{ui('group.rotation')}</div>
              <ol className="mt-2 space-y-1.5">
                {rec.rotation.map((o, i) => (
                  <li key={o.moa} className="flex gap-2 items-start">
                    <span className="w-6 h-6 rounded-full bg-[#114b2d] text-white font-extrabold text-[13px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-[15px] leading-snug"><b>{moaCode(o.moaInfo) || t(o.moaInfo.name)}</b> — {o.actives.slice(0, 2).map(a => t(a.name)).join(', ')}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-[13px] text-slate-600 leading-snug">🌿 {ui('alt.tip')} <a href={href('learn/alternate')} className="font-bold text-[#114b2d] underline">{ui('alt.learn')}</a></p>
            </div>
          )}
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
        <p className="text-[16px] leading-snug">{t(g.scout)}</p>
        <div className="mt-3 text-[14px] font-bold text-slate-500">{ui('group.threshold')}</div>
        <p className="text-[16px] leading-snug font-semibold">{t(g.threshold)}</p>
      </Fold>
      <Fold title={ui('group.about')} hint={t(g.hides)}>
        <div className="grid grid-cols-1 gap-3">
          <Fact label={ui('group.hides')} value={t(g.hides)} />
          <Fact label={ui('group.stage')} value={t(g.damagingStage)} />
          <Fact label={ui('group.taxon')} value={t(g.taxon)} />
        </div>
      </Fold>

      {rec.avoid.length > 0 && (
        <Fold title={ui('group.avoid')} hint={rec.avoid.map(a => moaCode(a.moaInfo) || t(a.moaInfo.name)).join(' · ')} tone="rose">
          <div className="space-y-2">
            {rec.avoid.map(a => (
              <div key={a.moa}>
                <div className="font-extrabold text-[15px] text-rose-900">✕ {t(a.moaInfo.name)} {moaCode(a.moaInfo) && `· ${moaCode(a.moaInfo)}`}</div>
                <div className="text-[15px] text-rose-900 leading-snug">{t(a.why)}</div>
              </div>
            ))}
          </div>
        </Fold>
      )}

      {examples.length > 0 && (
        <Fold title={`${ui('group.examples')} (${examples.length})`} hint={examples.slice(0, 3).map(p => t(p.common)).join(', ')}>
          <div className="space-y-3">
            {examples.map(p => (
              <div key={p.id} className="border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                <div className="font-extrabold text-[16px]">{t(p.common)}</div>
                <div className="text-[13px] italic text-slate-500">{p.scientific}</div>
                <p className="text-[15px] mt-1 leading-snug">{t(p.symptoms)}</p>
                <div className="mt-2"><WikiPhotoStrip scientificName={p.scientific} lang={lang} /></div>
              </div>
            ))}
          </div>
        </Fold>
      )}

      <button onClick={share} className="mt-5 w-full min-h-[52px] rounded-xl bg-[#25D366] text-white font-extrabold flex items-center justify-center gap-2">
        <Icon name="share" /> {ui('group.share')}
      </button>
      <p className="mt-3 text-[13px] text-slate-500 leading-snug">{ui('common.disclaimer')}</p>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <div className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="text-[16px] font-semibold leading-snug">{value}</div>
    </div>
  );
}

// Warnings that matter most first; at most two are shown on the card face.
const WARN_PRIORITY = ['beeBlock', 'rotate', 'noAdults', 'noYoung', 'crossRes', 'youngBest', 'ovicide', 'pairAdult', 'beeHigh', 'beeEvening', 'phi', 'resistance'];

function OptionCard({ o, rank }) {
  const { t, ui } = useLang();
  const info = o.moaInfo;
  const blocked = o.warnings.includes('beeBlock');
  const warns = WARN_PRIORITY.filter(w => o.warnings.includes(w)).slice(0, 2);
  return (
    <Card className={`p-3 ${blocked ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-2">
        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[14px] flex items-center justify-center shrink-0">{rank}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="font-extrabold text-[16px] leading-tight">{t(info.name)}{moaCode(info) && <span className="text-[#114b2d]"> · {moaCode(info)}</span>}</div>
            <Badge tone={FIT_TONE[o.fit]}>{ui(`fit.${o.fit}`)}</Badge>
          </div>
          <p className="text-[15px] leading-snug mt-1 text-slate-800">{t(o.why)}</p>
          <div className="mt-1.5"><KillsBadges stages={info.stages} /></div>
          {warns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {warns.map(w => <Badge key={w} tone={WARN_TONE[w]}>{ui(`warn.${w}`)}</Badge>)}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {o.actives.slice(0, 4).map(c => <ChemChip key={c.id} c={c} />)}
            {o.actives.length > 4 && <span className="text-[13px] font-bold text-slate-500 self-center">+{o.actives.length - 4}</span>}
          </div>
        </div>
      </div>
    </Card>
  );
}

export { TOX_TONE };
