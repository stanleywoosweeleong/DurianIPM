// Leaf-curl diagnostic drawings, carried over from the original AgriPro DIPM app.
import React from 'react';
import { toMs } from '../i18n/ms.js';

// lang: 'en' | 'zh' — labels inside the drawing follow the app language.
export const LeafCurlArt = ({ id, alt, lang = 'en', className = 'h-32' }) => {
  const L = (en, zh) => (lang === 'zh' ? zh : lang === 'ms' ? toMs(en) : en);
  if (id === 'downward_curl') {
    return (
      <div className={`relative w-full ${className} rounded-lg bg-gradient-to-b from-slate-50 to-white overflow-hidden`}>
        <svg viewBox="0 0 680 240" className="w-full h-full" role="img" aria-label={alt} xmlns="http://www.w3.org/2000/svg">
          <title>Downward leaf curl diagnostic</title>
          {/* Upper leaf surface (convex green) */}
          <path d="M 100 90 Q 340 20, 580 90 Q 575 105, 570 112 Q 340 48, 110 112 Q 105 105, 100 90 Z"
                fill="#639922" stroke="#3B6D11" strokeWidth="1"/>
          {/* Underside (concave, where pests hide) */}
          <path d="M 110 112 Q 340 48, 570 112 L 540 180 Q 340 110, 140 180 L 110 112 Z"
                fill="#97C459" stroke="#3B6D11" strokeWidth="0.5" opacity="0.95"/>
          {/* Curling edges */}
          <path d="M 100 90 Q 95 160, 140 180" fill="none" stroke="#3B6D11" strokeWidth="1.2"/>
          <path d="M 580 90 Q 585 160, 540 180" fill="none" stroke="#3B6D11" strokeWidth="1.2"/>
          {/* Midrib */}
          <path d="M 110 112 Q 340 48, 570 112" fill="none" stroke="#27500A" strokeWidth="1.5" opacity="0.6"/>
          {/* Lateral veins */}
          <path d="M 200 105 Q 240 135, 260 175" fill="none" stroke="#27500A" strokeWidth="0.5" opacity="0.4"/>
          <path d="M 280 90 Q 300 125, 310 170" fill="none" stroke="#27500A" strokeWidth="0.5" opacity="0.4"/>
          <path d="M 400 90 Q 380 125, 370 170" fill="none" stroke="#27500A" strokeWidth="0.5" opacity="0.4"/>
          <path d="M 480 105 Q 440 135, 420 175" fill="none" stroke="#27500A" strokeWidth="0.5" opacity="0.4"/>
          {/* Pest dots clustered along the underside */}
          <g fill="#4A1B0C" opacity="0.85">
            <circle cx="220" cy="155" r="3"/><circle cx="235" cy="160" r="2.5"/>
            <circle cx="250" cy="165" r="3"/><circle cx="265" cy="160" r="2"/>
            <circle cx="290" cy="155" r="3"/><circle cx="310" cy="160" r="2.5"/>
            <circle cx="340" cy="155" r="3.5"/><circle cx="370" cy="160" r="2.5"/>
            <circle cx="395" cy="155" r="3"/><circle cx="420" cy="160" r="2"/>
            <circle cx="440" cy="165" r="3"/><circle cx="460" cy="160" r="2.5"/>
          </g>
          {/* Downward curl arrows */}
          <path d="M 100 50 Q 105 35, 130 45" fill="none" stroke="#D85A30" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="125,40 138,46 130,53" fill="#D85A30"/>
          <path d="M 580 50 Q 575 35, 550 45" fill="none" stroke="#D85A30" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="555,40 542,46 550,53" fill="#D85A30"/>
          {/* Inline annotations */}
          <text x="60" y="65" fontFamily="sans-serif" fontSize="11" fill="#27500A" fontWeight="600">{L('Upper', '上表面')}</text>
          <text x="60" y="78" fontFamily="sans-serif" fontSize="9" fill="#3B6D11" opacity="0.8">{L('(convex)', '（凸起）')}</text>
          <text x="540" y="205" fontFamily="sans-serif" fontSize="11" fill="#4A1B0C" fontWeight="600">{L('Pests', '害虫')}</text>
          <text x="540" y="218" fontFamily="sans-serif" fontSize="9" fill="#993C1D">{L('on underside', '在叶背')}</text>
        </svg>
      </div>
    );
  }

  if (id === 'upward_curl') {
    return (
      <div className={`relative w-full ${className} rounded-lg bg-gradient-to-b from-slate-50 to-white overflow-hidden`}>
        <svg viewBox="0 0 680 240" className="w-full h-full" role="img" aria-label={alt} xmlns="http://www.w3.org/2000/svg">
          <title>Upward leaf curl diagnostic</title>
          {/* Healthy green center (concave, cupped up) */}
          <path d="M 140 110 Q 340 160, 540 110 L 545 140 Q 340 190, 135 140 L 140 110 Z"
                fill="#639922" stroke="#3B6D11" strokeWidth="1"/>
          {/* Left crispy dead edge curling up */}
          <path d="M 60 50 Q 100 30, 140 60 L 140 110 Q 100 105, 60 90 L 60 50 Z"
                fill="#854F0B" stroke="#633806" strokeWidth="0.5"/>
          <path d="M 70 55 Q 90 52, 110 60" fill="none" stroke="#412402" strokeWidth="0.6" opacity="0.7"/>
          <path d="M 65 70 Q 95 68, 125 78" fill="none" stroke="#412402" strokeWidth="0.6" opacity="0.7"/>
          <path d="M 68 85 Q 100 84, 130 98" fill="none" stroke="#412402" strokeWidth="0.6" opacity="0.5"/>
          <path d="M 60 50 L 55 45 L 62 42 L 58 36 L 66 38 L 64 30" fill="none" stroke="#633806" strokeWidth="0.8"/>
          {/* Right crispy dead edge curling up */}
          <path d="M 620 50 Q 580 30, 540 60 L 540 110 Q 580 105, 620 90 L 620 50 Z"
                fill="#854F0B" stroke="#633806" strokeWidth="0.5"/>
          <path d="M 610 55 Q 590 52, 570 60" fill="none" stroke="#412402" strokeWidth="0.6" opacity="0.7"/>
          <path d="M 615 70 Q 585 68, 555 78" fill="none" stroke="#412402" strokeWidth="0.6" opacity="0.7"/>
          <path d="M 612 85 Q 580 84, 550 98" fill="none" stroke="#412402" strokeWidth="0.6" opacity="0.5"/>
          <path d="M 620 50 L 625 45 L 618 42 L 622 36 L 614 38 L 616 30" fill="none" stroke="#633806" strokeWidth="0.8"/>
          {/* Transition (yellow-brown) zones */}
          <path d="M 140 60 L 140 110 L 135 140 Q 142 125, 142 90 L 140 60 Z" fill="#BA7517" opacity="0.5"/>
          <path d="M 540 60 L 540 110 L 545 140 Q 538 125, 538 90 L 540 60 Z" fill="#BA7517" opacity="0.5"/>
          {/* Bright green midrib */}
          <path d="M 140 135 Q 340 175, 540 135" fill="none" stroke="#173404" strokeWidth="2.5"/>
          <path d="M 140 135 Q 340 175, 540 135" fill="none" stroke="#639922" strokeWidth="1.5"/>
          {/* Lateral veins */}
          <path d="M 220 125 Q 240 145, 250 160" fill="none" stroke="#27500A" strokeWidth="0.5" opacity="0.5"/>
          <path d="M 290 130 Q 305 150, 310 165" fill="none" stroke="#27500A" strokeWidth="0.5" opacity="0.5"/>
          <path d="M 390 130 Q 375 150, 370 165" fill="none" stroke="#27500A" strokeWidth="0.5" opacity="0.5"/>
          <path d="M 460 125 Q 440 145, 430 160" fill="none" stroke="#27500A" strokeWidth="0.5" opacity="0.5"/>
          {/* Upward curl arrows */}
          <path d="M 90 18 Q 95 5, 110 12" fill="none" stroke="#D85A30" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="105,8 117,14 110,21" fill="#D85A30"/>
          <path d="M 590 18 Q 585 5, 570 12" fill="none" stroke="#D85A30" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="575,8 563,14 570,21" fill="#D85A30"/>
          {/* Labels */}
          <text x="60" y="155" fontFamily="sans-serif" fontSize="11" fill="#633806" fontWeight="600">{L('Crispy', '焦脆')}</text>
          <text x="60" y="168" fontFamily="sans-serif" fontSize="9" fill="#854F0B">{L('brown edge', '褐色叶缘')}</text>
          <text x="555" y="155" fontFamily="sans-serif" fontSize="11" fill="#633806" fontWeight="600">{L('Crispy', '焦脆')}</text>
          <text x="555" y="168" fontFamily="sans-serif" fontSize="9" fill="#854F0B">{L('brown edge', '褐色叶缘')}</text>
          <text x="340" y="215" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#3B6D11" fontWeight="600">{L('Center vein stays green', '中脉仍为绿色')}</text>
        </svg>
      </div>
    );
  }

  // Fallback for any other id (shouldn't happen with current usage)
  return null;
};
