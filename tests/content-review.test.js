import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chinaMrl } from '../src/core/mrl.js';
import { CHEMICALS } from '../src/core/chemDb.js';
import { GROUPS } from '../src/core/groups.js';
import { diagnose } from '../src/core/diagnosis.js';
import { recommend } from '../src/core/recommend.js';

test('MRL lookup distinguishes recorded value, exemption, checked absence and unchecked active', () => {
  const active = id => CHEMICALS.find(c => c.id === id);
  assert.deepEqual(chinaMrl(active('cypermethrin')), { kind: 'value', mrl: '1', basis: 'durian' });
  assert.deepEqual(chinaMrl(active('bacillus-thuringiensis')), { kind: 'exempt' });
  assert.deepEqual(chinaMrl(active('chlorantraniliprole')), { kind: 'none' });
  assert.deepEqual(chinaMrl(active('phosphonate')), { kind: 'unknown' });
  assert.deepEqual(chinaMrl({ id: 'new-active', name: { en: 'Unreviewed active' } }), { kind: 'unknown' });
});

test('whole-tree wilt without a visible culprit stays low-confidence', () => {
  for (const culprits of [[], ['nothing'], ['unsure']]) {
    const results = diagnose({ signs: ['tree-wilt'], culprits });
    assert.ok(results.length > 1);
    assert.ok(results.every(r => r.confidence === 'low'));
  }
  // More specific pest evidence still participates in identification.
  assert.equal(diagnose({ signs: ['tree-wilt'], culprits: ['termites'] })[0].group.id, 'soil-pests');
});

test('mixed-site oomycete options remain readable but cannot become an automatic rotation', () => {
  const g = GROUPS.find(g => g.id === 'oomycete');
  for (const stage of [null, 'flowering', 'harvest']) {
    for (const track of ['all', 'organic', 'conventional']) {
      for (const recentMoa of [[], ['FRAC P07'], ['FRAC 4']]) {
        const r = recommend(g, { stage, track, recentMoa });
        assert.ok(r.options.length > 0);
        assert.equal(r.rotationWithheld, 'site-specific');
        assert.deepEqual(r.rotation, []);
      }
    }
  }
  const other = recommend(GROUPS.find(g => g.id === 'fruit-borers'));
  assert.ok(other.rotation.length > 1);
  assert.equal(other.rotationWithheld, null);
});
