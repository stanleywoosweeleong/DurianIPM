// "Dieback or Fusarium?" — shown on both group pages (canker-dieback, fusarium).
// Every row says where it comes from: a durian study (numbered source) or general
// plant pathology. Nothing here is a lab-grade test; the card says so.
const s3 = (en, zh, ms) => ({ en, zh, ms });

export const TELL_APART_GROUPS = ['canker-dieback', 'fusarium'];

export const TELL_APART = {
  title: s3('Dieback or Fusarium? How to tell', '枝枯还是镰刀菌？怎么分', 'Mati rosot atau Fusarium? Cara membezakan'),
  hint: s3('6 checks, a bag test, and what to do either way', '6 个检查、一个袋子测试，以及两种情况的做法', '6 semakan, ujian beg, dan apa perlu dibuat'),
  intro: s3(
    'Both are true fungi that kill branches, and in Eastern Thailand both were shown to cause durian stem rot [1]. No single check below is proof. Look for two or more that agree.',
    '两者都是会让枝条枯死的真菌，泰国东部的研究证实两者都会引起榴莲茎腐 [1]。下面任何一条单独都不能定案，要找两条以上相符的。',
    'Kedua-duanya kulat sebenar yang mematikan dahan, dan di Timur Thailand kedua-duanya terbukti menyebabkan reput batang durian [1]. Tiada satu semakan di bawah yang menjadi bukti sendiri. Cari dua atau lebih yang sepadan.'),
  head: { check: s3('Check', '看什么', 'Semak'), dieback: s3('Dieback', '枝枯', 'Mati rosot'), fusarium: s3('Fusarium', '镰刀菌', 'Fusarium') },
  rows: [
    {
      check: s3('The leaves', '叶子', 'Daun'),
      dieback: s3('Dead leaves often stay hanging on', '枯叶常挂在枝上不掉', 'Daun kering selalunya kekal melekat'),
      fusarium: s3('Turn yellow and drop within 5–7 days', '5–7 天内发黄脱落', 'Menguning dan gugur dalam 5–7 hari'),
      basis: s3('Fusarium: durian study [2]. Dieback: general plant pathology.', '镰刀菌：榴莲研究 [2]。枝枯：一般植物病理。', 'Fusarium: kajian durian [2]. Mati rosot: patologi tumbuhan umum.'),
    },
    {
      check: s3('Hand lens on the dead bark', '放大镜看枯死的树皮', 'Kanta pembesar pada kulit yang mati'),
      dieback: s3('Pinhead black dots, hard, will not rub off', '针尖大小的黑点，硬，抹不掉', 'Bintik hitam sebesar kepala jarum, keras, tidak tanggal bila digosok'),
      fusarium: s3('No black dots', '没有黑点', 'Tiada bintik hitam'),
      basis: s3('General mycology: the dots are the fruiting bodies of the dieback fungi; Fusarium does not make them.', '一般真菌学：黑点是枝枯真菌的产孢结构，镰刀菌不会长。', 'Mikologi umum: bintik itu jasad berbuah kulat mati rosot; Fusarium tidak menghasilkannya.'),
    },
    {
      check: s3('Pinholes with fine sawdust', '带细木屑的针孔', 'Lubang jarum dengan habuk halus'),
      dieback: s3('Not typical', '不常见', 'Tidak biasa'),
      fusarium: s3('Often there — but pinhole borers also come to Phytophthora-rotted bark', '常有——但小蠹也会找被疫霉烂掉的树皮', 'Selalunya ada — tetapi kumbang lubang jarum juga datang ke kulit yang direputkan Phytophthora'),
      basis: s3('Durian study: a pinhole borer was linked with Fusarium solani [2].', '榴莲研究：发现一种小蠹与腐皮镰刀菌有关联 [2]。', 'Kajian durian: sejenis kumbang lubang jarum dikaitkan dengan Fusarium solani [2].'),
    },
    {
      check: s3('Ooze from cracks', '裂口流出的液体', 'Lelehan dari rekahan'),
      dieback: s3('—', '—', '—'),
      fusarium: s3('Sticky, yellow-brown', '黏稠，黄褐色', 'Melekit, kuning perang'),
      basis: s3('Durian study [3]. Phytophthora ooze is rust-coloured and the rot under the bark is wet.', '榴莲研究 [3]。疫霉流的是铁锈色胶，树皮下是湿烂。', 'Kajian durian [3]. Lelehan Phytophthora berwarna karat dan reput di bawah kulit basah.'),
    },
    {
      check: s3('Where it started', '从哪里开始', 'Di mana ia bermula'),
      dieback: s3('A pruning cut, broken branch or sunburnt bark', '修剪伤口、断枝或日灼的树皮', 'Luka pangkasan, dahan patah atau kulit terbakar matahari'),
      fusarium: s3('A branch fork, the branches or the trunk', '枝杈、枝条或树干', 'Cabang dahan, dahan atau batang'),
      basis: s3('Fusarium: durian studies [2][3]. Dieback: general plant pathology.', '镰刀菌：榴莲研究 [2][3]。枝枯：一般植物病理。', 'Fusarium: kajian durian [2][3]. Mati rosot: patologi tumbuhan umum.'),
    },
    {
      check: s3('Mould on the lesion', '病斑上的霉层', 'Kulapuk pada lesi'),
      dieback: s3('—', '—', '—'),
      fusarium: s3('White, pink or orange powdery mould', '粉白、粉红或橙色粉状霉层', 'Kulapuk berdebu putih, merah jambu atau jingga'),
      basis: s3('General mycology. The durian studies did not report it, so not seeing it does not rule Fusarium out.', '一般真菌学。榴莲研究都没有报告这一点，所以没看到并不能排除镰刀菌。', 'Mikologi umum. Kajian durian tidak melaporkannya, jadi tidak nampak bukan bermakna bukan Fusarium.'),
    },
  ],
  bagTitle: s3('A bag test you can try — one of the ways', '可以试的袋子测试——方法之一', 'Ujian beg yang boleh dicuba — salah satu cara'),
  bag: s3(
    'Cut a small piece from the edge of the lesion, where healthy and diseased bark meet. Put it in a clear plastic bag with a damp tissue, close it, and keep it in the shade for 3–5 days. Grey-black fungus that grows fast, or black dots, points to dieback. White to pink cottony growth points to Fusarium. This is how the two grew on lab plates in the Thai study: Fusarium white and cottony; Lasiodiplodia white and woolly, growing fast and turning dark grey within a week [1]. A bag is not a lab plate, and other fungi grow on dead bark too — treat it as a clue, not proof.',
    '在病斑边缘（病健交界处）切一小块，放进透明塑料袋，加一张湿纸巾，封好，放在阴凉处 3–5 天。长出生长很快的灰黑色菌，或出现黑点，指向枝枯；长出白色至粉红色棉絮状的菌，指向镰刀菌。泰国研究在实验室培养皿上看到的就是这样：镰刀菌白色棉絮状；毛色二孢白色绒毛状，长得快，一周内变深灰色 [1]。袋子不是实验室培养皿，枯树皮上也会长其他杂菌——只能当线索，不能当证据。',
    'Potong sedikit dari pinggir lesi, di sempadan kulit sihat dan berpenyakit. Masukkan dalam beg plastik jernih bersama tisu lembap, tutup, dan simpan di tempat teduh 3–5 hari. Kulat kelabu hitam yang tumbuh cepat, atau bintik hitam, menunjuk kepada mati rosot. Pertumbuhan seperti kapas putih hingga merah jambu menunjuk kepada Fusarium. Beginilah kedua-duanya tumbuh di atas piring makmal dalam kajian Thailand: Fusarium putih seperti kapas; Lasiodiplodia putih berbulu, tumbuh cepat dan menjadi kelabu gelap dalam seminggu [1]. Beg bukan piring makmal, dan kulat lain juga tumbuh pada kulit mati — anggap ia petunjuk, bukan bukti.'),
  lab: s3(
    'Only a lab can be sure: the Thai researchers grew the fungus and checked its DNA [1]. Ask your state Department of Agriculture office whether they take plant samples.',
    '只有实验室能确定：泰国研究人员是把菌培养出来再验 DNA [1]。可以问问州农业局办事处是否接收植物样本。',
    'Hanya makmal yang boleh pasti: penyelidik Thailand mengkultur kulat itu dan memeriksa DNAnya [1]. Tanya pejabat Jabatan Pertanian negeri anda sama ada mereka menerima sampel tumbuhan.'),
  sameTitle: s3('Either way, the first steps are the same', '不管是哪一种，前几步都一样', 'Apa pun jenisnya, langkah pertama sama'),
  same: [
    s3('Cut back to healthy wood, burn the prunings, and seal the cuts the same day with Trichoderma paste.', '剪到健康木质部，剪下的烧掉，切口当天涂木霉膏封好。', 'Potong hingga kayu sihat, bakar sisa pangkasan, dan tutup luka pada hari yang sama dengan pes Trichoderma.'),
    s3('If it is Fusarium: also deal with the pinhole borers and burn bored dead wood. No spray has been tested against Fusarium on durian.', '如果是镰刀菌：还要处理小蠹，被蛀的枯木也要烧掉。榴莲上还没有针对镰刀菌试验过的药。', 'Jika Fusarium: kawal juga kumbang lubang jarum dan bakar kayu mati yang dikorek. Belum ada semburan yang diuji terhadap Fusarium pada durian.'),
    s3('If it is dieback: fungicide paint on the cuts (triazoles, copper) has evidence from other crops.', '如果是枝枯：切口涂杀菌剂（三唑类、铜剂）在其他作物上有证据。', 'Jika mati rosot: racun kulat yang disapu pada luka (triazol, kuprum) ada bukti daripada tanaman lain.'),
  ],
  phyto: s3(
    'The split that matters most comes first: a wet canker with rust-coloured ooze and wet, reddish-brown rot under the bark is Phytophthora. That needs different medicine — check for it before anything else.',
    '最要紧的区分先做：湿润的溃疡、流铁锈色胶、树皮下是红褐色湿烂，那是疫霉，用药完全不同——先排除它。',
    'Pembezaan paling penting dibuat dahulu: kanker basah dengan lelehan warna karat dan reput basah perang kemerahan di bawah kulit ialah Phytophthora. Ia perlukan ubat yang berbeza — periksa itu sebelum yang lain.'),
  srcTitle: s3('Sources for this card', '本卡片的出处', 'Sumber kad ini'),
  durian: s3('Durian study', '榴莲研究', 'Kajian durian'),
  pdf: s3('Free PDF', '免费 PDF', 'PDF percuma'),
  sources: [
    {
      n: 1,
      t: 'Chantarasiri A. & Boontanom P. (2021). Fusarium solani and Lasiodiplodia pseudotheobromae, fungal pathogens causing stem rot disease on durian trees (Durio zibethinus) in Eastern Thailand. New Disease Reports 44: e12026.',
      url: 'https://doi.org/10.1002/ndr2.12026',
      pdf: 'https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/ndr2.12026',
      note: s3('30 bark and wood samples from Rayong and Chanthaburi orchards; both fungi caused lesions when put into durian seedlings; colony looks on lab plates.', '采自罗勇府和尖竹汶府果园的 30 份树皮与木质部样本；两种菌接种到榴莲幼苗上都引起病斑；实验室培养皿上的菌落样子。', '30 sampel kulit dan kayu dari kebun di Rayong dan Chanthaburi; kedua-dua kulat menyebabkan lesi bila dimasukkan ke anak benih durian; rupa koloni di atas piring makmal.'),
    },
    {
      n: 2,
      t: 'Pongpisutta R., Keawmanee P., Sanguansub S., et al. (2023). Comprehensive investigation of die-back disease caused by Fusarium in durian. Plants 12(17): 3045.',
      url: 'https://doi.org/10.3390/plants12173045',
      pdf: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10490359/',
      note: s3('Thai durian dieback: F. solani and F. incarnatum; leaves yellow and drop in 5–7 days; brown-to-black wood; the pinhole borer Euwallacea similis linked with F. solani.', '泰国榴莲枝枯：腐皮镰刀菌和半裸镰刀菌；叶片 5–7 天内黄落；木质部褐至黑色；小蠹 Euwallacea similis 与腐皮镰刀菌有关联。', 'Mati rosot durian di Thailand: F. solani dan F. incarnatum; daun menguning dan gugur dalam 5–7 hari; kayu perang hingga hitam; kumbang Euwallacea similis dikaitkan dengan F. solani.'),
    },
    {
      n: 3,
      t: 'Jiang W., Wei H., Gao H., et al. (2026). Isolation, molecular characterization, and biological control of Fusarium solani causing stem rot of durian tree in China. Pathogens 15(8): 849.',
      url: 'https://doi.org/10.3390/pathogens15080849',
      pdf: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13516780/',
      note: s3('Hainan: rough grey-white lesions on branches and forks, sticky yellow-brown ooze from cracks, brown-black bark underneath.', '海南：枝条和分叉处粗糙的灰白色病斑，裂口流出黏稠黄褐色液体，剥皮可见褐黑色。', 'Hainan: lesi kasar putih kelabu pada dahan dan cabang, lelehan melekit kuning perang dari rekahan, kulit perang kehitaman di bawahnya.'),
    },
  ],
  general: s3('Where a row says "general", it comes from plant pathology and other crops, not from a durian study.', '注明“一般”的内容来自植物病理学和其他作物，不是榴莲研究。', 'Jika baris menyebut "umum", ia datang daripada patologi tumbuhan dan tanaman lain, bukan kajian durian.'),
};
