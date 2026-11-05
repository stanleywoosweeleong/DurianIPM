import React, { useState, useEffect, useRef } from 'react';


// Reference photos. The app NEVER searches Wikimedia at runtime: live searches
// returned a crab for shot-hole beetles, a groundnut stem for leaf blight and
// philodendron leaves for bacterial leaf spot. Only fixed, hand-checked photos
// from src/core/photos.js are shown (WikiCover), with a credit lightbox.

// ============================================================
// Lightbox modal
// ============================================================
function PhotoLightbox({ photo, lang, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!photo) return null;

  const closeLabel = lang === 'zh' ? '关闭' : 'Close';
  const sourceLabel = lang === 'zh' ? '维基共享来源页 →' : 'View on Wikimedia →';

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 backdrop-blur-sm"
        aria-label={closeLabel}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        {closeLabel}
      </button>

      <div
        className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.full}
          alt={photo.title}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />
        {/* Compact single-line attribution — CC-compliant */}
        <div className="text-xs text-slate-300 max-w-2xl text-center leading-relaxed">
          {photo.author && <span className="text-white font-medium">{photo.author}</span>}
          {photo.author && <span className="text-slate-500 mx-1.5">·</span>}
          {photo.license && (
            photo.licenseUrl ? (
              <a
                href={photo.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-200 underline"
              >
                {photo.license}
              </a>
            ) : (
              <span>{photo.license}</span>
            )
          )}
          {photo.license && <span className="text-slate-500 mx-1.5">·</span>}
          <a
            href={photo.descUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 hover:text-emerald-200 underline"
          >
            {sourceLabel}
          </a>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Cover photo — a FIXED, hand-checked photo (see src/core/photos.js), never a
// live search. Renders nothing when the group has no checked photo.
// ============================================================
const sized = (thumb, px) => (thumb ? thumb.replace(/\/\d+px-/, `/${px}px-`) : thumb);

export function WikiCover({ photo, lang = 'en', className = 'h-44' }) {
  const [open, setOpen] = useState(false);
  const [big, setBig] = useState(true);
  const [failed, setFailed] = useState(false);
  if (!photo || failed) return null; // offline before first view, or no checked photo
  const p = { ...photo, full: sized(photo.thumb, 960), descUrl: photo.desc };
  return (
    <>
      <button onClick={() => setOpen(true)} className={`relative block w-full ${className} rounded-2xl overflow-hidden bg-slate-100 border border-slate-200`} aria-label={photo.title}>
        <img src={big ? sized(photo.thumb, 500) : photo.thumb} alt={photo.title}
          onError={() => (big ? setBig(false) : setFailed(true))} className="w-full h-full object-cover" />
        <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white text-[0.6875rem] px-2.5 pt-4 pb-1.5 text-left truncate">
          {photo.author ? `${photo.author} · ` : ''}{photo.license || 'Wikimedia Commons'}
        </span>
      </button>
      {open && <PhotoLightbox photo={p} lang={lang} onClose={() => setOpen(false)} />}
    </>
  );
}
