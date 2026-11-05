import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Section, Icon, Badge } from '../ui/kit.jsx';
import { OrchardBar } from '../ui/OrchardBar.jsx';
import { GroupArt } from '../components/Art.jsx';
import { GROUPS, KINGDOM } from '../core/groups.js';
import { searchKnownPests, photoNamesFor } from '../core/examples.js';
import { WikiThumb } from '../components/WikiPhotoStrip.jsx';
import { href } from '../hooks/useRoute.js';

/** Icon tile, same pattern as the pest tiles in the MoA rotation guide. */
export function GroupTile({ g, flag }) {
  const { t } = useLang();
  return (
    <a href={href(`group/${g.id}`)}
      className="relative flex flex-col items-center gap-1.5 p-1.5 pb-2 rounded-xl border border-slate-200 bg-white text-center active:bg-slate-50">
      <WikiThumb names={photoNamesFor(g.id, 2)} className="w-full h-20"
        fallback={<GroupArt id={g.id} className="w-10 h-10 text-slate-700" />} />
      <span className="text-[13px] font-bold text-slate-700 leading-tight">{t(g.name)}</span>
      {flag && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />}
    </a>
  );
}

export default function Groups({ orchard, setOrchard }) {
  const { t, ui } = useLang();
  const [q, setQ] = useState('');
  const hits = useMemo(() => searchKnownPests(q).slice(0, 8), [q]);
  const watch = useMemo(() => (orchard.stage
    ? GROUPS.filter(g => g.stages.includes(orchard.stage))
      .sort((a, b) => (b.weather === orchard.weather) - (a.weather === orchard.weather)).slice(0, 6)
    : []), [orchard.stage, orchard.weather]);

  return (
    <div>
      <div className="relative">
        <Icon name="search" className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={ui('home.searchKnown')}
          className="w-full min-h-[48px] rounded-xl border border-slate-300 pl-10 pr-3 bg-white focus:border-[#114b2d] outline-none" />
      </div>
      {q && (
        <div className="mt-2 space-y-1.5">
          {hits.length === 0 && <p className="text-[15px] text-slate-600">{ui('home.noKnown')}</p>}
          {hits.map(({ pest, groupId }) => (
            <a key={pest.id} href={href(`group/${groupId}`)} className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200">
              <div className="min-w-0">
                <div className="font-bold text-[15px] leading-tight">{t(pest.common)}</div>
                <div className="text-[13px] italic text-slate-500 truncate">{pest.scientific}</div>
              </div>
              <Badge tone="green">{t(GROUPS.find(g => g.id === groupId)?.name)}</Badge>
            </a>
          ))}
        </div>
      )}

      <div className="mt-4"><OrchardBar orchard={orchard} setOrchard={setOrchard} /></div>

      {watch.length > 0 && (
        <Section title={ui('home.watch')}>
          <div className="grid grid-cols-3 gap-2">
            {watch.map(g => <GroupTile key={g.id} g={g} flag={orchard.weather && g.weather === orchard.weather} />)}
          </div>
          {orchard.stage === 'flowering' && (
            <p className="mt-2 text-[14px] text-amber-900 leading-snug flex gap-1.5"><Icon name="bee" className="w-4 h-4 shrink-0 mt-0.5" />{ui('home.flowerWarn')}</p>
          )}
        </Section>
      )}

      {Object.keys(KINGDOM).map(k => (
        <Section key={k} title={t(KINGDOM[k])}>
          <div className="grid grid-cols-3 gap-2">
            {GROUPS.filter(g => g.kingdom === k).map(g => <GroupTile key={g.id} g={g} />)}
          </div>
        </Section>
      ))}

      <a href={href('organic')} className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-lime-50 border border-lime-300">
        <Icon name="leaf" className="w-6 h-6 text-lime-700" />
        <span className="flex-1">
          <span className="block font-extrabold text-[15px]">{ui('home.organic')}</span>
          <span className="block text-[13px] text-slate-600">{ui('home.organicSub')}</span>
        </span>
        <Icon name="chevron" className="w-5 h-5 text-slate-400" />
      </a>
      <p className="mt-3 text-[13px] text-slate-500 leading-snug">{ui('home.allGroupsSub')}</p>
    </div>
  );
}
