import React from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { chinaMrl, DEFAULT_MRL } from '../core/mrl.js';

// One compact line under an option's products: what China allows on durian,
// and the 0.01 mg/kg default wherever China sets nothing.
export function MrlLine({ actives }) {
  const { t, ui } = useLang();
  const named = []; let unset = 0;
  for (const c of actives) {
    const r = chinaMrl(c);
    if (r.kind === 'value') named.push(`${t(c.name)} ${r.mrl} mg/kg${r.basis === 'durian' ? '' : ' ' + ui('mrl.group')}`);
    else if (r.kind === 'exempt') named.push(`${t(c.name)} ${ui('mrl.exempt')}`);
    else unset++;
  }
  const dflt = ui('mrl.short').replace('{d}', DEFAULT_MRL);
  const tail = unset === 0 ? '' : named.length ? `${ui('mrl.others')} ${dflt}` : dflt;
  return (
    <p className="mt-1.5 text-[0.8125rem] text-slate-500 leading-snug">
      <b className="text-slate-600">{ui('mrl.china')}:</b> {[...named, tail].filter(Boolean).join(' · ')}
    </p>
  );
}

// Longer version for the product page.
export function MrlCard({ c }) {
  const { ui } = useLang();
  const r = chinaMrl(c);
  const main = r.kind === 'value' ? `${r.mrl} mg/kg${r.basis === 'durian' ? '' : ' ' + ui('mrl.group')}`
    : r.kind === 'exempt' ? ui('mrl.exemptLong') : r.kind === 'none' ? ui('mrl.noneLong') : ui('mrl.unknownLong');
  return (
    <div className="mt-3 rounded-xl bg-paper border border-slate-200 px-3 py-2">
      <div className="text-[0.875rem] font-bold text-slate-600">{ui('mrl.china')}</div>
      <div className="text-[1rem] font-extrabold text-slate-900">{main}</div>
      {(r.kind === 'none' || r.kind === 'unknown') && <p className="text-[0.875rem] text-slate-600 leading-snug mt-0.5">{ui('mrl.default').replace('{d}', DEFAULT_MRL)}</p>}
      <p className="text-[0.8125rem] text-slate-500 leading-snug mt-1">{ui('mrl.source')}</p>
      <a className="block mt-1.5 text-[0.8125rem] underline text-[#114b2d]" href="https://www.nhc.gov.cn/sps/c100088/202602/c0c4a9266f7e43cda1bf3bec59fc2786.shtml" target="_blank" rel="noopener">{ui('mrl.official')}</a>
      <a className="block mt-1 text-[0.8125rem] underline text-[#114b2d]" href="https://mymrl.doa.gov.my/Commodities/15" target="_blank" rel="noopener">{ui('mrl.malaysia')}</a>
    </div>
  );
}
