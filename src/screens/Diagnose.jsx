import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Chip, Icon, Badge, Callout } from '../ui/kit.jsx';
import { GroupArt } from '../components/Art.jsx';
import { PARTS, CULPRITS, signsForPart, diagnose } from '../core/diagnosis.js';
import { recommend } from '../core/recommend.js';
import { ChemChip, moaCode } from './GroupPage.jsx';
import { StagePicker } from '../ui/StagePicker.jsx';
import { href } from '../hooks/useRoute.js';

const toggle = (arr, v) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

export default function Diagnose({ orchard }) {
  const { t, ui } = useLang();
  const [step, setStep] = useState(0);
  const [parts, setParts] = useState([]);
  const [signs, setSigns] = useState([]);
  const [culprits, setCulprits] = useState([]);

  const signOptions = useMemo(() => signsForPart(parts), [parts]);
  const results = useMemo(
    () => (step === 3 ? diagnose({ signs, culprits, weather: orchard.weather }) : []),
    [step, signs, culprits, orchard.weather]
  );

  const restart = () => { setStep(0); setParts([]); setSigns([]); setCulprits([]); };
  const canNext = [parts.length > 0, signs.length > 0, culprits.length > 0][step];

  const Progress = () => (
    <div className="flex gap-1.5 mb-4" aria-hidden="true">
      {[0, 1, 2].map(i => <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-emerald-600' : 'bg-stone-200'}`} />)}
    </div>
  );

  const Nav = () => (
    <div className="sticky bottom-[76px] mt-5 flex gap-2 bg-stone-50/95 py-2">
      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="min-h-[52px] px-5 rounded-xl border-2 border-stone-300 bg-white font-bold">{ui('diag.back')}</button>
      )}
      <button disabled={!canNext} onClick={() => setStep(step + 1)}
        className="flex-1 min-h-[52px] rounded-xl bg-emerald-700 text-white font-extrabold text-[17px] disabled:bg-stone-300 disabled:text-stone-500">
        {step === 2 ? ui('diag.results') : ui('diag.next')}
      </button>
    </div>
  );

  if (step === 3) {
    const [top, ...rest] = results;
    return (
      <div>
        <h1 className="text-2xl font-extrabold">{ui('diag.resultTitle')}</h1>
        {!top && <p className="mt-3 text-[16px]">{ui('diag.none')}</p>}
        {top && (
          <>
            {top.confidence === 'low' && <div className="mt-3"><Callout>{ui('diag.lowConf')}</Callout></div>}
            <ResultCard r={top} big orchard={orchard} culprits={culprits} />
            {rest.length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-extrabold">{ui('diag.others')}</h2>
                <div className="space-y-2 mt-2">{rest.slice(0, 3).map(r => <ResultCard key={r.group.id} r={r} />)}</div>
              </>
            )}
          </>
        )}
        <button onClick={restart} className="mt-6 w-full min-h-[52px] rounded-xl border-2 border-stone-300 bg-white font-bold">{ui('diag.restart')}</button>
      </div>
    );
  }

  return (
    <div>
      <Progress />
      {step === 0 && (
        <>
          <h1 className="text-2xl font-extrabold">{ui('diag.q1')}</h1>
          <p className="text-[15px] text-stone-600">{ui('diag.q1Sub')}</p>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {PARTS.map(p => (
              <Chip key={p.id} on={parts.includes(p.id)} onClick={() => { setParts(toggle(parts, p.id)); setSigns([]); }} className="text-[17px] py-3">
                {t(p.name)}
              </Chip>
            ))}
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <h1 className="text-2xl font-extrabold">{ui('diag.q2')}</h1>
          <p className="text-[15px] text-stone-600">{ui('diag.q2Sub')}</p>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {signOptions.map(s => (
              <Chip key={s.id} on={signs.includes(s.id)} onClick={() => setSigns(toggle(signs, s.id))}>
                <span className="inline-flex gap-2 items-start">
                  <span className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${signs.includes(s.id) ? 'border-white' : 'border-stone-400'}`}>
                    {signs.includes(s.id) && <Icon name="check" className="w-4 h-4" strokeWidth={3} />}
                  </span>
                  {t(s.label)}
                </span>
              </Chip>
            ))}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="text-2xl font-extrabold">{ui('diag.q3')}</h1>
          <p className="text-[15px] text-stone-600">{ui('diag.q3Sub')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {CULPRITS.map(c => (
              <Chip key={c.id} on={culprits.includes(c.id)}
                onClick={() => setCulprits(c.id === 'nothing' || c.id === 'unsure' ? [c.id] : toggle(culprits.filter(x => x !== 'nothing' && x !== 'unsure'), c.id))}>
                {t(c.label)}
              </Chip>
            ))}
          </div>
        </>
      )}
      <Nav />
    </div>
  );
}

function ResultCard({ r, big, orchard, culprits = [] }) {
  const { t, ui } = useLang();
  const g = r.group;
  const tone = r.confidence === 'high' ? 'green' : r.confidence === 'medium' ? 'amber' : 'grey';
  const uniq = [...new Map(r.evidence.map(e => [e.id, e])).values()];
  if (!big) {
    // "Also possible" — one compact row each.
    return (
      <a href={href(`group/${g.id}`)} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200 active:bg-stone-50">
        <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0"><GroupArt id={g.id} className="w-8 h-8" /></div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-[16px] leading-tight">{t(g.name)}</div>
          <div className="text-[13px] text-stone-500 truncate">{t(g.examples)}</div>
        </div>
        <Badge tone={tone}>{ui(`diag.conf.${r.confidence}`)}</Badge>
        <Icon name="chevron" className="w-5 h-5 text-stone-400 shrink-0" />
      </a>
    );
  }
  return (
    <Card className="mt-3 p-4 border-2 border-emerald-600">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
          <GroupArt id={g.id} className="w-10 h-10" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xl font-extrabold leading-tight">{t(g.name)}</div>
          <div className="mt-1"><Badge tone={tone}>{ui(`diag.conf.${r.confidence}`)}</Badge></div>
        </div>
      </div>
      <p className="mt-2 text-[13px] text-stone-500 leading-snug">{ui('diag.because')}: {uniq.map(e => t(e.label)).join(' · ')}</p>
      <p className="mt-2 text-[16px] leading-snug text-stone-800 line-clamp-3">{t(g.why)}</p>
      <WhatWorks g={g} orchard={orchard} culprits={culprits} />
      <a href={href(`group/${g.id}`)} className="mt-3 flex items-center justify-center gap-1 min-h-[48px] rounded-xl font-extrabold bg-emerald-700 text-white text-center px-3">
        {ui('diag.open')} <Icon name="chevron" className="w-5 h-5 shrink-0" />
      </a>
    </Card>
  );
}

// "Spotted something → what works": the effective options, straight on the result.
// Culprits that already tell us the life stage.
const YOUNG_CULPRITS = new Set(['caterpillar', 'grub', 'maggot']);

function WhatWorks({ g, orchard, culprits }) {
  const { t, ui } = useLang();
  const [pestStage, setPestStage] = React.useState(() => (culprits.some(c => YOUNG_CULPRITS.has(c)) ? 'young' : null));
  const [track, setTrack] = React.useState(orchard?.track || 'organic');
  const ctx = { stage: orchard?.stage, recentMoa: orchard?.recentMoa || [], pestStage, track };
  const list = recommend(g, ctx).options.filter(o => !o.warnings.includes('beeBlock')).slice(0, 3);
  return (
    <div className="mt-4 border-t border-stone-200 pt-3">
      <div className="text-lg font-extrabold">{ui('diag.whatWorks')}</div>
      <p className="mt-1 text-[15px] leading-snug"><b>{ui('diag.first')}:</b> {t(g.nonChem[0])}</p>
      {g.chem.length > 0 && (
        <>
          <div className="mt-3"><StagePicker groupId={g.id} value={pestStage} onChange={setPestStage} /></div>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-stone-200 mt-3" role="tablist">
            {[['organic', 'group.trackOrganic'], ['conventional', 'group.trackConv']].map(([k, label]) => (
              <button key={k} role="tab" aria-selected={track === k} onClick={() => setTrack(k)}
                className={`min-h-[44px] rounded-lg font-extrabold text-[14px] ${track === k ? (k === 'organic' ? 'bg-lime-600 text-white' : 'bg-white') : 'text-stone-600'}`}>
                {ui(label)}
              </button>
            ))}
          </div>
          <ol className="mt-2 space-y-2">
            {list.map((o, i) => {
              const note = ['youngBest', 'pairAdult', 'ovicide', 'noAdults'].find(w => o.warnings.includes(w));
              return (
                <li key={o.moa} className="flex gap-2 items-start">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-extrabold text-[13px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold leading-tight">{t(o.moaInfo.name)}{moaCode(o.moaInfo) ? <span className="text-emerald-800"> · {moaCode(o.moaInfo)}</span> : null}</div>
                    {note && <div className="text-[13px] font-bold text-sky-800">{ui(`warn.${note}`)}</div>}
                    <div className="flex flex-wrap gap-1.5 mt-1">{o.actives.slice(0, 2).map(c => <ChemChip key={c.id} c={c} />)}</div>
                  </div>
                </li>
              );
            })}
          </ol>
          {!list.length && <p className="mt-2 text-[15px]">{ui('group.organicEmpty')}</p>}
        </>
      )}
    </div>
  );
}
