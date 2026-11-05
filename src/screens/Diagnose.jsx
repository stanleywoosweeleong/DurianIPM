import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Icon, Badge } from '../ui/kit.jsx';
import { GroupArt, Glyph } from '../components/Art.jsx';
import { LeafCurlArt } from '../components/LeafCurl.jsx';
import { PARTS, SIGNS, signsForPart, diagnose, MAIN_SIGNS, nextAfterSign, PART_PESTS } from '../core/diagnosis.js';
import GroupPage from './GroupPage.jsx';
import { href, go, back as historyBack, useRoute } from '../hooks/useRoute.js';
import { searchKnownPests } from '../core/examples.js';
import { groupById } from '../core/groups.js';

// Culprits that already tell us the life stage (pre-selects "young" on the result).
const YOUNG_CULPRITS = new Set(['caterpillar', 'grub', 'maggot']);

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
  // One tap per question: part → sign → (only if needed) creature → result.
  // The part (and "describe" mode) live in the address — #/diagnose/fruit[/describe] —
  // so Back from a pest page returns to the same list instead of the start.
  const route = useRoute();
  const part = route.name === 'diagnose' && PARTS.some(p => p.id === route.id) ? route.id : null;
  const describe = !!part && route.sub === 'describe'; // false = pick from the part's pest list
  const setPart = (id) => go(id ? `diagnose/${id}` : '');
  const setDescribe = (on) => (on ? go(`diagnose/${part}/describe`) : historyBack());
  const [sign, setSign] = useState(null);
  const [culprit, setCulprit] = useState(null);
  const [showAllSigns, setShowAllSigns] = useState(false);
  React.useEffect(() => { setSign(null); setCulprit(null); setShowAllSigns(false); }, [part, describe]);

  const step = !part ? 0 : !sign ? 1 : (culprit || nextAfterSign(sign).decisive) ? 3 : 2;
  const results = useMemo(
    () => (step === 3 ? diagnose({ signs: [sign], culprits: culprit ? [culprit] : [] }) : []), // purely what the farmer sees
    [step, sign, culprit]
  );
  const restart = () => { setSign(null); setCulprit(null); setShowAllSigns(false); go(''); };
  const back = () => {
    if (step === 3 && culprit) setCulprit(null);
    else if (step >= 2 || (step === 3 && !culprit)) { setSign(null); }
    else if (step === 1) historyBack(); // describe → list, list → part tiles
  };
  const steps = sign && nextAfterSign(sign).decisive ? 2 : 3;

  const Header = ({ title, sub }) => (
    <>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={back} aria-label={ui('diag.back')} className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center active:bg-slate-100">
          <Icon name="back" className="w-6 h-6" />
        </button>
        <div className="flex gap-1 flex-1" aria-hidden="true">
          {Array.from({ length: steps }).map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-[#114b2d]' : 'bg-slate-200'}`} />)}
        </div>
      </div>
      <h1 className="text-xl font-extrabold text-slate-900">{title}</h1>
      {sub && <p className="text-[14px] text-slate-500">{sub}</p>}
    </>
  );

  if (step === 3) {
    // The result IS the advice page — no summary card, no "full plan" tap.
    const [top, ...rest] = results;
    if (!top) {
      return (
        <div>
          <p className="mt-3 text-[16px]">{ui('diag.none')}</p>
          <button onClick={restart} className="mt-5 w-full min-h-[52px] rounded-xl border border-slate-300 bg-white font-bold">{ui('diag.restart')}</button>
        </div>
      );
    }
    const tone = top.confidence === 'high' ? 'green' : top.confidence === 'medium' ? 'amber' : 'grey';
    const others = rest.slice(0, 2);
    const intro = (
      <div className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-extrabold text-slate-500 uppercase tracking-wider">{ui('diag.resultTitle')}</span>
          <Badge tone={tone}>{ui(`diag.conf.${top.confidence}`)}</Badge>
        </div>
        <p className="mt-1 text-[13px] text-slate-500 leading-snug">{ui('diag.because')}: {[...new Map(top.evidence.map(e => [e.id, e])).values()].map(e => t(e.label)).join(' · ')}</p>
        {top.confidence === 'low' && <p className="mt-1 text-[13px] text-amber-900 leading-snug">{ui('diag.lowConf')}</p>}
        {others.length > 0 && (
          <p className="mt-1.5 text-[14px] leading-snug">
            <span className="text-slate-500">{ui('diag.others')}: </span>
            {others.map((r, i) => (
              <React.Fragment key={r.group.id}>
                {i > 0 && <span className="text-slate-300"> · </span>}
                <a href={href(`group/${r.group.id}`)} className="font-bold text-[#114b2d] underline">{t(r.group.name)}</a>
              </React.Fragment>
            ))}
          </p>
        )}
        <button onClick={restart} className="mt-2 text-[14px] font-bold text-slate-600 underline">{ui('diag.restart')}</button>
      </div>
    );
    return (
      <GroupPage key={top.group.id} id={top.group.id} orchard={orchard} setOrchard={setOrchard} intro={intro} onBack={back}
        initialPestStage={culprit && YOUNG_CULPRITS.has(culprit) ? 'young' : null} />
    );
  }

  if (step === 0) {
    return (
      <div>
        <KnownSearch />
        <CommonProblems />
        <h1 className="text-xl font-extrabold text-slate-900 mt-6">{ui('diag.q1')}</h1>
        <p className="text-[14px] text-slate-500 leading-snug">{ui('diag.intro')}</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {PARTS.map(p => (
            <Tile key={p.id} onClick={() => setPart(p.id)}>
              <Glyph name={PART_GLYPH[p.id]} className="w-9 h-9" />
              {t(p.name)}
            </Tile>
          ))}
        </div>
      </div>
    );
  }

  if (step === 1 && !describe) {
    // The part's pests & diseases, each with what to look for — one tap to the advice.
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={back} aria-label={ui('diag.back')} className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center active:bg-slate-100">
            <Icon name="back" className="w-6 h-6" />
          </button>
          <Glyph name={PART_GLYPH[part]} className="w-7 h-7 text-slate-700" />
          <h1 className="text-xl font-extrabold text-slate-900">{t(PARTS.find(p => p.id === part).name)}</h1>
        </div>
        <p className="text-[14px] text-slate-500 mb-2">{ui('diag.pickOne')}</p>
        {/* Pests together first, then fungal/bacterial diseases together. */}
        {[['pests', (PART_PESTS[part] || []).filter(([gid]) => groupById(gid).kingdom !== 'disease')],
          ['diseases', (PART_PESTS[part] || []).filter(([gid]) => groupById(gid).kingdom === 'disease')]]
          .filter(([, list]) => list.length).map(([kind, list]) => (
            <section key={kind} className="mt-3 first:mt-0">
              <h2 className="text-[13px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">{ui(`diag.${kind}`)}</h2>
              <div className="space-y-2">
                {list.map(([gid, look]) => (
                  <a key={gid} href={href(`group/${gid}`)} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 active:bg-slate-50">
                    <span className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"><GroupArt id={gid} className="w-8 h-8 text-slate-700" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-extrabold text-[16px] leading-tight text-slate-900">{t(groupById(gid).name)}</span>
                      <span className="block text-[14px] text-slate-600 leading-snug mt-0.5">{t(look)}</span>
                    </span>
                    <Icon name="chevron" className="w-5 h-5 text-slate-400 shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          ))}
        <button onClick={() => setDescribe(true)}
          className="mt-3 w-full rounded-xl border-2 border-dashed border-slate-300 px-3.5 py-3 text-[15px] font-bold text-slate-600 text-left">
          {ui('diag.notSure')}
        </button>
      </div>
    );
  }

  if (step === 1) {
    const main = MAIN_SIGNS[part] || [];
    const list = showAllSigns ? signsForPart([part]) : main.map(id => SIGNS.find(x => x.id === id)).filter(Boolean);
    return (
      <div>
        <Header title={ui('diag.q2')} sub={t(PARTS.find(p => p.id === part).name)} />
        <div className="grid grid-cols-1 gap-2 mt-3">
          {list.map(s => (
            <button key={s.id} type="button" onClick={() => setSign(s.id)}
              className="text-left rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[15px] font-bold text-slate-800 active:bg-slate-50">
              {s.art && <div className="mb-2 rounded-lg overflow-hidden bg-white"><LeafCurlArt id={s.art} alt={t(s.label)} lang={lang} className="h-24" /></div>}
              <span className="flex items-center justify-between gap-2">{t(s.label)}<Icon name="chevron" className="w-5 h-5 text-slate-400 shrink-0" /></span>
            </button>
          ))}
          {!showAllSigns && signsForPart([part]).length > main.length && (
            <button type="button" onClick={() => setShowAllSigns(true)}
              className="rounded-xl border-2 border-dashed border-slate-300 px-3.5 py-3 text-[15px] font-bold text-slate-600">
              {ui('diag.somethingElse')}
            </button>
          )}
        </div>
      </div>
    );
  }

  // step 2 — only the creatures that fit the sign
  const { culprits } = nextAfterSign(sign);
  return (
    <div>
      <Header title={ui('diag.q3')} sub={ui('diag.q3Sub')} />
      <div className="grid grid-cols-3 gap-2 mt-3">
        {culprits.map(c => (
          <Tile key={c.id} onClick={() => setCulprit(c.id)}>
            {c.id === 'unsure' ? <span className="text-3xl leading-none">?</span>
              : c.id === 'nothing' ? <Glyph name="leafSpot" className="w-9 h-9" />
              : <GroupArt id={topGroupOf(c)} className="w-9 h-9" />}
            <span className="text-[13px]">{t(c.label)}</span>
          </Tile>
        ))}
      </div>
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

// The most common durian problems in Malaysian orchards — one tap straight to
// "Best fit". Edit this list to change the shortcuts (order = display order).
const COMMON = [
  ['fruit-borers', { en: 'Fruit borer', zh: '果实蛀虫' }],
  ['leafhoppers', { en: 'Leafhoppers', zh: '叶蝉（青蚊）' }],
  ['phloem-suckers', { en: 'Psyllids & aphids', zh: '木虱与蚜虫' }],
  ['scale-mealybug', { en: 'Mealybugs & scales', zh: '粉蚧与介壳虫' }],
  ['thrips', { en: 'Thrips', zh: '蓟马' }],
  ['mites', { en: 'Mites', zh: '螨类' }],
  ['trunk-borers', { en: 'Stem borers', zh: '枝干蛀虫' }],
  ['oomycete', { en: 'Phytophthora', zh: '疫霉病' }],
  ['rhizoctonia', { en: 'Rhizoctonia', zh: '丝核菌叶枯' }],
];

function CommonProblems() {
  const { t, ui } = useLang();
  return (
    <section className="mt-4">
      <h2 className="text-[13px] font-extrabold text-slate-500 uppercase tracking-wider">{ui('diag.common')}</h2>
      {/* Pests together, then diseases together — same order as the part lists. */}
      {[['pests', COMMON.filter(([id]) => groupById(id).kingdom !== 'disease')],
        ['diseases', COMMON.filter(([id]) => groupById(id).kingdom === 'disease')]]
        .filter(([, list]) => list.length).map(([kind, list]) => (
          <div key={kind} className="mt-2">
            <div className="text-[12px] font-bold text-slate-400 mb-1">{ui(`diag.${kind}`)}</div>
            <div className="grid grid-cols-3 gap-2">
              {list.map(([id, label]) => (
                <a key={id} href={href(`group/${id}`)}
                  className="flex flex-col items-center justify-center gap-1 p-1.5 min-h-[76px] rounded-xl border border-slate-200 bg-white text-center active:bg-slate-50">
                  <GroupArt id={id} className="w-8 h-8 text-slate-700" />
                  <span className="text-[13px] font-bold text-slate-700 leading-tight">{t(label)}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
    </section>
  );
}
