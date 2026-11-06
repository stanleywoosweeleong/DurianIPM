import React from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Icon } from './kit.jsx';

/** Optional filter — off by default. Options are ranked on effectiveness. */
export function OrganicToggle({ on, onChange }) {
  const { ui } = useLang();
  return (
    <button type="button" role="switch" aria-checked={!!on} onClick={() => onChange(!on)}
      className={`inline-flex items-center gap-2 min-h-[40px] px-3 rounded-xl border text-[0.875rem] font-bold ${on ? 'bg-lime-600 border-lime-600 text-white' : 'bg-paper border-slate-300 text-slate-700'}`}>
      <span className={`w-8 h-5 rounded-full relative transition-colors ${on ? 'bg-paper/40' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-paper shadow transition-all ${on ? 'left-3.5' : 'left-0.5'}`} />
      </span>
      <Icon name="leaf" className="w-4 h-4" />{ui('group.organicOnly')}
    </button>
  );
}
