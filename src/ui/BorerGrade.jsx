import React, { useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';

// Four quick questions about one tree → a level and a short action plan.
// Grading and steps follow the grower's Pinhole Borer app (rule of thumb, not
// trial-tested); spray persistence is from Reding & Ranger 2018.
const s = (en, zh) => ({ en, zh });
const QUESTIONS = [
  { id: 'holes', q: s('Pinholes, trunk base to 1 m', '针孔数量（树头到1米）'), a: [s('None', '没有'), s('1–10', '1–10个'), s('11–30', '11–30个'), s('More than 30', '30个以上')] },
  { id: 'bark', q: s('Bark when scraped', '刮开树皮'), a: [s('Dry, pale healthy wood', '干燥，淡色好木'), s('Gum, wet dark patch or brown', '流胶、湿黑斑或褐色'), s('Large wet rot, loose bark, smell', '大片湿烂、树皮松脱、有臭味')] },
  { id: 'round', q: s('How far round the trunk', '绕树干多少'), a: [s('Under ¼', '不到¼圈'), s('¼ to ½', '¼到½圈'), s('More than ½', '超过½圈')] },
  { id: 'crown', q: s('Canopy', '树冠'), a: [s('Normal, good colour', '正常，叶色好'), s('Some yellow leaves, twig dieback', '部分黄叶、枝梢枯死'), s('Mostly dead', '大部分枯死')] },
];

function level(v) {
  if (v.holes === 0 && v.bark === 0) return 'prevent';
  if (v.bark === 2 || v.round === 2 || v.crown === 2) return 'severe';
  if (v.bark === 1 || v.round === 1 || v.crown === 1 || v.holes === 3) return 'medium';
  return 'light';
}

const LEVELS = {
  prevent: { name: s('Prevention', '预防'), tone: 'bg-emerald-50 border-emerald-200', steps: [
    s('Keep the trunk base dry and open: no mulch within 30 cm, drains clear.', '树头保持干燥透气：30厘米内不堆覆盖物，排水沟通畅。'),
    s('Avoid wounds; seal pruning cuts the same day.', '避免伤树；修剪口当天封好。'),
    s('After a run of rainy days, walk round each tree base within a week. Fresh sawdust → spray the trunk within 3 days.', '连续下雨后一星期内绕树头巡查。有新木屑→3天内喷树干。'),
  ] },
  light: { name: s('Light', '轻度'), tone: 'bg-lime-50 border-lime-200', steps: [
    s('Scrape 1 cm round the holes. Brown or wet underneath? Answer "bark" again — it is at least medium.', '把针孔周围刮开1厘米。底下是褐色或湿的？重新回答“刮开树皮”——至少是中度。'),
    s('Spray the bark from the soil up to 2 m and the main forks, until it runs wet. Spray dry bark with no rain coming; add a sticker. Re-spray if heavy rain follows.', '从土面喷到2米高及大枝分叉处，喷到树皮湿润流下。在树皮干、不会下雨时喷，加粘着剂。喷后若下大雨要补喷。'),
    s('Re-spray when the protection runs out: permethrin lasted at least 4 weeks in a trial, bifenthrin only about 10 days.', '药效过了再复喷：试验中氯菊酯保护至少4周，联苯菊酯只有约10天。'),
    s('Check the base every week for fresh sawdust.', '每周检查树头有没有新木屑。'),
    s('Stop at 30 days if there is no fresh sawdust and the bark is still dry — go back to prevention.', '30天时若没有新木屑、树皮仍干燥，就停药，回到预防。'),
  ] },
  medium: { name: s('Medium', '中度'), tone: 'bg-amber-50 border-amber-200', steps: [
    s('Find the rot under the densest pinholes. Scrape back to pale healthy wood plus 2 cm; burn the scrapings.', '在针孔最密处找到烂斑，刮到淡色好木再多刮2厘米；刮下的烂皮烧掉。'),
    s('Treat the Phytophthora: phosphonate trunk injection, or metalaxyl / copper paste on the scraped area (see the Phytophthora page).', '处理疫霉：亚磷酸盐树干注射，或在刮开处涂甲霜灵/铜剂（见疫霉页）。'),
    s('Spray the bark from the soil up to 2 m and the main forks until it runs wet (permethrin lasts longest); re-spray when protection runs out.', '从土面到2米高及大枝分叉处喷树皮，喷到湿润流下（氯菊酯持效最长）；药效过了再复喷。'),
    s('Cut dead twigs back to healthy wood, seal the cuts, burn the wood. Fix drainage at the base.', '枯梢剪到健康处，封好剪口，枝条烧掉。做好树头排水。'),
    s('Recheck at 30 days: new bark growing at the lesion edge means it is healing. Do not cut the tree down.', '30天复查：病斑边缘长出新皮就是在好转。不要砍树。'),
  ] },
  severe: { name: s('Severe', '重度'), tone: 'bg-rose-50 border-rose-200', steps: [
    s('Check it is alive: a green or white layer under the bark, or new buds. If so, keep going.', '先确认树是活的：树皮下有青色或白色活层，或有新芽。是活的就继续。'),
    s('Scrape out every lesion to healthy wood and burn the bark — a big scraped area is better than rot left in.', '把所有烂斑刮到好木，烂皮烧掉——刮出大面积也比留着烂好。'),
    s('Full Phytophthora treatment (injection plus soil), repeated after 3 weeks.', '疫霉全套处理（注射加淋根），3周后再做一次。'),
    s('Spray the trunk at the shortest interval and rotate.', '按最短间隔喷树干，并轮换用药。'),
    s('Remove dead branches; thin or remove the fruit so the tree can recover.', '剪掉枯枝；疏果或摘掉全部果实，让树先恢复。'),
    s('Recheck at 30 and 90 days. Cut down only a dead tree, and burn it fast — dead trees breed the beetles.', '30天和90天各复查一次。只有死树才砍，并尽快烧掉——死树是小蠹的繁殖场。'),
  ] },
};

export function BorerGrade() {
  const { t } = useLang();
  const [v, setV] = useState({});
  const done = QUESTIONS.every(q => v[q.id] !== undefined);
  const lv = done ? LEVELS[level(v)] : null;
  return (
    <div className="mt-3 rounded-2xl bg-paper border border-slate-200 p-3">
      <div className="font-extrabold text-[1rem]">{t(s('How bad is this tree?', '这棵树有多严重？'))}</div>
      <p className="text-[0.8125rem] text-slate-500 leading-snug">{t(s('Four questions → a plan for this tree. A rule of thumb, not a trial-tested score.', '四个问题→这棵树的方案。是经验做法，不是试验得出的评分。'))}</p>
      {QUESTIONS.map(q => (
        <div key={q.id} className="mt-2.5">
          <div className="text-[0.875rem] font-bold text-slate-700">{t(q.q)}</div>
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            {q.a.map((a, i) => (
              <button key={i} type="button" aria-pressed={v[q.id] === i} onClick={() => setV({ ...v, [q.id]: i })}
                className={`min-h-[44px] px-2 py-1.5 rounded-lg border text-[0.875rem] font-semibold leading-tight text-left ${v[q.id] === i ? 'bg-[#114b2d] border-[#114b2d] text-white' : 'bg-paper border-slate-300 text-slate-700'}`}>
                {t(a)}
              </button>
            ))}
          </div>
        </div>
      ))}
      {lv && (
        <div className={`mt-3 rounded-xl border p-3 ${lv.tone}`}>
          <div className="font-extrabold text-[1rem]">{t(lv.name)}</div>
          <ol className="mt-1.5 space-y-1.5 list-decimal pl-5">
            {lv.steps.map((st, i) => <li key={i} className="text-[0.9375rem] leading-snug">{t(st)}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
