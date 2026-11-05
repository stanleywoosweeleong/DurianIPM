import React from 'react';
import { LanguageProvider, useLang } from './i18n/useLang.jsx';
import { useRoute, href } from './hooks/useRoute.js';
import { useOrchard, useFontScale } from './hooks/useOrchard.js';
import { Icon } from './ui/kit.jsx';
import Diagnose from './screens/Diagnose.jsx';
import GroupPage from './screens/GroupPage.jsx';
import { ChemicalList, ChemicalDetail } from './screens/Chemicals.jsx';
import { GROUP_FOR_CHART } from './core/rotation.js';
import { LearnList, Lesson } from './screens/Learn.jsx';

// Same family look as the Pest-MoA rotation guide: cream page, light header,
// forest-green accent, underline tabs at the top, A/A/A text size.
const TABS = [
  { id: 'diagnose', icon: 'search', path: '', match: ['home', 'diagnose', 'group', 'groups'] },
  { id: 'learn', icon: 'book', path: 'learn', match: ['learn', 'chem', 'organic'] },
];

function LanguageGate() {
  const { setLang } = useLang();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-[#fcfbf7]">
      <img src="pwa-192x192.png" alt="" className="w-20 h-20 rounded-2xl" />
      <div className="text-2xl font-extrabold text-center text-slate-900">榴莲综合防治<br />Durian IPM</div>
      <div className="w-full max-w-xs space-y-3 mt-2">
        <button onClick={() => setLang('zh')} className="w-full min-h-[56px] rounded-xl bg-[#114b2d] text-white text-xl font-extrabold">中文</button>
        <button onClick={() => setLang('en')} className="w-full min-h-[56px] rounded-xl bg-white border border-slate-300 text-xl font-extrabold">English</button>
      </div>
    </div>
  );
}

const SIZES = [{ v: 1, cls: 'text-[12px]' }, { v: 1.1, cls: 'text-[14px]' }, { v: 1.2, cls: 'text-[16px]' }];

function Shell() {
  const { lang, setLang, ui, chosen } = useLang();
  const route = useRoute();
  const [orchard, setOrchard] = useOrchard();
  const [scale, setScale] = useFontScale(lang);

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
    <div className="min-h-screen bg-[#fcfbf7] text-slate-800">
      <div className="sticky top-0 z-40">
        <header className="bg-[#f4f2ea] border-b border-slate-300 safe-top">
          <div className="max-w-2xl mx-auto px-[16px] py-[10px] flex items-center gap-[8px]">
            <a href={href('')} className="flex items-center gap-[10px] min-w-0 flex-1">
              <span className="w-[36px] h-[36px] bg-[#114b2d] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                <Icon name="leaf" className="w-[20px] h-[20px]" />
              </span>
              <span className="font-extrabold text-[17px] text-slate-900 truncate">{ui('app.title')}</span>
            </a>
            <div className="flex items-center h-[40px] bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden shrink-0" role="group" aria-label={ui('app.textSize')}>
              {SIZES.map(s => (
                <button key={s.v} onClick={() => setScale(s.v)} aria-pressed={scale === s.v}
                  className={`h-full w-[32px] font-extrabold ${s.cls} ${scale === s.v ? 'bg-[#114b2d] text-white' : 'text-slate-600'}`}>A</button>
              ))}
            </div>
            <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="h-[40px] px-[12px] rounded-xl bg-white border border-slate-300 shadow-sm text-[14px] font-bold text-slate-700 shrink-0">
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
        </header>
        <nav className="bg-white border-b border-slate-200">
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
      <main className="max-w-2xl mx-auto px-4 pt-4" style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))' }}>{screen}</main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
