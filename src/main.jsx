import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { registerSW } from 'virtual:pwa-register';

const T = {
  update: { zh: '有新版本', en: 'New version available', ms: 'Versi baharu tersedia' },
  updateSub: { zh: '内容已更新，点一下就能用上。', en: 'The advice has been updated. Tap to load it.', ms: 'Nasihat telah dikemas kini. Ketik untuk memuatkannya.' },
  now: { zh: '更新', en: 'Update', ms: 'Kemas kini' },
  later: { zh: '稍后', en: 'Later', ms: 'Nanti' },
  updating: { zh: '更新中…', en: 'Updating…', ms: 'Mengemas kini…' },
  offline: { zh: '已可离线使用——果园没信号也能打开。', en: 'Ready offline — opens even with no signal in the orchard.', ms: 'Sedia tanpa internet — boleh dibuka walaupun tiada isyarat di kebun.' },
};
const tr = (k) => { const l = document.documentElement.lang; return l.startsWith('zh') ? T[k].zh : l.startsWith('ms') ? T[k].ms : T[k].en; };

/**
 * Update toast. The new service worker waits (registerType: 'prompt') until the
 * farmer taps Update, so nothing reloads in the middle of a diagnosis. Checks for
 * updates on launch, whenever the app returns to the foreground, and hourly.
 */
function PWAUpdateToast() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateSW, setUpdateSW] = useState(() => () => {});
  const [busy, setBusy] = useState(false);
  const regRef = useRef(null);
  // Follow the app's language: re-render when <html lang> changes.
  const [, setHtmlLang] = useState(document.documentElement.lang);
  useEffect(() => {
    const mo = new MutationObserver(() => setHtmlLang(document.documentElement.lang));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    let timer;
    const update = registerSW({
      immediate: true,
      onNeedRefresh() { setNeedRefresh(true); },
      onOfflineReady() {
        // Not on the first-launch language screen: the farmer has not picked a language yet.
        let picked = true; try { picked = !!localStorage.getItem('durianipm_lang'); } catch { /* ignore */ }
        if (picked) setOfflineReady(true);
      },
      onRegisteredSW(_url, reg) {
        if (!reg) return;
        regRef.current = reg;
        const check = () => { if (navigator.onLine) reg.update().catch(() => {}); };
        timer = setInterval(check, 60 * 60 * 1000);
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
      },
    });
    setUpdateSW(() => update);
    return () => clearInterval(timer);
  }, []);

  // The "ready offline" note is brief and goes away on its own.
  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(t);
  }, [offlineReady]);

  // Update: tell the waiting version to take over, then reload. iPhone home-screen
  // apps do not always report the takeover, so reload anyway after a moment —
  // the button must never just sit there.
  const applyUpdate = () => {
    if (busy) return;
    setBusy(true);
    let done = false;
    const reload = () => { if (!done) { done = true; window.location.reload(); } };
    navigator.serviceWorker?.addEventListener('controllerchange', reload);
    try { regRef.current?.waiting?.postMessage({ type: 'SKIP_WAITING' }); } catch { /* ignore */ }
    Promise.resolve(updateSW(true)).catch(() => {});
    setTimeout(reload, 2500);
  };

  if (!needRefresh && !offlineReady) return null;

  return (
    <div role="status" aria-live="polite"
      className="fixed inset-x-0 z-[200] flex justify-center px-3 pointer-events-none"
      style={{ bottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
      <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-[#114b2d] text-white shadow-2xl px-4 py-3 flex items-center gap-3">
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {needRefresh
            ? <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>
            : <path d="M20 6 9 17l-5-5" />}
        </svg>
        <div className="flex-1 min-w-0">
          {needRefresh ? (
            <>
              <div className="font-extrabold text-[15px] leading-tight">{tr('update')}</div>
              <div className="text-[13px] text-emerald-100 leading-snug">{tr('updateSub')}</div>
            </>
          ) : (
            <div className="text-[14px] leading-snug">{tr('offline')}</div>
          )}
        </div>
        {needRefresh && (
          <>
            <button onClick={() => setNeedRefresh(false)} className="min-h-[44px] px-2 text-[14px] font-bold text-emerald-100">{tr('later')}</button>
            <button onClick={applyUpdate} disabled={busy} className="min-h-[44px] px-4 rounded-xl bg-white text-[#114b2d] text-[15px] font-extrabold disabled:opacity-80">{busy ? tr('updating') : tr('now')}</button>
          </>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <PWAUpdateToast />
  </React.StrictMode>
);
