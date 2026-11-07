import React, { useState } from 'react';
import { useLang, VALID_LANGS, LANG_LABEL } from '../i18n/useLang.jsx';
import { useCloseOnNav } from './useCloseOnNav.js';

export const APP_URL = 'https://stanleywoosweeleong.github.io/DurianIPM/';

/** QR code (generated offline, public/qr-app.svg) + WhatsApp + copy link. */
export function ShareApp() {
  const { ui } = useLang();
  const [copied, setCopied] = useState(false);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${ui('share.message')} ${APP_URL}`)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(APP_URL); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* no clipboard */ }
  };
  return (
    <div className="flex flex-col items-center text-center">
      <img src={`${import.meta.env.BASE_URL}qr-app.svg`} alt={APP_URL} width="200" height="200"
        className="w-[200px] h-[200px] rounded-xl border border-slate-200 bg-white" />
      <p className="mt-2 text-[0.9375rem] text-slate-600 leading-snug">{ui('share.scan')}</p>
      <p className="mt-0.5 text-[0.8125rem] text-slate-500 break-all">{APP_URL}</p>
      <a href={wa} target="_blank" rel="noopener"
        className="mt-3 w-full min-h-[48px] rounded-xl bg-[#25D366] text-white text-[1rem] font-extrabold flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></svg>
        {ui('share.whatsapp')}
      </a>
      <button onClick={copy} className="mt-2 w-full min-h-[44px] rounded-xl bg-paper border border-slate-300 text-[0.9375rem] font-bold text-slate-700">
        {copied ? ui('share.copied') : ui('share.copy')}
      </button>
    </div>
  );
}

/** Three big language buttons; the current one is filled. */
export function LangButtons({ onPick }) {
  const { lang, setLang, chosen } = useLang();
  return (
    <div className="w-full space-y-3">
      {VALID_LANGS.map(l => {
        const on = chosen && l === lang;
        return (
          <button key={l} lang={l === 'zh' ? 'zh-CN' : l} aria-pressed={on}
            onClick={() => { setLang(l); onPick?.(l); }}
            className={`w-full min-h-[56px] rounded-xl text-xl font-extrabold flex items-center justify-center gap-2 ${on ? 'bg-[#114b2d] text-white' : 'bg-paper border border-slate-300 text-slate-900'}`}>
            {on && <span aria-hidden="true">✓</span>}{LANG_LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}

/** Bottom sheet opened from the header language button: language + share. */
const SIZES = [{ v: 1, px: 15, key: 'normal' }, { v: 1.2, px: 20, key: 'large' }, { v: 1.4, px: 25, key: 'xl' }];

/** Text size: three big buttons; the change shows at once, the sheet stays open. */
export function SizeButtons({ scale, setScale }) {
  const { ui } = useLang();
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label={ui('app.textSize')}>
      {SIZES.map(s => {
        const on = scale === s.v;
        return (
          <button key={s.v} onClick={() => setScale(s.v)} aria-pressed={on}
            className={`min-h-[64px] rounded-xl flex flex-col items-center justify-center gap-0.5 ${on ? 'bg-[#114b2d] text-white' : 'bg-paper border border-slate-300 text-slate-800'}`}>
            <span className="font-extrabold leading-none" style={{ fontSize: s.px }}>A</span>
            <span className="text-[0.8125rem] font-bold leading-tight">{ui(`size.${s.key}`)}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Products to show — the farmer's usual choice; changing it clears per-pest changes. */
export function TrackButtons({ orchard, setOrchard }) {
  const { ui } = useLang();
  const cur = orchard.track === 'organic' ? 'organic' : 'all';
  return (
    <>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label={ui('track.title')}>
        {['all', 'organic'].map(v => (
          <button key={v} onClick={() => setOrchard({ track: v, trackBy: {} })} aria-pressed={cur === v}
            className={`min-h-[52px] rounded-xl text-[1rem] font-extrabold ${cur === v ? 'bg-[#114b2d] text-white' : 'bg-paper border border-slate-300 text-slate-800'}`}>
            {ui(`track.${v}`)}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[0.875rem] text-slate-600 leading-snug">{ui('track.hint')}</p>
    </>
  );
}

export function LangSheet({ onClose, scale, setScale, orchard, setOrchard }) {
  const { ui } = useLang();
  useCloseOnNav(onClose);
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={ui('app.language')}
        className="w-full max-w-md bg-paper rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[1.25rem] font-extrabold text-slate-900">{ui('app.language')}</h2>
          <button onClick={onClose} className="min-h-[44px] px-3 text-[0.9375rem] font-bold text-slate-600">{ui('app.close')}</button>
        </div>
        <LangButtons onPick={onClose} />
        {setScale && (
          <>
            <h2 className="mt-6 mb-3 text-[1.25rem] font-extrabold text-slate-900">{ui('app.textSize')}</h2>
            <SizeButtons scale={scale} setScale={setScale} />
          </>
        )}
        {setOrchard && (
          <>
            <h2 className="mt-6 mb-3 text-[1.25rem] font-extrabold text-slate-900">{ui('track.title')}</h2>
            <TrackButtons orchard={orchard} setOrchard={setOrchard} />
          </>
        )}
        <h2 className="mt-6 mb-3 text-[1.25rem] font-extrabold text-slate-900">{ui('share.title')}</h2>
        <ShareApp />
      </div>
    </div>
  );
}
