// Mr. Ganick organic range — shown on a pest page when the farmer switches on
// "Organic only", as one of the ways. Organic products are hard to find in Malaysia;
// this range is widely available. Only products the catalogue lists for a durian pest or
// disease. Product name and actives only — no doses, no praise, and never the catalogue's
// chemical mix partners (so no banned active can come in).
// Uses follow the manufacturer's catalogue (not independent trials on durian).
// The catalogue app now belongs to the company, so this app names the products only —
// no link to the catalogue.
// Checked against the catalogue on 7 Nov 2026. Two catalogue wordings are corrected
// here: BST BOOST's salt is a phosphonate (亚磷酸盐, not 磷酸盐 phosphate), and PGPR
// means plant growth-promoting rhizobacteria.

const A = {
  faboideae: { en: 'Plant alkaloid (Faboideae, pea family)', zh: '豆科植物生物碱', ms: 'Alkaloid tumbuhan (Faboideae, keluarga kekacang)' },
  papilionaceae: { en: 'Plant alkaloid (Papilionaceae, pea family)', zh: '蝶形花科植物生物碱', ms: 'Alkaloid tumbuhan (Papilionaceae, keluarga kekacang)' },
  labiate: { en: 'Plant alkaloid (Lamiaceae, mint family)', zh: '唇形科植物生物碱', ms: 'Alkaloid tumbuhan (Lamiaceae, keluarga pudina)' },
  ranunculaceae: { en: 'Plant alkaloid (Ranunculaceae, buttercup family)', zh: '毛茛科植物生物碱', ms: 'Alkaloid tumbuhan (Ranunculaceae, keluarga buttercup)' },
  aromaticOil: { en: 'Skin-grade aromatic oil', zh: '护肤级芳香油', ms: 'Minyak aromatik gred kulit' },
  cayenne: { en: 'Cayenne (chilli) extract', zh: '辣椒提取物', ms: 'Ekstrak cili (cayenne)' },
  bsa: { en: 'Live insect-killing bacteria (BSA)', zh: '活性昆虫病原细菌（BSA）', ms: 'Bakteria pembunuh serangga hidup (BSA)' },
  metarhizium: { en: 'Live insect-killing fungus Metarhizium anisopliae', zh: '活性昆虫病原真菌（绿僵菌 Metarhizium anisopliae）', ms: 'Kulat pembunuh serangga hidup Metarhizium anisopliae' },
  bacillus2: { en: 'Live Bacillus (two species)', zh: '双枯草芽孢杆菌（活菌）', ms: 'Bacillus hidup (dua spesies)' },
  trichoderma: { en: 'Trichoderma (live mycelium)', zh: '木霉菌（活性菌丝）', ms: 'Trichoderma (miselium hidup)' },
  bstMix: { en: 'Bacillus subtilis and Trichoderma (live strains) + plant growth-promoting rhizobacteria (PGPR)', zh: '枯草芽孢杆菌与木霉（活菌株）＋ 植物根际促生菌（PGPR）', ms: 'Bacillus subtilis dan Trichoderma (strain hidup) + rizobakteria penggalak pertumbuhan tumbuhan (PGPR)' },
  phosphonate: { en: 'Phosphonate salt', zh: '亚磷酸盐', ms: 'Garam fosfonat' },
};

// use: what the catalogue lists it for on durian (season notes kept: they are timing, not dose).
export const GANICK = [
  { id: 'ultimite', moa: 'IRAC UN', name: 'ULTIMITE SL', zh: '灭蝽螨', actives: [A.faboideae], groups: ['leafhoppers', 'mites'],
    use: { en: 'Durian leafhopper, red spider mite', zh: '榴莲青蚊、红蜘蛛', ms: 'Bena hijau durian, hama labah-labah merah' } },
  { id: 'samyl', moa: 'BIO-INS', name: 'S-AMYL WP', zh: '螨抑', actives: [A.bsa], groups: ['mites'],
    use: { en: 'Two-spotted spider mite (live product)', zh: '二点叶螨（活菌产品）', ms: 'Hama labah-labah dua titik (produk hidup)' } },
  { id: 'scaleexlite', moa: 'IRAC UN', name: 'SCALE EX-LITE EW', zh: '除介王', actives: [A.aromaticOil], groups: ['scale-mealybug', 'phloem-suckers'],
    use: { en: 'Scale insects, mealybugs, psyllids, whitefly', zh: '介壳虫、粉蚧、木虱、粉虱', ms: 'Serangga perisai, koya, psilid, lalat putih' } },
  { id: 'aphidbuster', moa: 'IRAC UN', name: 'APHID BUSTER SL', zh: '除蚜星', actives: [A.faboideae], groups: ['phloem-suckers'],
    use: { en: 'Aphids', zh: '蚜虫', ms: 'Afid' } },
  { id: 'lmreaper', moa: 'IRAC UN', name: 'LM REAPER SP', zh: '灭飞', actives: [A.cayenne], groups: ['thrips'],
    use: { en: 'Thrips', zh: '蓟马', ms: 'Kutu thrips' } },
  { id: 'tmax', moa: 'BIO-INS', name: 'T-MAX WP', zh: '黑蓟将军', actives: [A.metarhizium], groups: ['thrips'],
    use: { en: 'Black and orange thrips (live product)', zh: '黑蓟马、橙色蓟马（活菌产品）', ms: 'Kutu thrips hitam dan oren (produk hidup)' } },
  { id: 'lepid007', moa: 'IRAC UN', name: 'LEPID 007 SL', zh: '鳞鳞清', actives: [A.papilionaceae], groups: ['fruit-borers', 'leaf-caterpillars'],
    use: { en: 'Durian fruit and flower borers', zh: '榴莲蛀果虫、蛀花虫', ms: 'Pengorek buah dan bunga durian' } },
  { id: 'moldyguard', moa: 'FRAC BM01', name: 'MOLDY GUARD SL', zh: '抵菌卫', actives: [A.labiate], groups: ['rhizoctonia'],
    use: { en: 'Durian leaf blight — dry season', zh: '榴莲叶枯病——旱季', ms: 'Hawar daun durian — musim kemarau' } },
  { id: 'bactx', moa: 'FRAC BM01', name: 'BACT-X SL', zh: '灭菌星', actives: [A.ranunculaceae], groups: ['rhizoctonia'],
    use: { en: 'Durian leaf blight — dry season', zh: '榴莲叶枯病——旱季', ms: 'Hawar daun durian — musim kemarau' } },
  { id: 'bacilwp', moa: 'BIO-FUN', name: 'BACIL UV+ WP', zh: '双枯草', actives: [A.bacillus2], groups: ['rhizoctonia'],
    use: { en: 'Durian leaf blight — wet season, used together with TRICHO UV+ WP', zh: '榴莲叶枯病——雨季，与木霉优 WP 一起使用', ms: 'Hawar daun durian — musim hujan, digunakan bersama TRICHO UV+ WP' } },
  { id: 'trichowp', moa: 'BIO-FUN', name: 'TRICHO UV+ WP', zh: '木霉优', actives: [A.trichoderma], groups: ['rhizoctonia'],
    use: { en: 'Durian leaf blight — wet season, used together with BACIL UV+ WP', zh: '榴莲叶枯病——雨季，与双枯草 WP 一起使用', ms: 'Hawar daun durian — musim hujan, digunakan bersama BACIL UV+ WP' } },
  { id: 'bacil', moa: 'BIO-FUN', name: 'BACIL UV+', zh: '双枯草', actives: [A.bacillus2], groups: ['canker-dieback'],
    use: { en: 'Durian twig blight; algal leaf spot', zh: '榴莲枝霉病；藻斑病', ms: 'Hawar ranting durian; tompok daun alga' } },
  { id: 'bst', moa: 'BIO-FUN', name: 'BST WP', zh: '宝盛达', actives: [A.bstMix], groups: ['oomycete'],
    use: { en: 'Durian black heart-rot (Phytophthora)', zh: '榴莲黑心病（疫霉）', ms: 'Reput hati hitam durian (Phytophthora)' } },
  { id: 'bstgold', moa: 'BIO-FUN', name: 'BST GOLD WP', zh: 'BST GOLD', actives: [A.bstMix], groups: ['oomycete'],
    use: { en: 'Severe black heart-rot, used together with BST BOOST', zh: '严重黑心病，与 BST BOOST 一起使用', ms: 'Reput hati hitam yang teruk, digunakan bersama BST BOOST' } },
  { id: 'bstboost', moa: 'FRAC P07', organic: false, name: 'BST BOOST SP', zh: 'BST BOOST', actives: [A.papilionaceae, A.phosphonate], groups: ['oomycete'],
    use: { en: 'Severe black heart-rot, used together with BST GOLD', zh: '严重黑心病，与 BST GOLD 一起使用', ms: 'Reput hati hitam yang teruk, digunakan bersama BST GOLD' } },
];

// `moa`: the option the product belongs to on a pest page (same way of working).
// `organic: false`: BST BOOST is a phosphonate, which this app does not class as organic,
// so it shows only when the farmer is not on "Organic only".
export const ganickFor = (groupId) => GANICK.filter(p => p.groups.includes(groupId));
