// Words to know. The app keeps the real technical term (so farmers learn the word
// they will hear from dealers and extension officers) and explains it: the first
// time a term appears in a block of text it is underlined, and a tap opens the
// meaning. The "Words to know" lesson lists them all.
//
// `match` holds regex sources per language. Latin-script patterns match whole words,
// case-insensitive, unless the entry sets `cs: true` (case-sensitive: EC, SC, pH).
// `word` is how the term is shown in that language; for zh/ms the English term is
// shown next to it so the farmer also learns the international word.

export const GLOSSARY = [
  {
    id: 'systemic',
    match: { en: ['systemic'], zh: ['内吸性', '内吸'], ms: ['sistemik'] },
    word: { en: 'Systemic', zh: '内吸性', ms: 'Sistemik' },
    means: {
      en: 'Soaked up into the plant and carried in its sap to other parts, including new growth. It reaches pests feeding or hiding inside, and rain cannot wash it off once absorbed.',
      zh: '药被植物吸收进去，随汁液运到其他部位，包括新长的嫩梢。能打到藏在里面或在里面取食的害虫；吸收后雨水也冲不掉。',
      ms: 'Diserap masuk ke dalam pokok dan dibawa oleh air getah ke bahagian lain, termasuk pucuk baru. Ia sampai kepada perosak yang makan atau bersembunyi di dalam, dan tidak dibasuh hujan selepas diserap.',
    },
  },
  {
    id: 'translaminar',
    match: { en: ['translaminar'], zh: ['渗透性', '跨层'], ms: ['translaminar'] },
    word: { en: 'Translaminar', zh: '渗透性（跨层）', ms: 'Translaminar' },
    means: {
      en: 'Soaks through the leaf from the sprayed side to the other side, but does not travel around the plant. Reaches pests under leaves and inside folded leaves.',
      zh: '药从喷到的一面渗到叶子的另一面，但不会在整株植物里移动。能打到叶背和卷叶里面的害虫。',
      ms: 'Meresap menembusi daun dari bahagian yang disembur ke bahagian sebelah lagi, tetapi tidak bergerak ke seluruh pokok. Sampai kepada perosak di bawah daun dan di dalam daun yang berlipat.',
    },
  },
  {
    id: 'contact',
    match: { en: ['contact action', 'contact insecticides?', 'contact fungicides?', 'contact kill', '(?:kills?|works?|acts?) (?:on|by) contact', 'on contact'], zh: ['触杀'], ms: ['racun sentuhan', '(?:secara|melalui) sentuhan', 'tindakan sentuhan'] },
    word: { en: 'Contact action', zh: '触杀', ms: 'Tindakan sentuhan' },
    means: {
      en: 'Kills only the pests the spray actually touches. Good coverage matters: pests hiding where the spray does not reach survive.',
      zh: '只杀死药液直接碰到的害虫。所以要喷得均匀到位——药喷不到的地方，害虫就活下来。',
      ms: 'Hanya membunuh perosak yang terkena semburan. Liputan semburan penting: perosak yang bersembunyi di tempat yang tidak terkena akan terus hidup.',
    },
  },
  {
    id: 'stomach',
    match: { en: ['stomach poisons?', 'stomach action'], zh: ['胃毒'], ms: ['racun perut'] },
    word: { en: 'Stomach poison', zh: '胃毒', ms: 'Racun perut' },
    means: {
      en: 'Works only after the pest eats the sprayed leaf or fruit. Cover the parts the pest is eating, and expect it to take a day or more.',
      zh: '害虫要吃下喷过药的叶子或果实才起作用。要喷到害虫正在吃的部位，药效一般要一天或更久才看得出。',
      ms: 'Hanya berkesan selepas perosak memakan daun atau buah yang disembur. Sembur bahagian yang sedang dimakan, dan kesannya mungkin mengambil masa sehari atau lebih.',
    },
  },
  {
    id: 'moa',
    match: { en: ['modes? of action', 'MoA'], zh: ['作用方式', '作用机理'], ms: ['cara tindakan', 'MoA'] },
    word: { en: 'Mode of action (MoA)', zh: '作用方式（MoA）', ms: 'Cara tindakan (MoA)' },
    means: {
      en: 'How a product kills — which part of the pest it attacks (nerves, muscles, growth, energy…). Products with the same mode of action count as the same product for resistance, even under different brand names.',
      zh: '药是怎样杀死害虫的——攻击害虫的哪个部位（神经、肌肉、生长、能量……）。作用方式相同的药，就算牌子不同，在抗性上也算同一种药。',
      ms: 'Cara sesuatu produk membunuh — bahagian perosak yang diserang (saraf, otot, pertumbuhan, tenaga…). Produk dengan cara tindakan yang sama dikira sebagai produk yang sama dari segi kerintangan, walaupun jenamanya berbeza.',
    },
  },
  {
    id: 'irac',
    match: { en: ['IRAC'], zh: ['IRAC'], ms: ['IRAC'] },
    word: { en: 'IRAC group', zh: 'IRAC分组', ms: 'Kumpulan IRAC' },
    means: {
      en: 'The international numbering of insecticides by mode of action (IRAC = Insecticide Resistance Action Committee). The number is often printed on the label. Same number = same way of killing, so rotate to a different number.',
      zh: '国际上按作用方式给杀虫剂编的号（IRAC＝杀虫剂抗性行动委员会），标签上常常印有这个号码。号码相同＝杀虫方式相同，所以轮换时要换不同的号码。',
      ms: 'Penomboran antarabangsa racun serangga mengikut cara tindakan (IRAC = Insecticide Resistance Action Committee). Nombor ini selalunya dicetak pada label. Nombor sama = cara membunuh sama, jadi gilirkan kepada nombor lain.',
    },
  },
  {
    id: 'frac',
    match: { en: ['FRAC'], zh: ['FRAC'], ms: ['FRAC'] },
    word: { en: 'FRAC group', zh: 'FRAC分组', ms: 'Kumpulan FRAC' },
    means: {
      en: 'The same idea as IRAC, for fungicides (FRAC = Fungicide Resistance Action Committee). Same FRAC code = same way of working; rotate to a different code.',
      zh: '和IRAC一样的编号方法，用于杀菌剂（FRAC＝杀菌剂抗性行动委员会）。FRAC号相同＝作用方式相同，轮换时要换不同的号。',
      ms: 'Idea yang sama seperti IRAC, untuk racun kulat (FRAC = Fungicide Resistance Action Committee). Kod FRAC sama = cara tindakan sama; gilirkan kepada kod lain.',
    },
  },
  {
    id: 'resistance',
    match: { en: ['resistance', 'resistant'], zh: ['抗药性', '抗性'], ms: ['kerintangan', 'rintang'] },
    word: { en: 'Resistance', zh: '抗性（抗药性）', ms: 'Kerintangan' },
    means: {
      en: 'When a product that used to work no longer kills the pest. It builds up when the same mode of action is sprayed again and again: each spray kills the normal pests, the few tougher ones survive and breed ("selecting resistance").',
      zh: '以前有效的药，现在杀不死这种害虫了。反复喷同一种作用方式的药，就会产生抗性：每次喷药杀掉普通的虫，少数比较耐药的活下来繁殖（“筛选出抗性”）。',
      ms: 'Apabila produk yang dahulu berkesan tidak lagi membunuh perosak. Ia terbina apabila cara tindakan yang sama disembur berulang kali: setiap semburan membunuh perosak biasa, segelintir yang lebih tahan hidup dan membiak ("memilih kerintangan").',
    },
  },
  {
    id: 'induced',
    match: { en: ['induced resistance'], zh: ['诱导抗性'], ms: ['kerintangan teraruh'] },
    word: { en: 'Induced resistance', zh: '诱导抗性', ms: 'Kerintangan teraruh' },
    means: {
      en: 'Not pest resistance — this is the tree switching on its own defences after a trigger (some Bacillus products, phosphonate). It protects best when started early, before the disease is strong.',
      zh: '这不是害虫的抗药性——而是某些产品（部分芽孢杆菌、亚磷酸盐）刺激后，树自己启动防御。越早开始保护效果越好，要在病害严重之前。',
      ms: 'Bukan kerintangan perosak — ini ialah pokok menghidupkan pertahanannya sendiri selepas dirangsang (sesetengah produk Bacillus, fosfonat). Perlindungannya paling baik jika dimulakan awal, sebelum penyakit menjadi teruk.',
    },
  },
  {
    id: 'cross',
    match: { en: ['cross-resistan(?:ce|t)'], zh: ['交叉抗性', '交互抗性'], ms: ['kerintangan silang'] },
    word: { en: 'Cross-resistance', zh: '交叉抗性', ms: 'Kerintangan silang' },
    means: {
      en: 'Pests that became resistant to one product are also resistant to other products that work the same way — even ones they have never met. Switching brand is not rotating if the group is the same.',
      zh: '害虫对一种药产生抗性后，对作用方式相同的其他药也有抗性——即使从来没接触过。换牌子不等于轮换，只要分组一样就没用。',
      ms: 'Perosak yang sudah rintang terhadap satu produk juga rintang terhadap produk lain yang bertindak dengan cara sama — walaupun belum pernah terdedah. Tukar jenama bukan giliran jika kumpulannya sama.',
    },
  },
  {
    id: 'phi',
    match: { en: ['pre-harvest intervals?', 'PHI'], zh: ['安全间隔期'], ms: ['tempoh tunggu sebelum tuai', 'tempoh tunggu'] },
    word: { en: 'Pre-harvest interval (PHI)', zh: '安全间隔期（PHI）', ms: 'Tempoh tunggu sebelum tuai (PHI)' },
    means: {
      en: 'The number of days on the label that must pass between the last spray and harvest, so residues fall to a safe level. Count back from the expected harvest.',
      zh: '标签上写的、最后一次喷药到采收之间必须相隔的天数，让残留降到安全水平。要从预计采收日往回算。',
      ms: 'Bilangan hari pada label yang mesti berlalu antara semburan terakhir dan tuaian, supaya sisa turun ke paras selamat. Kira ke belakang dari tarikh jangkaan tuai.',
    },
  },
  {
    id: 'mrl',
    match: { en: ['MRLs?', 'maximum residue limits?'], zh: ['残留限量'], ms: ['MRL'] },
    word: { en: 'MRL (maximum residue limit)', zh: '残留限量（MRL）', ms: 'MRL (had maksimum sisa)' },
    means: {
      en: 'The most pesticide residue the law allows on the fruit, in mg per kg. Each importing country sets its own; fruit over the limit can be rejected at the border.',
      zh: '法律允许果实上残留农药的最高量，单位是毫克/公斤。每个进口国家自己定；超过限量的果可能在入境时被退回。',
      ms: 'Jumlah sisa racun tertinggi yang dibenarkan undang-undang pada buah, dalam mg per kg. Setiap negara pengimport menetapkan hadnya sendiri; buah yang melebihi had boleh ditolak di sempadan.',
    },
  },
  {
    id: 'ai',
    match: { en: ['active ingredients?'], zh: ['有效成分'], ms: ['bahan aktif'] },
    word: { en: 'Active ingredient', zh: '有效成分', ms: 'Bahan aktif' },
    means: {
      en: 'The chemical in the bottle that actually kills the pest, printed on the label (e.g. abamectin). Brand names differ; the active ingredient tells you what you are really spraying.',
      zh: '药瓶里真正杀虫或杀菌的成分，印在标签上（例如阿维菌素）。牌子名称各不相同，看有效成分才知道你真正喷的是什么。',
      ms: 'Bahan kimia dalam botol yang sebenarnya membunuh perosak, dicetak pada label (contohnya abamectin). Nama jenama berbeza; bahan aktif memberitahu apa yang sebenarnya anda sembur.',
    },
  },
  {
    id: 'threshold',
    match: { en: ['action thresholds?', 'thresholds?'], zh: ['防治阈值', '阈值'], ms: ['paras tindakan'] },
    word: { en: 'Action threshold', zh: '防治阈值', ms: 'Paras tindakan' },
    means: {
      en: 'How many pests (or how much damage) you should see before spraying is worth it. Below it, the spray costs more than the damage — and kills natural enemies for nothing.',
      zh: '看到多少害虫（或多大损害）才值得喷药。低于这个量，喷药的成本比损失还大，还白白杀死天敌。',
      ms: 'Berapa banyak perosak (atau kerosakan) yang perlu dilihat sebelum semburan berbaloi. Di bawah paras ini, kos semburan lebih tinggi daripada kerosakan — dan musuh semula jadi terbunuh sia-sia.',
    },
  },
  {
    id: 'moult',
    match: { en: ['moult(?:s|ing|ed)?', 'molt(?:s|ing|ed)?'], zh: ['蜕皮'], ms: ['bersalin kulit', 'salin kulit'] },
    word: { en: 'Moulting', zh: '蜕皮', ms: 'Bersalin kulit' },
    means: {
      en: 'Young insects grow by shedding their skin several times. Products that block moulting (growth regulators) kill young stages, not adults — so timing matters.',
      zh: '幼虫或若虫要蜕几次皮才能长大。阻止蜕皮的药（生长调节剂）只杀幼期，不杀成虫——所以喷药时机很重要。',
      ms: 'Serangga muda membesar dengan menyalin kulit beberapa kali. Produk yang menghalang salin kulit (pengawal atur pertumbuhan) membunuh peringkat muda, bukan dewasa — jadi masa semburan penting.',
    },
  },
  {
    id: 'honeydew',
    match: { en: ['honeydew'], zh: ['蜜露'], ms: ['embun madu'] },
    word: { en: 'Honeydew', zh: '蜜露', ms: 'Embun madu' },
    means: {
      en: 'Sticky, sugary waste passed by sap-sucking insects (mealybugs, scales, psyllids, leafhoppers). It attracts ants and grows black sooty mould.',
      zh: '吸汁害虫（粉蚧、介壳虫、木虱、叶蝉）排出的黏黏的含糖排泄物。会招来蚂蚁，并长出黑色的煤污病。',
      ms: 'Sisa melekit dan bergula yang dikeluarkan serangga penghisap (koya, serangga perisai, psilid, lompat daun). Ia menarik semut dan menumbuhkan kulapuk jelaga hitam.',
    },
  },
  {
    id: 'sooty',
    match: { en: ['sooty mou?lds?'], zh: ['煤污病', '煤烟病'], ms: ['kulapuk jelaga'] },
    word: { en: 'Sooty mould', zh: '煤污病', ms: 'Kulapuk jelaga' },
    means: {
      en: 'A black, powdery fungus growing on honeydew on leaves and fruit. It does not infect the plant but blocks light; control the sap-sucking insects and it goes away.',
      zh: '长在叶子和果实蜜露上的黑色粉状真菌。它不侵染植物，但会挡住阳光；控制好吸汁害虫，它自然就会消失。',
      ms: 'Kulat hitam berserbuk yang tumbuh pada embun madu di daun dan buah. Ia tidak menjangkiti pokok tetapi menghalang cahaya; kawal serangga penghisap dan ia akan hilang.',
    },
  },
  {
    id: 'oomycete',
    match: { en: ['oomycetes?', 'water mou?lds?'], zh: ['卵菌', '水霉'], ms: ['kulat air', 'oomycete'] },
    word: { en: 'Water mould (oomycete)', zh: '水霉（卵菌）', ms: 'Kulat air (oomycete)' },
    means: {
      en: 'Phytophthora and Pythium look like fungi but are a different group of organisms. They spread by swimming spores in wet soil and water, so drainage matters — and many ordinary fungicides do not work on them.',
      zh: '疫霉和腐霉看起来像真菌，其实是另一类生物。它们靠会游动的孢子在湿土和水里传播，所以排水很重要——而且很多普通杀菌剂对它们没用。',
      ms: 'Phytophthora dan Pythium kelihatan seperti kulat tetapi merupakan kumpulan organisma yang berbeza. Ia merebak melalui spora yang berenang dalam tanah basah dan air, jadi saliran penting — dan banyak racun kulat biasa tidak berkesan terhadapnya.',
    },
  },
  {
    id: 'phosphonate',
    match: { en: ['phosphonates?', 'phosphites?', 'phosphonic acid'], zh: ['亚磷酸', '膦酸'], ms: ['fosfonat', 'fosfit', 'asid fosfonik'] },
    word: { en: 'Phosphonate (phosphite)', zh: '亚磷酸盐（膦酸盐）', ms: 'Fosfonat (fosfit)' },
    means: {
      en: 'Potassium phosphonate: a systemic product that moves both up and down inside the tree and helps the tree defend itself against Phytophthora. Used by trunk injection or spray. Not a fertiliser, despite the name.',
      zh: '亚磷酸钾：一种内吸性产品，在树体内能上下移动，帮助树自身抵抗疫霉。可以树干注射或喷施。名字像肥料，但它不是磷肥。',
      ms: 'Kalium fosfonat: produk sistemik yang bergerak ke atas dan ke bawah di dalam pokok dan membantu pokok mempertahankan diri terhadap Phytophthora. Digunakan melalui suntikan batang atau semburan. Walaupun namanya begitu, ia bukan baja.',
    },
  },
  {
    id: 'trichoderma',
    match: { en: ['Trichoderma'], zh: ['木霉'], ms: ['Trichoderma'] },
    word: { en: 'Trichoderma', zh: '木霉菌（Trichoderma）', ms: 'Trichoderma' },
    means: {
      en: 'A helpful fungus that lives in soil and around roots, attacking and crowding out root-rot organisms. It is alive: keep it away from fungicides that kill it, and give it organic matter and moisture.',
      zh: '一种有益真菌，生活在土壤和根部周围，会攻击并排挤根腐病菌。它是活的：别和会杀死它的杀菌剂一起用，并给它有机质和湿度。',
      ms: 'Kulat berguna yang hidup dalam tanah dan di sekitar akar, menyerang dan menyingkirkan organisma reput akar. Ia hidup: jauhkan daripada racun kulat yang membunuhnya, dan beri bahan organik serta kelembapan.',
    },
  },
  {
    id: 'bt',
    match: { en: ['Bacillus thuringiensis', 'Bt'], zh: ['苏云金杆菌', 'Bt'], ms: ['Bacillus thuringiensis', 'Bt'] },
    cs: true,
    word: { en: 'Bt (Bacillus thuringiensis)', zh: 'Bt（苏云金杆菌）', ms: 'Bt (Bacillus thuringiensis)' },
    means: {
      en: 'A natural bacterium that poisons caterpillars when they eat sprayed leaves. Harmless to bees, people and most natural enemies. Sunlight breaks it down, so spray late afternoon on young caterpillars.',
      zh: '一种天然细菌，毛虫吃了喷过的叶子就会中毒。对蜜蜂、人和大多数天敌无害。阳光会分解它，所以傍晚喷，趁毛虫还小的时候。',
      ms: 'Bakteria semula jadi yang meracuni ulat apabila ia memakan daun yang disembur. Tidak berbahaya kepada lebah, manusia dan kebanyakan musuh semula jadi. Cahaya matahari memusnahkannya, jadi sembur lewat petang ketika ulat masih kecil.',
    },
  },
  {
    id: 'enemies',
    match: { en: ['natural enemies', 'natural enemy', 'beneficials', 'beneficial insects?', 'predators?', 'parasitoids?'], zh: ['天敌'], ms: ['musuh semula jadi', 'pemangsa'] },
    word: { en: 'Natural enemies', zh: '天敌', ms: 'Musuh semula jadi' },
    means: {
      en: 'Insects, mites, spiders and birds that eat or parasitise pests for free — lacewings, ladybirds, predatory mites, small wasps. Broad-spectrum sprays kill them too, and pests often bounce back worse.',
      zh: '免费帮你吃掉或寄生害虫的昆虫、螨、蜘蛛和鸟——草蛉、瓢虫、捕食螨、小寄生蜂。广谱农药也会把它们杀死，害虫常常反弹得更厉害。',
      ms: 'Serangga, hama, labah-labah dan burung yang memakan atau memparasit perosak secara percuma — lacewing, kumbang kura-kura, hama pemangsa, tebuan kecil. Semburan spektrum luas turut membunuhnya, dan perosak selalunya kembali lebih teruk.',
    },
  },
  {
    id: 'drench',
    match: { en: ['drench(?:es|ed|ing)?', 'soil drench'], zh: ['灌根'], ms: ['siraman tanah', 'siram ke tanah', 'siram pada pangkal'] },
    word: { en: 'Drench', zh: '灌根', ms: 'Siraman tanah (drench)' },
    means: {
      en: 'Pouring the mixed product onto the soil around the trunk base so it soaks down to the roots, instead of spraying the leaves.',
      zh: '把配好的药液浇在树干基部周围的土里，让它渗到根部，而不是喷在叶子上。',
      ms: 'Menuang campuran produk ke tanah di sekeliling pangkal batang supaya meresap ke akar, bukannya menyembur daun.',
    },
  },
  {
    id: 'tankmix',
    match: { en: ['tank-mix(?:es|ed|ing)?', 'tank mix(?:es|ed|ing)?'], zh: ['混配', '桶混'], ms: ['campur dalam tangki', 'campuran tangki'] },
    word: { en: 'Tank-mix', zh: '混配（桶混）', ms: 'Campur dalam tangki' },
    means: {
      en: 'Mixing two or more products in the same sprayer tank. It saves a trip, but some mixes curdle, burn leaves or weaken each other — follow the mixing order and the labels.',
      zh: '把两种或以上的药放在同一个喷雾桶里一起喷。可以省一次工，但有些组合会结块、烧叶或互相削弱药效——要按加药顺序和标签来做。',
      ms: 'Mencampurkan dua atau lebih produk dalam tangki penyembur yang sama. Ia menjimatkan satu pusingan, tetapi sesetengah campuran menggumpal, membakar daun atau saling melemahkan — ikut turutan campuran dan label.',
    },
  },
  {
    id: 'spreader',
    match: { en: ['surfactants?', 'spreaders?', 'wetting agents?', 'adjuvants?'], zh: ['展着剂', '表面活性剂', '助剂'], ms: ['surfaktan', 'bahan pembasah', 'bahan penyebar'] },
    word: { en: 'Spreader (surfactant)', zh: '展着剂（表面活性剂）', ms: 'Bahan penyebar (surfaktan)' },
    means: {
      en: 'An additive that helps spray droplets spread and stick on waxy leaves instead of beading and rolling off. Too much can burn leaves or flowers.',
      zh: '一种添加剂，让药液在有蜡质的叶面上铺开、粘住，而不是结成水珠滚掉。加太多会烧叶或伤花。',
      ms: 'Bahan tambahan yang membantu titisan semburan merebak dan melekat pada daun berlilin, bukannya bergolek jatuh. Terlalu banyak boleh membakar daun atau bunga.',
    },
  },
  {
    id: 'phytotox',
    match: { en: ['phytotoxic(?:ity)?', 'leaf burn'], zh: ['药害'], ms: ['fitotoksik(?:siti)?'] },
    word: { en: 'Phytotoxicity', zh: '药害', ms: 'Fitotoksisiti' },
    means: {
      en: 'Damage to the plant caused by the spray itself — burnt leaf edges, spotted fruit, dropped flowers. Common causes: too strong a mix, hot midday spraying, or a bad tank-mix.',
      zh: '药本身对植物造成的伤害——叶边焦枯、果面斑点、落花。常见原因：浓度太高、中午高温喷药，或混配不当。',
      ms: 'Kerosakan pada pokok yang disebabkan oleh semburan itu sendiri — tepi daun terbakar, buah bertompok, bunga gugur. Punca biasa: campuran terlalu pekat, menyembur pada tengah hari panas, atau campuran tangki yang tidak serasi.',
    },
  },
  {
    id: 'canker',
    match: { en: ['cankers?'], zh: ['溃疡'], ms: ['kanker'] },
    word: { en: 'Canker', zh: '溃疡（腐烂斑）', ms: 'Kanker' },
    means: {
      en: 'A patch of dead, often sunken and oozing bark on the trunk or branches, killed by a disease (in durian usually Phytophthora). If it rings the trunk, the tree above it dies.',
      zh: '树干或枝条上一块坏死的树皮，常常凹陷、流胶，是病害造成的（榴莲上多半是疫霉）。如果绕树干一圈，上面的树就会死。',
      ms: 'Tompok kulit kayu yang mati, selalunya cekung dan mengeluarkan getah, pada batang atau dahan, akibat penyakit (pada durian biasanya Phytophthora). Jika ia mengelilingi batang, pokok di atasnya akan mati.',
    },
  },
  {
    id: 'dieback',
    match: { en: ['die-?back'], zh: ['枝枯'], ms: ['mati rosot'] },
    word: { en: 'Dieback', zh: '枝枯', ms: 'Mati rosot' },
    means: {
      en: 'Shoots and branches dying from the tip backwards. A symptom, not one disease: it can come from root rot, canker, borers or drought — find the cause.',
      zh: '枝梢从尖端往回枯死。这是症状，不是单一的病：可能是根腐、溃疡、钻蛀害虫或干旱造成的——要找出原因。',
      ms: 'Pucuk dan dahan mati dari hujung ke belakang. Ia simptom, bukan satu penyakit: boleh berpunca daripada reput akar, kanker, pengorek atau kemarau — cari puncanya.',
    },
  },
  {
    id: 'spore',
    match: { en: ['spores?', 'sporangia'], zh: ['孢子'], ms: ['spora'] },
    word: { en: 'Spores', zh: '孢子', ms: 'Spora' },
    means: {
      en: 'The tiny "seeds" of fungi and water moulds, spread by rain splash, wind and water. Wet weather means more spores — which is why sprays are timed before rain and on new flush.',
      zh: '真菌和水霉的微小“种子”，靠雨水飞溅、风和水传播。天气湿，孢子就多——所以要在下雨前和抽新梢时喷药。',
      ms: '"Benih" halus kulat dan kulat air, disebarkan oleh percikan hujan, angin dan air. Cuaca basah bermakna lebih banyak spora — sebab itu semburan dibuat sebelum hujan dan pada pucuk baru.',
    },
  },
  {
    id: 'formulation',
    match: { en: ['EC', 'SC', 'WP', 'WG', 'formulations?'], zh: ['乳油', '悬浮剂', '可湿性粉剂', '水分散粒剂', '剂型'], ms: ['EC', 'SC', 'WP', 'WG', 'formulasi'] },
    cs: true,
    word: { en: 'Formulation (EC, SC, WP, WG)', zh: '剂型（乳油EC、悬浮剂SC、可湿性粉剂WP、水分散粒剂WG）', ms: 'Formulasi (EC, SC, WP, WG)' },
    means: {
      en: 'The form the product comes in, printed after the name: EC = emulsifiable concentrate (oily liquid), SC = suspension concentrate (thick liquid), WP = wettable powder, WG = water-dispersible granules. It decides the mixing order in the tank.',
      zh: '产品的形态，印在名称后面：EC＝乳油（油状液体），SC＝悬浮剂（浓稠液体），WP＝可湿性粉剂，WG＝水分散粒剂。它决定了在桶里加药的先后顺序。',
      ms: 'Bentuk produk, dicetak selepas nama: EC = pekatan boleh emulsi (cecair berminyak), SC = pekatan ampaian (cecair pekat), WP = serbuk boleh basah, WG = butiran serak air. Ia menentukan turutan mencampur dalam tangki.',
    },
  },
  {
    id: 'ph',
    match: { en: ['pH'], zh: ['pH'], ms: ['pH'] },
    cs: true,
    word: { en: 'Water pH', zh: '水的pH值', ms: 'pH air' },
    means: {
      en: 'How acid or alkaline the spray water is (7 is neutral). Many insecticides break down within hours in alkaline water (above 7), so adjust the water first if it is hard or alkaline.',
      zh: '喷雾用水的酸碱度（7是中性）。很多杀虫剂在碱性水（高于7）里几个小时就会分解，所以水质硬或偏碱时要先调水。',
      ms: 'Tahap keasidan atau kealkalian air semburan (7 ialah neutral). Banyak racun serangga terurai dalam beberapa jam dalam air beralkali (melebihi 7), jadi laraskan air dahulu jika ia keras atau beralkali.',
    },
  },
  {
    id: 'ipm',
    match: { en: ['IPM'], zh: ['综合防治'], ms: ['IPM'] },
    cs: true,
    word: { en: 'IPM (integrated pest management)', zh: '综合防治（IPM）', ms: 'IPM (pengurusan perosak bersepadu)' },
    means: {
      en: 'Using every tool together — checking the trees, good orchard care, natural enemies, organic and chemical sprays only when needed and in rotation — so pests stay low and sprays keep working.',
      zh: '把所有方法结合起来——巡查果树、做好果园管理、利用天敌，只在需要时才用有机或化学药剂并且轮换——让虫害保持在低水平，药也一直有效。',
      ms: 'Menggunakan semua kaedah bersama — memeriksa pokok, penjagaan kebun yang baik, musuh semula jadi, semburan organik dan kimia hanya bila perlu dan secara giliran — supaya perosak kekal rendah dan semburan terus berkesan.',
    },
  },
];

const esc = (lang) => (lang === 'zh' ? ['', ''] : ['(?<![A-Za-z])', '(?![A-Za-z])']);
const cache = {};
/** Compiled matchers for one language: [{ id, re }] plus one combined regex. */
export function glossaryMatcher(lang) {
  if (cache[lang]) return cache[lang];
  const [pre, post] = esc(lang);
  const parts = [];
  const entries = GLOSSARY.map(e => {
    const pats = (e.match[lang] || e.match.en).slice().sort((a, b) => b.length - a.length);
    const flags = e.cs || lang === 'zh' ? 'u' : 'iu';
    const re = new RegExp(`^(?:${pats.join('|')})$`, flags);
    for (const p of pats) parts.push({ src: `${pre}(?:${p})${post}`, cs: !!(e.cs || lang === 'zh'), len: p.length });
    return { id: e.id, re };
  });
  // Longest first so "cross-resistance" wins over "resistance".
  parts.sort((a, b) => b.len - a.len);
  // Case-insensitive parts use (?i)-free inline sets: build two regexes and merge by position.
  const ci = parts.filter(p => !p.cs).map(p => p.src);
  const cs = parts.filter(p => p.cs).map(p => p.src);
  cache[lang] = {
    entries,
    ci: ci.length ? new RegExp(ci.join('|'), 'giu') : null,
    cs: cs.length ? new RegExp(cs.join('|'), 'gu') : null,
  };
  return cache[lang];
}

/** Split text into [string | {id, text}] pieces; only the first use of each term is marked. */
export function glossSplit(text, lang) {
  if (typeof text !== 'string' || !text) return [text];
  const m = glossaryMatcher(lang);
  const hits = [];
  for (const re of [m.ci, m.cs]) {
    if (!re) continue;
    re.lastIndex = 0;
    for (const x of text.matchAll(re)) hits.push({ start: x.index, end: x.index + x[0].length, text: x[0] });
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const out = []; const seen = new Set(); let pos = 0;
  for (const h of hits) {
    if (h.start < pos) continue; // overlapped by an earlier, longer match
    const e = m.entries.find(en => en.re.test(h.text));
    if (!e || seen.has(e.id)) continue;
    seen.add(e.id);
    if (h.start > pos) out.push(text.slice(pos, h.start));
    out.push({ id: e.id, text: h.text });
    pos = h.end;
  }
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}

export const glossById = (id) => GLOSSARY.find(e => e.id === id);
