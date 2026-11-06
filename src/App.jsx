import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLang } from './i18n/useLang.jsx';
import { useRoute, href } from './hooks/useRoute.js';
import { useOrchard, useFontScale } from './hooks/useOrchard.js';
import { Icon } from './ui/kit.jsx';
import Diagnose from './screens/Diagnose.jsx';
import GroupPage from './screens/GroupPage.jsx';
import { ChemicalList, ChemicalDetail } from './screens/Chemicals.jsx';
import { GROUP_FOR_CHART } from './core/rotation.js';
import { LearnList, Lesson } from './screens/Learn.jsx';
import { LangButtons, LangSheet } from './ui/ShareApp.jsx';
import { LANG_SHORT } from './i18n/useLang.jsx';
import { GlossProvider } from './ui/Gloss.jsx';

// Same family look as the Pest-MoA rotation guide: cream page, light header,
// forest-green accent, underline tabs at the top, A/A/A text size.
const TABS = [
  { id: 'diagnose', icon: 'search', path: '', match: ['home', 'diagnose', 'group', 'groups'] },
  { id: 'learn', icon: 'book', path: 'learn', match: ['learn', 'chem', 'organic'] },
];

// First launch: pick a language (saved; change it later from the header button).
function LanguageGate() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-paper">
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="w-20 h-20 rounded-2xl shadow-sm" />
      <div className="text-2xl font-extrabold text-center text-slate-900 leading-snug">榴莲综合防治<br />Durian IPM</div>
      <div className="text-[15px] font-bold text-center text-slate-600 leading-snug">请选择语言 · Choose your language<br />Pilih bahasa anda</div>
      <div className="w-full max-w-xs mt-1"><LangButtons /></div>
    </div>
  );
}

// Round "back to top" button: appears once the page has scrolled a screen or so.
function ToTop() {
  const { ui } = useLang();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={ui('app.toTop')} title={ui('app.toTop')}
      className="fixed right-[16px] z-50 w-[52px] h-[52px] rounded-full bg-[#114b2d] text-white shadow-lg flex items-center justify-center active:bg-[#0d3b23]"
      style={{ bottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}

const SIZES = [{ v: 1, cls: 'text-[12px]' }, { v: 1.1, cls: 'text-[14px]' }, { v: 1.2, cls: 'text-[16px]' }];

function Shell() {
  const { lang, ui, chosen } = useLang();
  const route = useRoute();
  const [orchard, setOrchard] = useOrchard();
  const [scale, setScale] = useFontScale(lang);
  const [sheet, setSheet] = useState(false);

  if (!chosen) return <LanguageGate />;

  let screen;
  switch (route.name) {
    case 'group': screen = <GroupPage id={route.id} orchard={orchard} setOrchard={setOrchard} />; break;
    case 'chem': screen = route.id ? <ChemicalDetail id={route.id} /> : <ChemicalList key="all" />; break;
    case 'organic': screen = <ChemicalList key="organic" initialKind="organic" />; break;
    case 'rotate': // the Rotate tab was merged into pest pages; keep old links working
      screen = GROUP_FOR_CHART[route.id] ? <GroupPage id={GROUP_FOR_CHART[route.id]} orchard={orchard} setOrchard={setOrchard} /> : <Diagnose orchard={orchard} setOrchard={setOrchard} />; break;
    case 'learn': screen = route.id ? <Lesson id={route.id} /> : <LearnList />; break;
    default: screen = <Diagnose orchard={orchard} setOrchard={setOrchard} />;
  }

  return (
    <div className="min-h-screen bg-paper text-slate-800">
      <div className="sticky top-0 z-40">
        <header className="bg-paper border-b border-slate-200 safe-top">
          <div className="max-w-2xl mx-auto px-[16px] py-[10px] flex items-center gap-[8px]">
            <a href={href('')} className="flex items-center gap-[10px] min-w-0 flex-1">
              <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="36" height="36" className="w-[36px] h-[36px] rounded-xl shadow-sm shrink-0" />
              <span className="font-extrabold text-[17px] text-slate-900 truncate">{ui('app.title')}</span>
            </a>
            <div className="flex items-center h-[40px] bg-paper border border-slate-300 rounded-xl shadow-sm overflow-hidden shrink-0" role="group" aria-label={ui('app.textSize')}>
              {SIZES.map(s => (
                <button key={s.v} onClick={() => setScale(s.v)} aria-pressed={scale === s.v}
                  className={`h-full w-[32px] font-extrabold ${s.cls} ${scale === s.v ? 'bg-[#114b2d] text-white' : 'text-slate-600'}`}>A</button>
              ))}
            </div>
            <button onClick={() => setSheet(true)} aria-label={ui('app.language')} aria-haspopup="dialog"
              className="h-[40px] px-[10px] rounded-xl bg-paper border border-slate-300 shadow-sm text-[14px] font-bold text-slate-800 shrink-0 flex items-center gap-[4px]">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
              {LANG_SHORT[lang]}
            </button>
          </div>
        </header>
        <nav className="bg-paper border-b border-slate-200">
          <div className="max-w-2xl mx-auto px-[8px] grid grid-cols-2">
            {TABS.map(tb => {
              const on = tb.match.includes(route.name);
              return (
                <a key={tb.id} href={href(tb.path)} aria-current={on ? 'page' : undefined}
                  className={`flex items-center justify-center gap-[6px] py-[12px] text-[15px] font-bold border-b-2 ${on ? 'text-[#114b2d] border-[#114b2d]' : 'text-slate-400 border-transparent'}`}>
                  <Icon name={tb.icon} className="w-[16px] h-[16px]" />{ui(`nav.${tb.id}`)}
                </a>
              );
            })}
          </div>
        </nav>
      </div>
      {sheet && <LangSheet onClose={() => setSheet(false)} />}
      <ToTop />
      <main className="max-w-2xl mx-auto px-4 pt-4" style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))' }}>{screen}</main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <GlossProvider>
        <Shell />
      </GlossProvider>
    </LanguageProvider>
  );
}
