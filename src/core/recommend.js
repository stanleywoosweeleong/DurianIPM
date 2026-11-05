// Recommendation engine: pest group + orchard context → ranked chemistry
// options (with real actives), a rotation plan, and the warnings that matter.

import { CROSS_RESISTANCE_CLUSTERS, toxSev } from './moaDb.js';
import { CHEMICALS, USABLE_ROWS, moaInfo, moaKeyFromIrac, REMOVED } from './chemDb.js';
import { CHART_FOR_GROUP } from './rotation.js';

const FIT_SCORE = { best: 3, good: 2, limited: 1 };
const chemByEn = new Map(CHEMICALS.map(c => [c.name.en, c]));
const clusterOf = (irac) => CROSS_RESISTANCE_CLUSTERS.find(c => c.groups.includes(irac));

/** Actives for one MoA class, restricted to the rotation chart for this group when we have one. */
function activesFor(group, key) {
  const chart = CHART_FOR_GROUP[group.id];
  let list;
  if (chart) {
    // Chart pests: only actives the chart lists for THIS pest, plus broad physical /
    // biological products (oils, neem, insect fungi) and non-chart actives of the class.
    const broad = (r) => (r.g === 'UN' || r.g === 'UNM' || r.g === 'UNF') && chemByEn.get(r.n)?.organic;
    const names = new Set(USABLE_ROWS.filter(r => moaKeyFromIrac(r.g) === key && (chart.includes(r.pest) || broad(r))).map(r => r.n));
    list = [...names].map(n => chemByEn.get(n)).filter(Boolean)
      .concat(CHEMICALS.filter(c => c.moa === key && c.source === 'local'));
  } else {
    list = CHEMICALS.filter(c => c.moa === key);
  }
  // gentlest first: WHO class, then bee hazard
  const beeRank = { low: 0, wet: 1, mod: 1, high: 2 };
  return list.sort((a, b) => toxSev(a.name.en) - toxSev(b.name.en) || (beeRank[a.bee] ?? 0) - (beeRank[b.bee] ?? 0));
}

/**
 * @param {object} group – entry from GROUPS
 * @param {object} ctx   – { stage?: string, recentMoa?: string[] }  (MoA class keys)
 */
export function recommend(group, ctx = {}) {
  // pestStage: what the farmer sees most — 'eggs' | 'young' | 'adults' | 'mixed' | null
  const { stage = null, recentMoa = [], track = 'all', pestStage = null } = ctx;
  const flowering = stage === 'flowering';
  const nearHarvest = stage === 'harvest';
  const recentIrac = recentMoa.filter(k => k.startsWith('IRAC ')).map(k => k.slice(5));

  const options = group.chem.map((c, index) => {
    const info = moaInfo(c.moa);
    const all = activesFor(group, c.moa);
    const actives = track === 'organic' ? all.filter(a => a.organic) : track === 'conventional' ? all.filter(a => !a.organic) : all;
    const warnings = [];
    let score = FIT_SCORE[c.fit] ?? 1;

    if (info.bee === 'high') {
      if (flowering) { score -= 2; warnings.push('beeBlock'); } else warnings.push('beeHigh');
    } else if (info.bee === 'medium' && flowering) {
      score -= 0.5; warnings.push('beeEvening');
    }
    if (nearHarvest && info.kind !== 'bio' && info.kind !== 'physical') warnings.push('phi');
    if (info.resistance === 'high') warnings.push('resistance');

    // Life stage: growth regulators and ovicides only work on some stages.
    const kills = info.stages;
    const youngOnly = kills.length > 0 && !kills.includes('adult');
    if (kills.length && pestStage) {
      if (pestStage === 'adults' && youngOnly) { score -= 2; warnings.push('noAdults'); }
      else if (pestStage === 'young' && youngOnly) { score += 0.75; warnings.push('youngBest'); }
      else if (pestStage === 'young' && !kills.includes('young')) { score -= 2; warnings.push('noYoung'); }
      else if (pestStage === 'eggs' && kills.includes('egg')) { score += 1; warnings.push('ovicide'); }
      else if (pestStage === 'mixed' && youngOnly) warnings.push('pairAdult');
    }

    const recentlyUsed = recentMoa.includes(c.moa);
    if (recentlyUsed) { score -= 1.5; warnings.push('rotate'); }
    // Cross-resistance: a different code that shares a target with what was used last.
    const irac = info.irac;
    if (!recentlyUsed && irac && recentIrac.some(r => {
      const cl = clusterOf(r); return cl && cl.groups.some(g => moaKeyFromIrac(g) === c.moa);
    })) { score -= 1; warnings.push('crossRes'); }

    return { ...c, moaInfo: info, actives, warnings, score, index, recentlyUsed };
  }).filter(o => o.actives.length > 0);

  options.sort((a, b) => b.score - a.score || a.index - b.index);

  // Rotation plan: up to 3 windows, each a different MoA, never two from the same
  // cross-resistance cluster, skipping anything blocked at this stage.
  const rotation = [];
  const usedClusters = new Set();
  for (const o of options) {
    if (rotation.length >= 3) break;
    if (o.warnings.includes('beeBlock') || o.recentlyUsed) continue;
    if (rotation.some(r => r.moa === o.moa)) continue;
    const cl = o.moaInfo.irac && clusterOf(o.moaInfo.irac === '10' ? '10A' : o.moaInfo.irac);
    if (cl && usedClusters.has(cl)) continue;
    if (cl) usedClusters.add(cl);
    rotation.push(o);
  }

  const avoid = (group.avoid || []).map(a => ({ ...a, moaInfo: moaInfo(a.moa) }));
  return { options, rotation, avoid };
}

/** Pest groups whose recommendations include this MoA class (for the chemical page). */
export function groupsForMoa(groups, key) {
  return groups.filter(g => g.chem.some(c => c.moa === key));
}

/** Removed (banned) actives that were used against this group — search notices only. */
export const removedForGroup = (gid) => REMOVED.filter(r => (r.groups || []).includes(gid));

/**
 * Alternating programme — the approach this app teaches: one round of a
 * conventional chemical, then one round of an organic / biological product,
 * and so on. Cuts chemical load and residues roughly in half, the organic
 * rounds add no resistance pressure, and natural enemies recover in between.
 *
 * Rules: start with a conventional knock-down; never repeat a MoA class;
 * never put two classes from the same cross-resistance cluster in the plan;
 * skip anything blocked at this crop stage or used last time.
 * Falls back to whatever is available when one side has no options.
 *
 * @returns {{ round: number, kind: 'conventional'|'organic', option: object }[]}
 */
export function alternatingPlan(group, ctx = {}, rounds = 4) {
  const usable = (track) => recommend(group, { ...ctx, track }).options
    .filter(o => !o.warnings.includes('beeBlock') && !o.recentlyUsed && !o.warnings.includes('noAdults') && !o.warnings.includes('noYoung'));
  const pools = { conventional: usable('conventional'), organic: usable('organic') };
  const usedMoa = new Set();
  const usedClusters = new Set();
  const clusterKey = (o) => {
    const irac = o.moaInfo.irac;
    return irac ? clusterOf(irac === '10' ? '10A' : irac) : null;
  };
  const take = (kind) => {
    const pick = pools[kind].find(o => !usedMoa.has(o.moa) && !(clusterKey(o) && usedClusters.has(clusterKey(o))));
    if (!pick) return null;
    usedMoa.add(pick.moa);
    if (clusterKey(pick)) usedClusters.add(clusterKey(pick));
    return pick;
  };
  const plan = [];
  for (let i = 0; i < rounds; i++) {
    const want = i % 2 === 0 ? 'conventional' : 'organic';
    const other = want === 'conventional' ? 'organic' : 'conventional';
    const o = take(want) || take(other);
    if (!o) break;
    plan.push({ round: i + 1, kind: o.actives.every(a => a.organic) ? 'organic' : 'conventional', option: o });
  }
  return plan;
}
