// Problems that travel together. Shown on each page as "Often comes with",
// so a farmer who finds pinholes also checks for the diseases the beetles bring.
// Every link states WHY, from the sources on the linked pages.
const s = (en, zh) => ({ en, zh });
export const RELATED = {
  'shot-hole': [
    ['fusarium', s('The beetles carry Fusarium in their bodies and farm it in the holes; in Thai orchards it caused branch dieback.', '小蠹体内携带镰刀菌，并在虫道里种菌；在泰国果园里它引起了枝枯。')],
    ['oomycete', s('The beetles are drawn to bark that Phytophthora is already rotting — scrape around the pinholes to check.', '小蠹专找已被疫霉烂掉的树皮——刮开针孔周围看一看。')],
  ],
  fusarium: [
    ['shot-hole', s('Ambrosia beetles carry this fungus into the tree. Pinholes and fine sawdust nearby mean both need treating.', '小蠹虫把这种菌带进树里。附近有针孔和细木屑，说明两样都要处理。')],
  ],
  oomycete: [
    ['shot-hole', s('Pinhole borers gather on Phytophthora-rotted bark, and their holes let more disease in.', '针孔小蠹聚集在被疫霉烂掉的树皮上，它们的孔又让更多病菌进入。')],
  ],
};
