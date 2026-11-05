// Where to put the spray for each pest group — carried over from the old
// app's per-pest application notes (src/data/application.js), merged per group.
// Plain placement advice that follows where the pest lives (see `hides`).
const s = (en, zh) => ({ en, zh });
export const SPRAY_WHERE = {
  'phloem-suckers': s('Expanding new flush and the underside of young leaves; for psyllids, the outer canopy where new leaves open.', '正在展开的新梢和嫩叶背面；木虱要喷树冠外围新叶展开处。'),
  leafhoppers: s('Young flush, especially the leaf undersides and leaf edges; adults fly, so cover the whole canopy.', '嫩梢，尤其是叶背和叶缘；成虫会飞，要覆盖整个树冠。'),
  'scale-mealybug': s('Twigs, leaf veins, branch forks and bark cracks; on fruit, the stalk and between the spines. Hard-shelled adults need a heavy branch spray with oil.', '细枝、叶脉、枝桠分叉和树皮缝隙；果实上喷果柄和果刺之间。硬壳成虫需加油剂对枝条重喷。'),
  thrips: s('Into the flower buds and clusters, and the tightly folded new leaves.', '喷进花蕾和花序，以及紧卷的嫩叶。'),
  'plant-bugs': s('Young fruit clusters and the foliage around them.', '幼果串及周围叶片。'),
  'leaf-caterpillars': s('Leaves being eaten, especially rolled or folded leaves; spray the whole canopy for hairy and bagworm caterpillars.', '正被啃食的叶片，尤其是卷叶和折叶；毒蛾和蓑蛾要喷整个树冠。'),
  'leaf-beetles': s('Leaves being chewed; chafers feed at night, so spray in the late evening. For grasshopper nymphs, the lower canopy.', '正被啃食的叶片；金龟子夜间取食，傍晚喷施。蝗虫若虫喷下层树冠。'),
  'fruit-borers': s('The fruit surface and fruit clusters, from young fruit onward — early, before larvae get inside.', '从幼果期开始喷果面和果串——要趁早，在幼虫钻进去之前。'),
  'fruit-flies': s('No cover spray. Spot-spray protein bait on trunks and lower leaves around the orchard edge; collect fallen fruit.', '不全面喷药。在果园边缘的树干和下部叶片上点喷蛋白诱饵；清理落果。'),
  'trunk-borers': s('Into the fresh holes after clearing out the frass, then the bark around them.', '先清除蛀屑，再把药注入新鲜蛀孔，然后处理周围树皮。'),
  'red-branch-borer': s('Into the borehole on the branch; cut off and burn branches that are already hollow.', '注入枝条上的蛀孔；已蛀空的枝条剪下烧毁。'),
  'shot-hole': s('The bark of the attacked trunk and branches, where the pinholes are — after cutting out dead wood.', '受害树干和枝条有针孔的树皮处——先锯除枯木。'),
  'soil-pests': s('Soil drench at the trunk base and root zone, not the canopy.', '在树干基部和根区灌根，不喷树冠。'),
  'ants-wasps': s('Ants: trunk base and bait stations on the ground. Wasp and hornet nests: spray the nest directly at night, with protective clothing.', '蚂蚁：树干基部及地面诱饵站。胡蜂窝：夜间穿防护服直接喷蜂窝。'),
  mites: s('Leaves where the mites sit — red mites mainly on the upper surface, broad mites on shoot tips. Coverage matters more than dose.', '螨所在的叶片——红蜘蛛主要在叶面，茶黄螨在嫩梢尖。覆盖比剂量更重要。'),
  snails: s('Pellets scattered thinly around the trunk base and seedlings, not on the tree.', '在树干基部和幼苗周围薄撒颗粒，不撒在树上。'),
  nematodes: s('Root zone drench, under the canopy edge where the feeder roots are.', '根区灌根，在树冠滴水线下吸收根所在处。'),
  oomycete: s('Trunk lesions (scrape and paint) and the soil around the trunk; nursery: the polybag soil.', '树干病斑（刮除后涂药）及树干周围土壤；苗圃：营养袋土壤。'),
  'canker-dieback': s('Pruning cuts and cankers (paint them), and the branch forks; pink disease starts in the forks.', '修剪伤口和溃疡处（涂药）以及枝桠分叉处；粉红病从分叉处开始。'),
  fusarium: s('Cut surfaces and scraped lesion edges, and the trunk base — after cutting out dead wood, not instead of it.', '切面、刮净的病斑边缘以及树干基部——在锯除枯木之后，而不是代替锯除。'),
  'leaf-spots': s('The whole canopy, including flowers and young fruit when anthracnose is active.', '整个树冠；炭疽病发生时包括花和幼果。'),
  rhizoctonia: s('Young flush and seedlings, and the lower canopy where leaves stay wet.', '嫩梢和幼苗，以及叶片长期潮湿的下层树冠。'),
  'root-fungi': s('Dig a trench to cut root contact with sick trees, then drench deep around the collar and main roots.', '挖隔离沟切断与病树的根系接触，然后在根颈和主根周围深层灌根。'),
  bacterial: s('The canopy, focusing on spotted leaves.', '树冠，重点喷病斑叶片。'),
  epiphytes: s('Scrape and wash the trunk; no spray on the leaves.', '刮除并冲洗树干；不喷叶片。'),
};
