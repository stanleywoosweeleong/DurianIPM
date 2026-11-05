import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Repo path: https://<user>.github.io/DurianIPM/
// If renamed later, set base via env: BASE=/new-name/ npm run build
const base = process.env.BASE || '/DurianIPM/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Durian IPM · 榴莲综合防治',
        short_name: 'Durian IPM',
        description:
          '榴莲综合防治 — 按取食方式诊断、轮替用药、查农药是否违禁。Durian IPM: diagnose by how pests feed, rotate by MoA, check chemicals.',
        theme_color: '#059669',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Reference photos: keep every Wikimedia image the farmer has seen, so
        // they still show in the orchard with no signal.
        runtimeCaching: [{
          urlPattern: /^https:\/\/upload\.wikimedia\.org\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'wikimedia-photos',
            expiration: { maxEntries: 500, maxAgeSeconds: 60 * 24 * 60 * 60 },
            cacheableResponse: { statuses: [0, 200] },
          },
        }],
      }
    })
  ]
});
