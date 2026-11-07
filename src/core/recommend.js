// Recommendation engine: pest group + orchard context → ranked chemistry
// options (with real actives), a rotation plan, and the warnings that matter.

import { CROSS_RESISTANCE_CLUSTERS, toxSev } from './moaDb.js';
import { CHEMICALS, USABLE_ROWS, moaInfo, moaKeyFromIrac, REMOVED } from './chemDb.js';
import { CHART_FOR_GROUP } from './rotation.js';
import { ganickFor } from './ganick.js';

const FIT_SCORE = { best: 3, good: 2, limited: 1 };
// An option holding a Mr. Ganick product made for this pest ranks above every
// "Limited" option (owner's rule): organic products are hard to find in Malaysia and
// this range does the job. Among options with the same rating, ones with a Mr. Ganick
// product come first, then ones with an organic product, then the rest.
const GANICK_FLOOR = 1.5;
const TIE_GANICK = 0.1;
const TIE_ORGANIC = 0.05;
const chemByEn = new Map(CHEMICALS.map(c => [c.name.en, c]));
const clusterOf = (irac) => CROSS_RESISTANCE_CLUSTERS.find(c => c.groups.includes(irac));

/** Actives for one MoA class, restricted to the rotation chart for this group when we have one. */
function activesFor(group, key, only) {
  // `only`: exact active ids for this pest, in display order. A class can hold
  // members that do not work on every pest (e.g. most diamides only kill caterpillars).
  if (only) return only.map(id => CHEMICALS.find(c => c.id === id)).filter(Boolean);
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
const SITE_SPECIFIC = new Set(['oomycete']);

export function recommend(group, ctx = {}) {
  // pestStage: what the farmer sees most — 'eggs' | 'young' | 'adults' | 'mixed' | null
  const { stage = null, recentMoa = [], track = 'all', pestStage = null } = ctx;
  const flowering = stage === 'flowering';
  const nearHarvest = stage === 'harvest';
  const recentIrac = recentMoa.filter(k => k.startsWith('IRAC ')).map(k => k.slice(5));

  // Mr. Ganick products sit in the option for their way of working; when the pest page
  // has no such option, it gets its own, marked as the manufacturer's use (no evidence rating).
  // A product sold for this pest is never shown under a "Limited" rating: when its option is
  // rated Limited (or the page has no such option), it gets its own "Mr. Ganick" option with no rating badge,
  // ranked above every Limited option. The generic option keeps its real evidence rating.
  const ganick = ganickFor(group.id).filter(p => track === 'organic' ? p.organic !== false : track !== 'conventional');
  const inside = (p) => group.chem.some(c => c.moa === p.moa && c.fit !== 'limited');
  const extra = [...new Set(ganick.filter(p => !inside(p)).map(p => p.moa))]
    .map(moa => ({ moa, fit: 'maker', why: null, only: [], key: `${moa}:maker` }));

  const options = [...group.chem, ...extra].map((c, index) => {
    const info = moaInfo(c.moa);
    const maker = c.fit === 'maker';
    const all = maker ? [] : activesFor(group, c.moa, c.only);
    const actives = track === 'organic' ? all.filter(a => a.organic) : track === 'conventional' ? all.filter(a => !a.organic) : all;
    const brand = ganick.filter(p => p.moa === c.moa && (maker ? !inside(p) : inside(p)));
    const warnings = [];
    let score = FIT_SCORE[c.fit] ?? 1;
    if (brand.length && score < GANICK_FLOOR) score = GANICK_FLOOR;
    if (brand.length) score += TIE_GANICK;
    else if (actives.some(a => a.organic)) score += TIE_ORGANIC;

    const activeBee = actives.some(a => a.bee === 'high') ? 'high' : actives.some(a => a.bee === 'mod' || a.bee === 'wet') ? 'medium' : null;
    const bee = activeBee === 'high' || info.bee === 'high' ? 'high' : (activeBee || info.bee);
    if (bee === 'high') {
      if (flowering) { score -= 2; warnings.push('beeBlock'); } else warnings.push('beeHigh');
    } else if (bee === 'medium' && flowering) {
      score -= 0.5; warnings.push('beeEvening');
    }
    if (flowering && actives.some(a => a.id === 'copper')) { score -= 1; warnings.push('copperFlower'); }
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

    return { ...c, key: c.key || c.moa, moaInfo: info, actives, ganick: brand, warnings, score, index, recentlyUsed };
  }).filter(o => o.actives.length > 0 || o.ganick.length > 0);

  options.sort((a, b) => b.score - a.score || a.index - b.index);

  // Rotation plan: up to 3 windows, each a different MoA, never two from the same
  // cross-resistance cluster, skipping anything blocked at this stage.
  const rotation = [];
  const usedClusters = new Set();
  // Some groups' options are applied to different parts of the tree (injection, trunk paint, soil
  // drench) — they are not a spray sequence, so no automatic rotation is offered.
  const siteSpecific = SITE_SPECIFIC.has(group.id);
  for (const o of siteSpecific ? [] : options) {
    if (rotation.length >= 3) break;
    // Skip what is blocked now: bee-toxic at flowering, just used, or no use on the life stage the farmer sees.
    if (o.warnings.some(w => w === 'beeBlock' || w === 'noAdults' || w === 'noYoung') || o.recentlyUsed) continue;
    if (rotation.some(r => r.moa === o.moa)) continue;
    const cl = o.moaInfo.irac && clusterOf(o.moaInfo.irac === '10' ? '10A' : o.moaInfo.irac);
    if (cl && usedClusters.has(cl)) continue;
    if (cl) usedClusters.add(cl);
    rotation.push(o);
  }

  const avoid = (group.avoid || []).map(a => ({ ...a, moaInfo: moaInfo(a.moa) }));
  return { options, rotation, avoid, rotationWithheld: siteSpecific ? 'site-specific' : null };
}

/** Pest groups whose recommendations include this MoA class (for the chemical page). */
export function groupsForMoa(groups, key) {
  return groups.filter(g => g.chem.some(c => c.moa === key));
}

/** Removed (banned) actives that were used against this group — search notices only. */
export const removedForGroup = (gid) => REMOVED.filter(r => (r.groups || []).includes(gid));

