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
    ['shot-hole', s('An ambrosia beetle was found carrying Fusarium solani in Thai durian. Pinholes and fine sawdust nearby mean both need treating.', '在泰国榴莲上发现小蠹携带腐皮镰刀菌。附近有针孔和细木屑，说明两样都要处理。')],
  ],
  oomycete: [
    ['shot-hole', s('Pinhole borers gather on Phytophthora-rotted bark, and their holes let more disease in.', '针孔小蠹聚集在被疫霉烂掉的树皮上，它们的孔又让更多病菌进入。')],
  ],
};
