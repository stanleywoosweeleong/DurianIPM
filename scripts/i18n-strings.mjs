// Collect every English string that the app can show, so Malay coverage can be
// measured and translated. Usage: node scripts/i18n-strings.mjs [out.json]
import fs from 'node:fs';
const R = new URL('../src/', import.meta.url);
const mod = async p => import(new URL(p, R));

const seen = new Set();
const add = (s) => { if (typeof s === 'string' && s.trim() && /[A-Za-z]/.test(s)) seen.add(s); };
function walk(x, depth = 0) {
  if (!x || depth > 12) return;
  if (Array.isArray(x)) { x.forEach(v => walk(v, depth + 1)); return; }
  if (typeof x !== 'object') return;
  // A bilingual leaf: {en, zh} with strings or arrays of strings.
  // Pairs that already carry their Malay ({en, zh, ms}) need no dictionary entry.
  if ('en' in x && 'zh' in x && !('ms' in x)) {
    if (typeof x.en === 'string') add(x.en);
    else if (Array.isArray(x.en)) x.en.forEach(add);
  }
  for (const [k, v] of Object.entries(x)) {
    if (k === 'url' || k === 'en' || k === 'zh' || k === 'ms') continue;
    walk(v, depth + 1);
  }
}

// Plain English-only strings shown in every language (the "Supports:" line of each source):
// these need both a Chinese and a Malay form.
export async function collectSupports() {
  const { GROUPS } = await mod('core/groups.js');
  const { LESSONS } = await mod('core/lessons.js');
  const out = new Set();
  const visit = (x) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(visit);
    if (typeof x.supports === 'string' && x.supports.trim()) out.add(x.supports); Object.values(x).forEach(visit); };
  visit(GROUPS); visit(LESSONS);
  return [...out];
}

export async function collect() {
  const { UI_STRINGS } = await mod('i18n/ui.js');
  const { GROUPS, FEEDING, STAGE_TERMS } = await mod('core/groups.js');
  const { LESSONS } = await mod('core/lessons.js');
  const D = await mod('core/diagnosis.js');
  const { SPRAY_WHERE } = await mod('core/sprayWhere.js');
  const { RELATED } = await mod('core/related.js');
  const ST = await mod('core/stages.js');
  const M = await mod('core/moa.js');
  const C = await mod('core/chemDb.js');
  const DB = await mod('core/moaDb.js');
  const { ALL_PESTS } = await mod('data/pests.js');
  const EX = await mod('core/examples.js');
  walk(UI_STRINGS); walk(GROUPS); walk(FEEDING); walk(STAGE_TERMS); walk(LESSONS);
  walk(D); walk(SPRAY_WHERE); walk(RELATED); walk(ST); walk(M); walk(C.CAUTION_TEXT); walk(C.REMOVED);
  for (const c of C.CHEMICALS) { walk(c.name); walk(c.notes); walk(c.hhpNote); }
  // Language maps keyed by lang: translate the English side.
  walk(DB.EU_BANNED); walk(C.ORGANIC_NOTE);
  for (const key of ['MOA_LABELS', 'GROUP_NAMES', 'TOX_LABEL', 'BEE_LABEL', 'BENEFICIAL_LABEL', 'FUNGUS_LABEL', 'ENV_LABEL', 'GROUP_MOA', 'GROUP_CROSS_RESISTANCE']) {
    const m = DB[key]; if (!m) continue; if (m.en) Object.values(m.en).forEach(v => typeof v === 'string' ? add(v) : walk(v)); else walk(m);
  }
  (DB.CHART_PESTS || []).forEach(p => add(p.en));
  (DB.MIX_SEQUENCE || []).forEach(p => add(p.en));
  // Old-catalogue examples shown on pest pages.
  const shown = EX.MAPPED_IDS;
  for (const p of ALL_PESTS) if (shown.has(p.id)) { walk(p.common); walk(p.symptoms); }
  for (const r of C.REMOVED) add(r.basisEn);
  // Strings written inline in components: s('en','zh'), L('en','zh'), { en: '…', zh: '…' }.
  const dirs = ['components', 'ui', 'screens'];
  const files = dirs.flatMap(d => fs.readdirSync(new URL(d + '/', R)).filter(n => /\.jsx?$/.test(n)).map(n => new URL(d + '/' + n, R)));
  files.push(new URL('main.jsx', R));
  const str = "'((?:[^'\\\\]|\\\\.)*)'";
  const pats = [new RegExp('\\b(?:s|L)\\(' + str + ',\\s*' + str + '\\)', 'g'), new RegExp('\\ben:\\s*' + str + ',\\s*zh:', 'g')];
  for (const file of files) { const src = fs.readFileSync(file, 'utf8'); for (const re of pats) for (const m of src.matchAll(re)) add(m[1].replace(/\\'/g, "'")); }
  return [...seen];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const list = await collect();
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(list, null, 1));
  console.log(list.length, 'strings,', list.reduce((n, s) => n + s.length, 0), 'characters');
}
