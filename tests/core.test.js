import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GROUPS } from '../src/core/groups.js';
import { CHEMICALS, REMOVED, findRemovedActive, moaInfo, searchChemicals, HHP_EXCEPTIONS } from '../src/core/chemDb.js';
import { REMOVED_MY, CHART_ROWS, EU_BANNED, BEE_TAGS, TOX_WHO } from '../src/core/moaDb.js';
import { SIGNS, CULPRITS, PARTS, diagnose } from '../src/core/diagnosis.js';
import { recommend } from '../src/core/recommend.js';
import { rotationFor, groupsForChartPest, CHART_FOR_GROUP } from '../src/core/rotation.js';
import { MAPPED_IDS, NOT_DURIAN } from '../src/core/examples.js';
import { ALL_PESTS } from '../src/data/pests.js';
import { LESSONS } from '../src/core/lessons.js';

const groupIds = new Set(GROUPS.map(g => g.id));
const bi = (f, where) => assert.ok(f && f.en && f.zh, `missing en/zh: ${where}`);

test('every group is bilingual and never recommends what it says to avoid', () => {
  for (const g of GROUPS) {
    bi(g.name, g.id); bi(g.why, g.id); bi(g.scout, g.id);
    for (const c of g.chem) { bi(c.why, `${g.id}/${c.moa}`); bi(moaInfo(c.moa).name, c.moa); }
    for (const n of g.nonChem) bi(n, g.id);
    const avoid = new Set(g.avoid.map(a => a.moa));
    for (const c of g.chem) assert.ok(!avoid.has(c.moa), `${g.id}: ${c.moa} both recommended and avoided`);
  }
});

test('every recommended MoA class has at least one real active or Mr. Ganick product', () => {
  for (const g of GROUPS) for (const o of recommend(g).options)
    assert.ok(o.actives.length > 0 || o.ganick.length > 0, `${g.id}: ${o.moa} has no actives`);
});

test('ranking: Mr. Ganick above every Limited option; organic first among equals', () => {
  for (const g of GROUPS) for (const track of ['all', 'organic']) {
    const opts = recommend(g, { track }).options;
    opts.forEach((o, i) => {
      if (!o.ganick.length) return;
      const lowerLimited = opts.slice(0, i).filter(x => x.fit === 'limited' && !x.ganick.length);
      assert.deepEqual(lowerLimited.map(x => x.moa), [], `${g.id}/${track}: ${o.moa} (Mr. Ganick) below a Limited option`);
    });
    if (track === 'organic') for (const o of opts) {
      assert.ok(o.actives.every(a => a.organic), `${g.id}: non-organic active in organic mode`);
      assert.ok(o.ganick.every(p => p.organic !== false), `${g.id}: non-organic Mr. Ganick product in organic mode`);
    }
    // Same rating, no flowering/stage context: organic options never follow a chemical-only one.
    for (let i = 1; i < opts.length; i++) {
      const a = opts[i - 1], b = opts[i];
      const org = (o) => o.ganick.length > 0 || o.actives.some(x => x.organic);
      if (a.fit === b.fit && !a.warnings.length && !b.warnings.length) assert.ok(org(a) || !org(b), `${g.id}/${track}: ${b.moa} organic after ${a.moa}`);
    }
  }
});

test('rotation-guide invariant: nothing removed in Malaysia is browsable or recommended', () => {
  const removedNames = REMOVED.flatMap(r => r.terms);
  for (const c of CHEMICALS) {
    const n = c.name.en.toLowerCase();
    assert.ok(!removedNames.some(t => n === t || n.startsWith(t + ' ')), `${c.id} is a removed active`);
  }
  for (const r of REMOVED_MY) assert.ok(!CHART_ROWS.some(a => a.n.toLowerCase() === r.en.toLowerCase()), r.en);
});

test('banned search answers instead of "no matches"', () => {
  for (const q of ['chlorpyrifos', '毒死蜱', 'paraquat', '百草枯', 'endosulfan', 'methomyl', 'carbofuran'])
    assert.ok(findRemovedActive(q), q);
  assert.equal(findRemovedActive('spinosad'), null);
  assert.ok(searchChemicals('吡虫啉').length === 1);
});

test('lookup maps only name actives that exist', () => {
  const names = new Set(CHART_ROWS.map(c => c.n).concat(CHEMICALS.map(c => c.name.en)));
  for (const m of [EU_BANNED, BEE_TAGS, TOX_WHO]) for (const k of Object.keys(m)) assert.ok(names.has(k), k);
});

test('the merged database keeps all 69 chart actives', () => {
  assert.equal(new Set(CHART_ROWS.map(r => r.n)).size, 69);
  // 69 in the chart, minus WHO Ia/Ib exclusions (formetanate); abamectin is a documented exception
  assert.equal(CHEMICALS.filter(c => c.source === 'chart').length, 68);
});

test('diagnosis weights point at real groups', () => {
  for (const s of [...SIGNS, ...CULPRITS]) for (const gid of Object.keys(s.w)) assert.ok(groupIds.has(gid), `${s.id}: ${gid}`);
});

test('every catalogued pest is mapped to a group', () => {
  assert.deepEqual(ALL_PESTS.filter(p => !MAPPED_IDS.has(p.id) && !NOT_DURIAN[p.id]).map(p => p.id), []);
  for (const id of Object.keys(NOT_DURIAN)) assert.ok(!MAPPED_IDS.has(id), id + ' is set aside but still shown');
});

test('classic cases diagnose correctly', () => {
  const top = a => diagnose(a)[0]?.group.id;
  assert.equal(top({ signs: ['ooze'], culprits: ['nothing'] }), 'oomycete');
  assert.equal(top({ signs: ['curl-down', 'sticky'], culprits: ['soft-cluster'] }), 'phloem-suckers');
  assert.equal(top({ signs: ['stipple', 'web-fine'], culprits: ['mite-dots'] }), 'mites');
  assert.equal(top({ signs: ['fruit-frass'], culprits: ['caterpillar'] }), 'fruit-borers');
  assert.equal(top({ signs: ['white-wax', 'ant-trail'], culprits: ['waxy-fixed'] }), 'scale-mealybug');
  assert.equal(top({ signs: ['pinholes'], culprits: ['unsure'] }), 'shot-hole');
  assert.equal(top({ signs: ['silver', 'flower-drop'], culprits: ['slender'] }), 'thrips');
  assert.equal(top({ signs: ['angular'], culprits: ['nothing'] }), 'bacterial');
});

test('flowering keeps bee-toxic classes out of the rotation; no repeated cluster', () => {
  for (const g of GROUPS) {
    const r = recommend(g, { stage: 'flowering' });
    assert.ok(r.rotation.every(o => o.moaInfo.bee !== 'high'), g.id);
    assert.equal(new Set(r.rotation.map(o => o.moa)).size, r.rotation.length);
  }
});

test('oomycete advice never suggests fungicides that do not work on water moulds', () => {
  const codes = GROUPS.find(x => x.id === 'oomycete').chem.map(c => c.moa);
  assert.ok(!codes.includes('FRAC 1') && !codes.includes('FRAC 3'));
});

test('rotation helper: never suggests the same group or a shared-target sibling', () => {
  for (const pest of new Set(Object.values(CHART_FOR_GROUP).flat())) {
    for (const g of groupsForChartPest(pest)) {
      const r = rotationFor(pest, g);
      assert.ok(!r.suggested.some(s => s.g === g));
      for (const c of r.caution) assert.ok(!r.suggested.some(s => s.g === c.g));
    }
  }
  const r = rotationFor('psyllid', '4A');
  assert.ok(r.caution.some(c => c.g === '4C'));
  assert.equal(r.crossKind, 'partial');
});

test('lessons are bilingual with matching paragraph counts', () => {
  for (const l of LESSONS) { bi(l.title, l.id); assert.equal(l.body.en.length, l.body.zh.length, l.id); }
});

test('organic track shows only organic actives; conventional shows none of them', () => {
  for (const g of GROUPS) {
    for (const o of recommend(g, { track: 'organic' }).options) assert.ok(o.actives.every(a => a.organic), `${g.id}/${o.moa}`);
    for (const o of recommend(g, { track: 'conventional' }).options) assert.ok(o.actives.every(a => !a.organic), `${g.id}/${o.moa}`);
  }
  // spinetoram is NOT organic even though spinosad is
  assert.equal(CHEMICALS.find(c => c.id === 'spinetoram').organic, false);
  assert.equal(CHEMICALS.find(c => c.id === 'spinosad').organic, true);
});

test('most groups with any chemistry also have an organic option', () => {
  const missing = GROUPS.filter(g => g.chem.length && !recommend(g, { track: 'organic' }).options.length).map(g => g.id);
  assert.deepEqual(missing, ['ants-wasps']);
});

test('WHO Ia/Ib actives are never offered unless a documented exception', () => {
  const ok = (c) => !['Ia', 'Ib'].includes(c.tox) || !!HHP_EXCEPTIONS[c.name.en];
  assert.ok(CHEMICALS.every(ok));
  assert.ok(CHEMICALS.find(c => c.id === 'abamectin')?.hhpNote, 'abamectin kept with a handling note');
  assert.ok(!CHEMICALS.some(c => c.id === 'formetanate-hydrochloride'));
  for (const g of GROUPS) for (const tr of ['organic', 'conventional'])
    for (const o of recommend(g, { track: tr }).options) assert.ok(o.actives.every(ok));
  for (const pest of new Set(Object.values(CHART_FOR_GROUP).flat()))
    for (const g of groupsForChartPest(pest)) {
      const r = rotationFor(pest, g);
      for (const grp of [...r.suggested, ...r.caution]) for (const it of grp.items) assert.ok(!['Ia', 'Ib'].includes(TOX_WHO[it.n]) || HHP_EXCEPTIONS[it.n], it.n);
    }
  assert.ok(findRemovedActive('formetanate')?.hhp);
  assert.equal(findRemovedActive('abamectin'), null);
});

test('chart pests only get actives the chart lists for them (plus organic oils/neem/fungi)', () => {
  const mites = recommend(GROUPS.find(g => g.id === 'mites'), { track: 'all' });
  const ids = mites.options.flatMap(o => o.actives.map(a => a.id));
  assert.ok(!ids.includes('pyridalyl'));
  assert.ok(ids.includes('white-oil') && ids.includes('sulfur') && ids.includes('abamectin'));
});

test('life stage steers the ranking', () => {
  const sap = GROUPS.find(g => g.id === 'scale-mealybug');
  const pos = (r, moa) => r.options.findIndex(o => o.moa === moa);
  const young = recommend(sap, { pestStage: 'young' });
  const adults = recommend(sap, { pestStage: 'adults' });
  // buprofezin (IRAC 16) only kills crawlers/nymphs
  assert.ok(young.options.find(o => o.moa === 'IRAC 16').warnings.includes('youngBest'));
  assert.ok(adults.options.find(o => o.moa === 'IRAC 16').warnings.includes('noAdults'));
  assert.ok(pos(adults, 'IRAC 16') > pos(young, 'IRAC 16'));
  const mites = recommend(GROUPS.find(g => g.id === 'mites'), { pestStage: 'eggs' });
  assert.ok(mites.options.find(o => o.moa === 'IRAC 10').warnings.includes('ovicide'));
  // every insect/mite class we recommend declares which stages it kills
  for (const g of GROUPS.filter(g => g.kingdom === 'insect' || g.kingdom === 'mite'))
    for (const o of recommend(g).options.filter(o => o.moaInfo.kind !== 'fungicide')) assert.ok(o.moaInfo.stages.length, `${g.id}/${o.moa}`);
});

import { UI_STRINGS } from '../src/i18n/ui.js';
test('no banned or excluded active is named anywhere in the visible text', () => {
  // Removed actives may only appear as a search ANSWER (chemDb REMOVED), never in
  // UI strings, lessons or pest-group advice — not even as an example.
  const terms = REMOVED.flatMap(r => r.terms).filter(t => t.length >= 3);
  const texts = JSON.stringify([UI_STRINGS, LESSONS, GROUPS], (k, v) => (k === 'url' ? undefined : v)).toLowerCase(); // link addresses are not shown
  const hits = terms.filter(t => texts.includes(t.toLowerCase()));
  assert.deepEqual(hits, []);
});

import { MAIN_SIGNS, nextAfterSign } from '../src/core/diagnosis.js';
test('one-tap diagnosis: short sign lists, decisive signs skip the creature question', () => {
  for (const [part, ids] of Object.entries(MAIN_SIGNS)) {
    assert.ok(ids.length >= 5 && ids.length <= 8, part);
    for (const id of ids) assert.ok(SIGNS.some(s => s.id === id && s.parts.includes(part)), `${part}/${id}`);
  }
  for (const id of ['fruit-frass', 'slime', 'white-threads', 'galls', 'pinholes', 'mud-tubes', 'ooze']) assert.ok(nextAfterSign(id).decisive, id);
  const curl = nextAfterSign('curl-down');
  assert.ok(!curl.decisive);
  assert.ok(curl.culprits.length <= 7, `curl-down offers ${curl.culprits.length}`);
  assert.ok(curl.culprits.some(c => c.id === 'mite-dots') && curl.culprits.some(c => c.id === 'soft-cluster'));
  assert.ok(!curl.culprits.some(c => c.id === 'snail'));
  // every non-decisive sign offers a short list
  for (const s of SIGNS) { const n = nextAfterSign(s.id); if (!n.decisive) assert.ok(n.culprits.length <= 9, `${s.id}: ${n.culprits.length}`); }
});

test('common-problem shortcuts point at real pest groups', async () => {
  const src = (await import('node:fs')).readFileSync(new URL('../src/screens/Diagnose.jsx', import.meta.url), 'utf8');
  const ids = [...src.matchAll(/\['([a-z-]+)', \{ en:/g)].map(m => m[1]);
  assert.equal(ids.length, 11);
  for (const id of ids) assert.ok(groupIds.has(id), id);
});

import { PART_PESTS } from '../src/core/diagnosis.js';
test('part → pest lists: real groups, bilingual, short', () => {
  for (const p of PARTS) {
    const list = PART_PESTS[p.id];
    assert.ok(list && list.length >= 4 && list.length <= 13, p.id);
    for (const [gid, look] of list) { assert.ok(groupIds.has(gid), `${p.id}/${gid}`); bi(look, `${p.id}/${gid}`); }
  }
});

test('Rhizoctonia: own group, Rhizoctonia-active fungicides, never oomycete-only chemistry', () => {
  const g = GROUPS.find(x => x.id === 'rhizoctonia');
  assert.ok(g);
  const r = recommend(g);
  const ids = r.options.flatMap(o => o.actives.map(a => a.id));
  for (const a of ['pencycuron', 'validamycin', 'hexaconazole']) assert.ok(ids.includes(a), a);
  assert.ok(!r.options.some(o => ['FRAC 4', 'FRAC P07', 'FRAC 40', 'FRAC 21'].includes(o.moa)));
  assert.equal(diagnose({ signs: ['web-blight'], culprits: [] })[0].group.id, 'rhizoctonia');
});

test('no runtime photo search anywhere (only fixed, checked photos)', async () => {
  const fs = await import('node:fs');
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]);
  const files = walk(new URL('../src', import.meta.url).pathname).filter(f => /\.(js|jsx)$/.test(f));
  const hits = files.filter(f => /commons\.wikimedia\.org\/w\/api\.php|gsrsearch/.test(fs.readFileSync(f, 'utf8')));
  assert.deepEqual(hits, []);
});

test('exact product lists: every id exists and belongs to the class it is listed under', () => {
  for (const g of GROUPS) for (const c of g.chem) for (const id of c.only || []) {
    const chem = CHEMICALS.find(x => x.id === id);
    assert.ok(chem, `${g.id}/${c.moa}: unknown active ${id}`);
    assert.equal(chem.moa, c.moa, `${g.id}: ${id} is ${chem.moa}, listed under ${c.moa}`);
  }
});

test('review fixes: no caterpillar-only diamides for bugs, spinosad bait for fruit flies, fipronil-only ant bait', () => {
  const ids = (gid) => recommend(GROUPS.find(g => g.id === gid)).options.flatMap(o => o.actives.map(a => a.id));
  assert.ok(!ids('plant-bugs').includes('chlorantraniliprole') && !ids('plant-bugs').includes('flubendiamide'));
  assert.deepEqual(ids('fruit-flies'), ['spinosad']);
  assert.ok(!ids('ants-wasps').includes('ethiprole'));
  assert.ok(!ids('soil-pests').includes('flubendiamide'));
  const anth = recommend(GROUPS.find(g => g.id === 'leaf-spots')).options;
  assert.equal(anth.find(o => o.moa === 'FRAC 3').actives[0].id, 'difenoconazole');
  // every group name reads correctly under every part it appears in
  const names = Object.fromEntries(GROUPS.map(g => [g.id, g.name.en]));
  for (const [part, list] of Object.entries(PART_PESTS)) for (const [gid] of list) {
    if (part !== 'leaf') assert.ok(!/^Leaf[ -]/.test(names[gid]) || /leaves &/i.test(names[gid]), `"${names[gid]}" listed under ${part}`);
  }
});

test('flowering blocks every option that shows a highly bee-toxic active', () => {
  for (const g of GROUPS) {
    const r = recommend(g, { stage: 'flowering', track: 'all' });
    for (const o of r.options) {
      if (o.actives.some(a => a.bee === 'high')) {
        assert.ok(o.warnings.includes('beeBlock'), `${g.id} ${o.moa} shows a high-bee active but is not blocked`);
        assert.ok(!r.rotation.includes(o), `${g.id} ${o.moa} is bee-blocked but in the rotation`);
      }
    }
  }
});

import { RELATED } from '../src/core/related.js';
test('related links point at real groups, both ways, bilingual', () => {
  for (const [from, list] of Object.entries(RELATED)) {
    assert.ok(groupIds.has(from), from);
    for (const [to, why] of list) {
      assert.ok(groupIds.has(to), to); assert.ok(why.en && why.zh, from + '>' + to);
      assert.ok((RELATED[to] || []).some(([back]) => back === from), to + ' does not link back to ' + from);
    }
  }
});

import { CHINA_DURIAN_BY_NAME, CHINA_DURIAN_BY_ID, CHINA_EXEMPT, chinaMrl } from '../src/core/mrl.js';
test('China MRL data: numeric limits, durian-covering basis only, exempt ids exist', () => {
  for (const v of [...Object.values(CHINA_DURIAN_BY_NAME), ...Object.values(CHINA_DURIAN_BY_ID)]) {
    assert.ok(!Number.isNaN(parseFloat(v.mrl)), v.mrl);
    assert.ok(['durian', 'spiny', 'inedible', 'tropical', 'fruit'].includes(v.basis), v.basis);
  }
  const ids = new Set(CHEMICALS.map(c => c.id));
  for (const id of CHINA_EXEMPT) assert.ok(ids.has(id) || id === 'purpureocillium', id);
  const cyper = CHEMICALS.find(c => c.id === 'cypermethrin');
  assert.equal(chinaMrl(cyper).kind, 'value');
});

test('whole-tree wilt with nothing else seen stays low-confidence', () => {
  for (const culprits of [[], ['nothing'], ['unsure']]) {
    const results = diagnose({ signs: ['tree-wilt'], culprits });
    assert.ok(results.every(r => r.confidence === 'low'), JSON.stringify(culprits));
  }
});

test('Phytophthora options are not turned into a spray rotation (different tree parts)', () => {
  const r = recommend(GROUPS.find(g => g.id === 'oomycete'), {});
  assert.equal(r.rotationWithheld, 'site-specific');
  assert.deepEqual(r.rotation, []);
  assert.ok(recommend(GROUPS.find(g => g.id === 'fruit-borers'), {}).rotation.length > 1);
});

test('alternation lesson stays, without the unsupported claims', () => {
  const l = LESSONS.find(x => x.id === 'alternate');
  assert.ok(l && /organic/i.test(l.title.en));
  const text = JSON.stringify(l).toLowerCase();
  assert.ok(!text.includes('in half') && !text.includes('5–7 days later'));
});
