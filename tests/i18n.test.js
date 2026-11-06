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

import { GLOSSARY, glossSplit } from '../src/core/glossary.js';
test('Words to know: every term explained in three languages, used in the app, no banned names', async () => {
  const en = await collect();
  const terms = REMOVED.flatMap(r => r.terms).filter(t => t.length >= 3).map(t => t.toLowerCase());
  const used = new Set();
  for (const s of en) for (const p of glossSplit(s, 'en')) if (typeof p === 'object') used.add(p.id);
  for (const e of GLOSSARY) {
    for (const l of ['en', 'zh', 'ms']) { assert.ok(e.word[l]?.trim(), `${e.id} word.${l}`); assert.ok(e.means[l]?.trim(), `${e.id} means.${l}`); }
    assert.ok(used.has(e.id), `${e.id} never appears in the app's English text`);
    const all = JSON.stringify([e.word, e.means]).toLowerCase();
    for (const t of terms) assert.ok(!all.includes(t), `${e.id} names ${t}`);
  }
  // Longest term wins and only the first use is marked.
  assert.deepEqual(glossSplit('cross-resistance and resistance, resistance', 'en').filter(p => typeof p === 'object').map(p => p.id), ['cross', 'resistance']);
  assert.deepEqual(glossSplit('skin contact', 'en'), ['skin contact']);
});
