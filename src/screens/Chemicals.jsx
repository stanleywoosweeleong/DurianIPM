import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Section, Icon, Badge, Callout, BackBar, Chip, Fold, openExternal } from '../ui/kit.jsx';
import { KillsBadges } from '../ui/StagePicker.jsx';
import { GroupArt } from '../components/Art.jsx';
import {
  CHEMICALS, searchChemicals, findRemovedActive, chemById, moaInfo, chemsForMoa, CAUTION_TEXT, LAST_REVIEWED, organicNote, cleanNote,
} from '../core/chemDb.js';
import { MOA_LABELS, TOX_LABEL, BEE_LABEL, BENEFICIAL_LABEL, FUNGUS_LABEL, ENV_LABEL, CHART_PESTS } from '../core/moaDb.js';
import { GROUPS, groupById } from '../core/groups.js';
import { groupsForMoa } from '../core/recommend.js';
import { GROUP_FOR_CHART } from '../core/rotation.js';
import { href } from '../hooks/useRoute.js';
import { MrlCard } from '../ui/MrlLine.jsx';
import { moaCode, TOX_TONE } from './GroupPage.jsx';

const KINDS = ['all', 'organic', 'insecticide', 'fungicide'];
const KIND_LABEL = {
  all: { en: 'All', zh: '全部' }, organic: { en: 'Organic & bio', zh: '有机与生物' }, insecticide: { en: 'Insect & mite', zh: '杀虫杀螨' },
  fungicide: { en: 'Disease', zh: '杀菌' }, bio: { en: 'Biological', zh: '生物' },
};
const SITE_LABEL = (lmap, s) => lmap(MOA_LABELS)[`site_${s}`];
const SITE_TONE = { neural: 'violet', respiratory: 'blue', growth: 'green', midgut: 'amber', unknown: 'grey' };
const RISK_TONE = { low: 'green', mid: 'amber', high: 'red' };
const BEE_TONE = { high: 'red', wet: 'amber', mod: 'amber', low: 'green' };

/** The banned/removed notice — an honest answer instead of "no matches". */
export function RemovedNotice({ r }) {
  const { t, lang, ui } = useLang();
  return (
    <div className="rounded-2xl border-2 border-rose-500 bg-rose-50 p-4">
      <div className="flex items-center gap-2 text-rose-800">
        <Icon name="warn" className="w-6 h-6" />
        <div className="text-lg font-extrabold">{t(r)} — {r.hhp ? ui('status.hhp') : ui('status.banned')}</div>
      </div>
      <p className="text-[1rem] text-rose-900 mt-2 leading-snug">{t({ en: r.basisEn, zh: r.basisZh })}</p>
      <p className="text-[0.9375rem] text-rose-900 mt-2">{ui('chem.notListed')}</p>
      {r.groups.length > 0 && (
        <>
          <div className="mt-3 font-bold text-[0.9375rem] text-rose-900">{ui('chem.alternatives')}</div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {r.groups.map(gid => (
              <a key={gid} href={href(`group/${gid}`)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-rose-300 font-bold text-[0.9375rem]">
                <GroupArt id={gid} className="w-6 h-6" /> {t(groupById(gid).name)}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ChemicalList({ initialKind = 'all' }) {
  const { t, ui } = useLang();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState(initialKind);
  const list = useMemo(() => searchChemicals(q, kind), [q, kind]);
  const removed = useMemo(() => findRemovedActive(q), [q]);

  return (
    <div>
      <BackBar title={kind === 'organic' ? ui('chem.organicTitle') : ui('chem.title')} />
      <p className="text-[0.9375rem] text-slate-600 leading-snug">{kind === 'organic' ? ui('chem.organicHint') : ui('chem.hint')}</p>
      <div className="relative mt-3">
        <Icon name="search" className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input id="product-search" name="product-search" type="search" value={q} onChange={e => setQ(e.target.value)} aria-label={ui('chem.title')} autoComplete="off"
          className="w-full min-h-[52px] rounded-xl border border-slate-300 pl-10 pr-3 bg-white focus:border-[#114b2d] outline-none" />
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
        {KINDS.map(k => <Chip key={k} on={kind === k} onClick={() => setKind(k)} className="whitespace-nowrap">{t(KIND_LABEL[k])}</Chip>)}
      </div>

      {removed && <div className="mt-4"><RemovedNotice r={removed} /></div>}

      <div className="mt-4 space-y-2">
        {!removed && list.length === 0 && <Callout tone="grey" icon="search">{ui('chem.none')}</Callout>}
        {list.map(c => <ChemRow key={c.id} c={c} />)}
      </div>
      <p className="mt-4 text-[0.8125rem] text-slate-500">{ui('chem.legal')} {CHEMICALS.length} {ui('chem.count')} · {LAST_REVIEWED}</p>
    </div>
  );
}

function ChemRow({ c }) {
  const { t, lang, lmap } = useLang();
  const info = moaInfo(c.moa);
  return (
    <a href={href(`chem/${c.id}`)} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 active:bg-slate-50">
      <div className="min-w-0 flex-1">
        <div className="font-extrabold text-[1rem] leading-tight">{c.name.en} <span className="font-bold text-slate-600">{lang !== 'ms' && c.name.zh !== c.name.en ? c.name.zh : ''}</span></div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          <Badge tone="green">{moaCode(info) || t(info.name)}</Badge>
          {c.organic && <Badge tone="lime"><Icon name="leaf" className="w-3.5 h-3.5" /> {t({ en: 'Organic', zh: '有机' })}</Badge>}
          {c.site && <Badge tone={SITE_TONE[c.site]}>{SITE_LABEL(lmap, c.site)}</Badge>}
          {c.bee === 'high' && <Badge tone="red"><Icon name="bee" className="w-3.5 h-3.5" /></Badge>}
          {(c.tox === 'Ia' || c.tox === 'Ib') && <Badge tone="red">WHO {c.tox}</Badge>}
        </div>
      </div>
      <Icon name="chevron" className="w-5 h-5 text-slate-400" />
    </a>
  );
}

export function ChemicalDetail({ id }) {
  const { t, ui, lang, lmap } = useLang();
  const c = chemById(id);
  if (!c) return <div><BackBar /><p>Not found.</p></div>;
  const info = moaInfo(c.moa);
  const L = lmap(MOA_LABELS);
  const groups = [...new Set([
    ...groupsForMoa(GROUPS, c.moa).map(g => g.id),
    ...c.chartPests.map(p => GROUP_FOR_CHART[p]).filter(Boolean),
  ])].map(groupById);
  const siblings = chemsForMoa(c.moa).filter(x => x.id !== c.id);
  const mrlURL = c.foodmateId
    ? `http://2763.foodmate.net/pesticides/limit/${c.foodmateId}.html`
    : `https://www.google.com/search?q=${encodeURIComponent(`site:2763.foodmate.net ${c.name.en}`)}`;
  const dt50URL = `https://www.google.com/search?q=${encodeURIComponent(`${c.name.en} DT50 PPDB`)}`;

  return (
    <div>
      <BackBar />
      <h1 className="text-xl font-extrabold leading-tight text-slate-900">{c.name.en}</h1>
      {lang !== 'ms' && c.name.zh !== c.name.en && <div className="text-xl font-bold text-slate-700">{c.name.zh}</div>}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <Badge tone="green">{moaCode(info) || t(info.name)}</Badge>
        <Badge>{t(info.name)}</Badge>
        {c.site && <Badge tone={SITE_TONE[c.site]}>{SITE_LABEL(lmap, c.site)}</Badge>}
      </div>

      {c.hhpNote && <div className="mt-3"><Callout tone="amber" title={ui('chem.hhpNote')}>{t(c.hhpNote)} <a href={href('learn/hazard')} className="font-extrabold underline">{ui('chem.hhpLearn')}</a></Callout></div>}
      {c.organic && <div className="mt-3"><Callout tone="lime" icon="leaf" title={ui('chem.organic')}>{t(organicNote(c))}</Callout></div>}
      {c.caution && <div className="mt-3"><Callout>{t(CAUTION_TEXT[c.caution])}</Callout></div>}
      <MrlCard c={c} />

      {info.how && <p className="mt-3 text-[1rem] leading-snug font-semibold">{t(info.how)}</p>}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {c.mobility && <Badge tone="blue">{L[`mob_${c.mobility}`]}</Badge>}
        {c.translaminar && <Badge tone="blue">{L.tl}</Badge>}
        {c.twoWay && <Badge tone="blue">{L.ud}</Badge>}
        <Badge tone={TOX_TONE[c.tox]}>WHO {c.tox === 'NL' ? lmap(TOX_LABEL).NL : `${c.tox} · ${lmap(TOX_LABEL)[c.tox]}`}</Badge>
        {c.bee && BEE_LABEL[c.bee] && <Badge tone={BEE_TONE[c.bee]}><Icon name="bee" className="w-3.5 h-3.5" /> {L[`risk_${c.bee === 'mod' || c.bee === 'wet' ? 'mid' : c.bee}`] || c.bee}</Badge>}
      </div>
      <div className="mt-2"><KillsBadges stages={info.stages} /></div>

      {groups.length > 0 && (
        <Section title={ui('chem.usedFor')}>
          <div className="flex flex-wrap gap-2">
            {groups.map(g => (
              <a key={g.id} href={href(`group/${g.id}`)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-[0.9375rem]">
                <GroupArt id={g.id} className="w-6 h-6" /> {t(g.name)}
              </a>
            ))}
          </div>
        </Section>
      )}

      {(info.detail || info.note) && (
        <Fold title={ui('chem.how')}>
          {info.detail && <p className="text-[0.9375rem] leading-snug text-slate-700">{t(info.detail)}</p>}
          {info.note && <p className="text-[0.9375rem] leading-snug text-[#114b2d] mt-2">{t(info.note)}</p>}
        </Fold>
      )}

      <Fold title={ui('chem.safety')} hint={c.bee && BEE_LABEL[c.bee] ? t(BEE_LABEL[c.bee]) : ui('chem.phiText')}>
        <div className="space-y-2">
          {c.bee && BEE_LABEL[c.bee] && <Row label={ui('chem.bee')}>{t(BEE_LABEL[c.bee])}</Row>}
          {c.beneficial && <Row label={ui('chem.beneficial')}>{t(BENEFICIAL_LABEL[c.beneficial])}</Row>}
          {c.fungusCompat && <Row label={ui('chem.fungus')}>{t(FUNGUS_LABEL[c.fungusCompat])}</Row>}
          {c.env.length > 0 && <Row label={ui('chem.timing')}>{c.env.map(e => <div key={e}>{t(ENV_LABEL[e])}</div>)}</Row>}
          {c.eu && <Row label={ui('chem.eu')}>{t(c.eu)}</Row>}
          <Row label={ui('chem.phi')}>{ui('chem.phiText')}</Row>
        </div>
      </Fold>

      {(info.crossRes || Object.keys(c.risk).length > 0 || siblings.length > 0) && (
        <Fold title={ui('chem.rotationFold')} hint={siblings.length ? `${ui('chem.sameGroup')}: ${siblings.slice(0, 3).map(x => t(x.name)).join(', ')}` : null}>
          {info.crossRes && <p className="text-[0.9375rem] leading-snug">{t(info.crossRes)}</p>}
          {Object.keys(c.risk).length > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="text-[0.8125rem] font-bold text-slate-500 uppercase tracking-wide">{ui('chem.resistanceBy')}</div>
              {Object.entries(c.risk).map(([p, r]) => {
                const pest = CHART_PESTS.find(x => x.id === p);
                return (
                  <div key={p}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[0.9375rem]">{t(pest)}</span>
                      <Badge tone={RISK_TONE[r]}>{L[`risk_${r}`]}</Badge>
                    </div>
                    {c.notes[p] && cleanNote(L[`note_${c.notes[p]}`], lang) && <p className="text-[0.8125rem] text-slate-600 leading-snug">{cleanNote(L[`note_${c.notes[p]}`], lang)}</p>}
                  </div>
                );
              })}
            </div>
          )}
          {siblings.length > 0 && (
            <div className="mt-3">
              <div className="text-[0.8125rem] font-bold text-slate-500 uppercase tracking-wide mb-1">{ui('chem.sameGroup')}</div>
              <div className="flex flex-wrap gap-1.5">
                {siblings.map(x => <a key={x.id} href={href(`chem/${x.id}`)} className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[0.875rem] font-bold">{t(x.name)}</a>)}
              </div>
            </div>
          )}
        </Fold>
      )}

      <Fold title={ui('chem.lookups')}>
        <div className="space-y-2">
          <a href={mrlURL} onClick={e => openExternal(e, mrlURL)} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-300 font-bold text-[#114b2d]">
            <Icon name="link" /> {ui('chem.mrl')}
          </a>
          <a href={dt50URL} onClick={e => openExternal(e, dt50URL)} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-300 font-bold text-[#114b2d]">
            <Icon name="link" /> {ui('chem.dt50')}
          </a>
          <p className="text-[0.8125rem] text-slate-500 leading-snug">{ui('chem.mrlNote')}</p>
        </div>
      </Fold>

      <p className="mt-6 text-[0.8125rem] text-slate-500 leading-snug">{ui('chem.legal')}</p>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div>
      <div className="text-[0.8125rem] font-bold text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="text-[0.9375rem] leading-snug">{children}</div>
    </div>
  );
}
