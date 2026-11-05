import React from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { STAGES, WEATHER } from '../core/stages.js';

/** One slim line: crop stage + weather. Replaces the big orchard card. */
export function OrchardBar({ orchard, setOrchard }) {
  const { t, ui } = useLang();
  const sel = 'min-h-[40px] w-full rounded-xl border border-slate-200 bg-white px-2 text-[15px] font-bold text-slate-700';
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="block">
        <span className="block text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">{ui('home.stage')}</span>
        <select value={orchard.stage || ''} onChange={e => setOrchard({ stage: e.target.value || null })} className={sel}>
          <option value="">—</option>
          {STAGES.map(s => <option key={s.id} value={s.id}>{t(s.name)}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="block text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">{ui('home.weather')}</span>
        <select value={orchard.weather || ''} onChange={e => setOrchard({ weather: e.target.value || null })} className={sel}>
          <option value="">—</option>
          {WEATHER.map(w => <option key={w.id} value={w.id}>{t(w.name)}</option>)}
        </select>
      </label>
    </div>
  );
}
