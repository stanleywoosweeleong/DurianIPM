import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { collect } from '../scripts/i18n-strings.mjs';
import { REMOVED } from '../src/core/chemDb.js';

const MS = JSON.parse(fs.readFileSync(new URL('../src/i18n/ms.json', import.meta.url), 'utf8'));

test('every English string the app can show has a Malay form', async () => {
  const missing = (await collect()).filter(s => !MS[s]);
  // New text needs a Malay line: add it to src/i18n/ms.json, or write it as s3(en, zh, ms).
  assert.deepEqual(missing, []);
});

test('Malay keeps codes and numbers, and names no banned active the English does not', () => {
  const terms = REMOVED.flatMap(r => r.terms).filter(t => t.length >= 3).map(t => t.toLowerCase());
  for (const [en, ms] of Object.entries(MS)) {
    assert.ok(ms.trim(), en);
    for (const code of en.match(/\b(?:IRAC|FRAC|WHO|U)\s?\d+[A-Z]?\b/g) || []) assert.ok(ms.includes(code.split(/\s/).pop()), `${code} lost in: ${ms}`);
    for (const t of terms) if (ms.toLowerCase().includes(t)) assert.ok(en.toLowerCase().includes(t), `${t} added in: ${ms}`);
  }
});
