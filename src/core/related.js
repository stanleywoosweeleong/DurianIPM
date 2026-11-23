// Problems that travel together. Shown on each page as "Often comes with",
// so a farmer who finds pinholes also checks for the diseases the beetles bring.
// Every link states WHY, from the sources on the linked pages.
const s = (en, zh) => ({ en, zh });
export const RELATED = {
  'shot-hole': [
    ['fusarium', s('A Thai durian study found an ambrosia beetle carrying Fusarium solani, the fungus behind branch dieback there.', '泰国一项榴莲研究发现，一种小蠹携带腐皮镰刀菌——当地枝枯病的病原。')],
    ['oomycete', s('The beetles are drawn to bark that Phytophthora is already rotting — scrape around the pinholes to check.', '小蠹专找已被疫霉烂掉的树皮——刮开针孔周围看一看。')],
  ],
  fusarium: [
    ['canker-dieback', { en: 'Both are true fungi that kill branches, and in Eastern Thailand Fusarium and Lasiodiplodia were found together in durian stem rot. Scrape the edge: pinpoint black dots point to the dieback fungi, white-to-pink spore pads to Fusarium. The clean-up is the same: cut out dead wood, burn it, seal the cuts.', zh: '两者都是会让枝条枯死的真菌，泰国东部的榴莲茎腐中曾同时分离到镰刀菌和毛色二孢。刮开病斑边缘看：针尖黑点指向枝枯真菌，白色至粉红色孢子垫指向镰刀菌。清理方法一样：锯掉枯木、烧掉、封好切口。', ms: 'Kedua-duanya kulat sebenar yang mematikan dahan, dan di Timur Thailand Fusarium dan Lasiodiplodia ditemui bersama dalam reput batang durian. Kikis pinggirnya: bintik hitam halus menunjukkan kulat mati rosot, pad spora putih hingga merah jambu menunjukkan Fusarium. Pembersihannya sama: potong kayu mati, bakar, tutup kesan potongan.' }],
    ['shot-hole', s('An ambrosia beetle was found carrying Fusarium solani in Thai durian. Pinholes and fine sawdust nearby mean both need treating.', '在泰国榴莲上发现小蠹携带腐皮镰刀菌。附近有针孔和细木屑，说明两样都要处理。')],
  ],
  'bark-borers': [
    ['oomycete', { en: 'In Malaysia, clearwing borers are recorded attacking the trunk after Phytophthora. Gum on the bark can be either — scrape to check.', zh: '马来西亚记录显示，透翅蛾常在疫霉之后侵害树干。树皮流胶两者都有可能——刮开看看。', ms: 'Di Malaysia, pengorek sayap jernih direkodkan menyerang batang selepas Phytophthora. Getah pada kulit boleh jadi salah satu — kikis untuk memeriksa.' }],
  ],
  oomycete: [
    ['canker-dieback', { en: 'Dieback high in the branches, with sunken bark and pinpoint black dots or a pink crust, is a true fungus instead — Phytophthora fungicides will not touch it.', zh: '如果是树冠高处的枝枯，树皮凹陷、有针尖黑点或粉红菌壳，那是真菌——防疫霉的药对它没用。', ms: 'Mati rosot tinggi di dahan, dengan kulit cekung dan bintik hitam halus atau kerak merah jambu, ialah kulat sebenar — racun kulat Phytophthora tidak berkesan padanya.' }],
    ['bark-borers', { en: 'Clearwing caterpillars follow Phytophthora into the trunk. Brown frass mixed with the gum means borers are in too.', zh: '透翅蛾幼虫会跟着疫霉侵入树干。流胶里混有褐色虫粪，说明蛀虫也进去了。', ms: 'Ulat sayap jernih mengikut Phytophthora masuk ke batang. Najis perang bercampur getah bermakna pengorek juga ada.' }],
    ['shot-hole', s('Pinhole borers gather on Phytophthora-rotted bark, and their holes let more disease in.', '针孔小蠹聚集在被疫霉烂掉的树皮上，它们的孔又让更多病菌进入。')],
  ],
  'canker-dieback': [
    ['fusarium', { en: 'Fast dieback where leaves yellow and drop within a week, the wood is brown-black inside and there are beetle pinholes, is more likely Fusarium. The two were found together in durian stem rot in Eastern Thailand.', zh: '如果枝枯来得快，叶片一周内发黄脱落，木质部内呈褐黑色，还有小蠹针孔，更可能是镰刀菌。泰国东部的榴莲茎腐中曾同时发现这两种菌。', ms: 'Mati rosot yang cepat, dengan daun menguning dan gugur dalam seminggu, kayu perang kehitaman di dalam dan ada lubang jarum kumbang, lebih mungkin Fusarium. Kedua-duanya ditemui bersama dalam reput batang durian di Timur Thailand.' }],
    ['oomycete', { en: 'A wet, dark canker on the trunk with reddish-brown ooze is usually Phytophthora. Scrape it: brown, wet rot under the bark points there.', zh: '树干上湿润、深色、流红褐色胶液的溃疡（黑头病）多半是疫霉。刮开看：树皮下是褐色湿烂，就是疫霉。', ms: 'Kanker basah dan gelap pada batang dengan getah perang kemerahan biasanya Phytophthora. Kikis: reput perang dan basah di bawah kulit menunjukkan Phytophthora.' }],
  ],
};
