import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Chip, Icon, Badge, Callout } from '../ui/kit.jsx';
import { GroupArt, Glyph } from '../components/Art.jsx';
import { LeafCurlArt } from '../components/LeafCurl.jsx';
import { PARTS, CULPRITS, signsForPart, diagnose } from '../core/diagnosis.js';
import { recommend } from '../core/recommend.js';
import { OrganicToggle } from '../ui/OrganicToggle.jsx';
import { ChemChip, moaCode } from './GroupPage.jsx';
import { StagePicker } from '../ui/StagePicker.jsx';
import { href } from '../hooks/useRoute.js';
import { WikiCover } from '../components/WikiPhotoStrip.jsx';
import { coverFor } from '../core/photos.js';
import { searchKnownPests } from '../core/examples.js';
import { groupById } from '../core/groups.js';

const toggle = (arr, v) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

const PART_GLYPH = { leaf: 'partLeaf', flower: 'partFlower', fruit: 'partFruit', trunk: 'partTrunk', root: 'root' };
// A culprit tile shows the art of the group it points to most strongly.
const topGroupOf = (c) => Object.entries(c.w).sort((a, b) => b[1] - a[1])[0]?.[0];

function Tile({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={!!on}
      className={`flex flex-col items-center justify-center gap-1 p-2 min-h-[92px] rounded-xl border text-center text-[14px] font-bold leading-tight transition-colors ${on
        ? 'bg-[#114b2d] border-[#114b2d] text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 active:bg-slate-50'}`}>
      {children}
    </button>
  );
}

export default function Diagnose({ orchard, setOrchard }) {
  const { t, ui, lang } = useLang();
  const [step, setStep] = useState(0);
  const [parts, setParts] = useState([]);
  const [signs, setSigns] = useState([]);
  const [culprits, setCulprits] = useState([]);

  const signOptions = useMemo(() => signsForPart(parts), [parts]);
  const results = useMemo(
    () => (step === 3 ? diagnose({ signs, culprits }) : []), // purely what the farmer sees
    [step, signs, culprits]
  );

  const restart = () => { setStep(0); setParts([]); setSigns([]); setCulprits([]); };
  const canNext = [parts.length > 0, signs.length > 0, culprits.length > 0][step];

  const Progress = () => (
    <div className="flex items-center gap-2 mb-3" aria-hidden="true">
      <span className="text-[13px] font-extrabold text-slate-500 uppercase tracking-wider">{ui('diag.step')} {step + 1}/3</span>
      <div className="flex gap-1 flex-1">{[0, 1, 2].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-[#114b2d]' : 'bg-slate-200'}`} />)}</div>
    </div>
  );

  const Nav = () => (
    <div className="sticky bottom-0 mt-5 flex gap-2 bg-[#fcfbf7]/95 py-2" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="min-h-[52px] px-5 rounded-xl border border-slate-300 bg-white font-bold">{ui('diag.back')}</button>
      )}
      <button disabled={!canNext} onClick={() => setStep(step + 1)}
        className="flex-1 min-h-[52px] rounded-xl bg-[#114b2d] text-white font-extrabold text-[17px] disabled:bg-slate-300 disabled:text-slate-500">
        {step === 2 ? ui('diag.results') : ui('diag.next')}
      </button>
    </div>
  );

  if (step === 3) {
    const [top, ...rest] = results;
    return (
      <div>
        <h1 className="text-[13px] font-extrabold text-slate-500 uppercase tracking-wider">{ui('diag.resultTitle')}</h1>
        {!top && <p className="mt-3 text-[16px]">{ui('diag.none')}</p>}
        {top && (
          <>
            {top.confidence === 'low' && <div className="mt-3"><Callout>{ui('diag.lowConf')}</Callout></div>}
            <ResultCard r={top} big orchard={orchard} culprits={culprits} />
            {rest.length > 0 && (
              <>
                <h2 className="mt-5 text-[13px] font-extrabold text-slate-500 uppercase tracking-wider">{ui('diag.others')}</h2>
                <div className="space-y-2 mt-2">{rest.slice(0, 3).map(r => <ResultCard key={r.group.id} r={r} />)}</div>
              </>
            )}
          </>
        )}
        <button onClick={restart} className="mt-5 w-full min-h-[52px] rounded-xl border border-slate-300 bg-white font-bold">{ui('diag.restart')}</button>
      </div>
    );
  }

  return (
    <div>
      <Progress />
      {step === 0 && (
        <>
          <KnownSearch />
          <p className="text-[15px] text-slate-600 leading-snug mt-4 mb-3">{ui('diag.intro')}</p>
          <h1 className="text-xl font-extrabold text-slate-900">{ui('diag.q1')}</h1>
          <p className="text-[14px] text-slate-500">{ui('diag.q1Sub')}</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {PARTS.map(p => (
              <Tile key={p.id} on={parts.includes(p.id)} onClick={() => { setParts(toggle(parts, p.id)); setSigns([]); }}>
                <Glyph name={PART_GLYPH[p.id]} className="w-9 h-9" />
                {t(p.name)}
              </Tile>
            ))}
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <h1 className="text-xl font-extrabold text-slate-900">{ui('diag.q2')}</h1>
          <p className="text-[14px] text-slate-500">{ui('diag.q2Sub')}</p>
          <div className="grid grid-cols-1 gap-2 mt-3">
            {signOptions.map(s => (
              <Chip key={s.id} on={signs.includes(s.id)} onClick={() => setSigns(toggle(signs, s.id))}>
                {s.art && <div className="mb-2 rounded-lg overflow-hidden bg-white"><LeafCurlArt id={s.art} alt={t(s.label)} lang={lang} className="h-24" /></div>}
                <span className="inline-flex gap-2 items-start">
                  <span className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${signs.includes(s.id) ? 'border-white' : 'border-slate-400'}`}>
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
          <h1 className="text-xl font-extrabold text-slate-900">{ui('diag.q3')}</h1>
          <p className="text-[14px] text-slate-500">{ui('diag.q3Sub')}</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {CULPRITS.map(c => (
              <Tile key={c.id} on={culprits.includes(c.id)}
                onClick={() => setCulprits(c.id === 'nothing' || c.id === 'unsure' ? [c.id] : toggle(culprits.filter(x => x !== 'nothing' && x !== 'unsure'), c.id))}>
                {c.id === 'unsure' ? <span className="text-3xl leading-none">?</span>
                  : c.id === 'nothing' ? <Glyph name="leafSpot" className="w-9 h-9" />
                  : <GroupArt id={topGroupOf(c)} className="w-9 h-9" />}
                <span className="text-[13px]">{t(c.label)}</span>
              </Tile>
            ))}
          </div>
        </>
      )}
      <Nav />
    </div>
  );
}

function ResultCard({ r, big, orchard, culprits = [] }) {
  const { t, ui, lang } = useLang();
  const g = r.group;
  const tone = r.confidence === 'high' ? 'green' : r.confidence === 'medium' ? 'amber' : 'grey';
  const uniq = [...new Map(r.evidence.map(e => [e.id, e])).values()];
  if (!big) {
    // "Also possible" — one compact row each.
    return (
      <a href={href(`group/${g.id}`)} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 active:bg-slate-50">
        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0"><GroupArt id={g.id} className="w-8 h-8" /></div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-[16px] leading-tight">{t(g.name)}</div>
          <div className="text-[13px] text-slate-500 truncate">{t(g.examples)}</div>
        </div>
        <Badge tone={tone}>{ui(`diag.conf.${r.confidence}`)}</Badge>
        <Icon name="chevron" className="w-5 h-5 text-slate-400 shrink-0" />
      </a>
    );
  }
  return (
    <Card className="mt-2 p-3 border-l-4 border-l-[#114b2d]">
      <WikiCover photo={coverFor(g.id)} lang={lang} className="h-40 mb-3" />
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
          <GroupArt id={g.id} className="w-10 h-10" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xl font-extrabold leading-tight">{t(g.name)}</div>
          <div className="mt-1"><Badge tone={tone}>{ui(`diag.conf.${r.confidence}`)}</Badge></div>
        </div>
      </div>
      <p className="mt-2 text-[13px] text-slate-500 leading-snug">{ui('diag.because')}: {uniq.map(e => t(e.label)).join(' · ')}</p>
      <p className="mt-2 text-[16px] leading-snug text-slate-800 line-clamp-3">{t(g.why)}</p>
      <WhatWorks g={g} orchard={orchard} culprits={culprits} />
      <a href={href(`group/${g.id}`)} className="mt-3 flex items-center justify-center gap-1 min-h-[48px] rounded-xl font-extrabold bg-[#114b2d] text-white text-center px-3">
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
  const [track, setTrack] = React.useState(orchard?.track === 'organic' ? 'organic' : 'all');
  const ctx = { stage: orchard?.stage, recentMoa: orchard?.recentMoa || [], pestStage, track };
  const list = recommend(g, ctx).options.filter(o => !o.warnings.includes('beeBlock')).slice(0, 3);
  return (
    <div className="mt-4 border-t border-slate-200 pt-3">
      <div className="text-lg font-extrabold">{ui('diag.whatWorks')}</div>
      <p className="mt-1 text-[15px] leading-snug"><b>{ui('diag.first')}:</b> {t(g.nonChem[0])}</p>
      {g.chem.length > 0 && (
        <>
          <div className="mt-3"><StagePicker groupId={g.id} value={pestStage} onChange={setPestStage} /></div>
          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[13px] font-extrabold text-slate-500 uppercase tracking-wider">{ui('diag.bestFirst')}</span>
            <OrganicToggle on={track === 'organic'} onChange={v => setTrack(v ? 'organic' : 'all')} />
          </div>
          <ol className="mt-2 space-y-2">
            {list.map((o, i) => {
              const note = ['youngBest', 'pairAdult', 'ovicide', 'noAdults'].find(w => o.warnings.includes(w));
              return (
                <li key={o.moa} className="flex gap-2 items-start">
                  <span className="w-6 h-6 rounded-full bg-[#114b2d] text-white font-extrabold text-[13px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold leading-tight">{t(o.moaInfo.name)}{moaCode(o.moaInfo) ? <span className="text-[#114b2d]"> · {moaCode(o.moaInfo)}</span> : null}</div>
                    {note && <div className="text-[13px] font-bold text-sky-800">{ui(`warn.${note}`)}</div>}
                    <div className="flex flex-wrap gap-1.5 mt-1">{o.actives.slice(0, 2).map(c => <ChemChip key={c.id} c={c} />)}</div>
                  </div>
                </li>
              );
            })}
          </ol>
          {!list.length && track === 'organic' && <p className="mt-2 text-[15px]">{ui('group.organicEmpty')}</p>}
        </>
      )}
    </div>
  );
}

/** "Already know the pest?" — jump straight to its advice by name. */
function KnownSearch() {
  const { t, ui } = useLang();
  const [q, setQ] = useState('');
  const hits = useMemo(() => searchKnownPests(q).slice(0, 6), [q]);
  return (
    <div>
      <div className="relative">
        <Icon name="search" className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={ui('home.searchKnown')} aria-label={ui('home.knownTitle')}
          className="w-full min-h-[48px] rounded-xl border border-slate-300 pl-10 pr-3 bg-white focus:border-[#114b2d] outline-none" />
      </div>
      {q && (
        <div className="mt-2 space-y-1.5">
          {hits.length === 0 && <p className="text-[14px] text-slate-600">{ui('home.noKnown')}</p>}
          {hits.map(({ pest, groupId }) => (
            <a key={pest.id} href={href(`group/${groupId}`)} className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200">
              <div className="min-w-0">
                <div className="font-bold text-[15px] leading-tight">{t(pest.common)}</div>
                <div className="text-[13px] italic text-slate-500 truncate">{pest.scientific}</div>
              </div>
              <Badge tone="green">{t(groupById(groupId)?.name)}</Badge>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
