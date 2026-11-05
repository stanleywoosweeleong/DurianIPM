// Cover photos — ONE fixed, hand-checked Wikimedia Commons photo per pest group.
//
// Never searched at runtime: a live search returned a crab for shot-hole beetles
// and a groundnut stem for leaf blight. Each photo here was looked at and shows
// the culprit or its damage as a farmer would see it. Groups with no entry show
// no photo on purpose (only wrong-stage, wrong-crop or microscope images exist):
// leaf caterpillars & fruit borers (moths only), Phytophthora & cankers (papaya
// only), nematodes, Rhizoctonia (groundnut), bacterial & leaf spots (other host
// plants — a disease photo must show DURIAN tissue). Insects, mites and fungal
// fruiting bodies look the same on any host, so those photos are kept. Best of all: replace these with real photos
// from Malaysian durian orchards.
//
// To change one: pick a file on commons.wikimedia.org, then copy its thumbnail URL,
// file page URL, author and licence here. Keep the credit; licences require it.

export const COVERS = {
  "phloem-suckers": {
    "title": "File:Toxoptera aurantii.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Toxoptera_aurantii.jpg/330px-Toxoptera_aurantii.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Toxoptera_aurantii.jpg",
    "author": "Jesse Rorabaugh",
    "license": "CC0"
  },
  "scale-mealybug": {
    "title": "File:Coccus hesperidum (10.3897-zookeys.734.22774) Figure 3 (cropped).jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Coccus_hesperidum_%2810.3897-zookeys.734.22774%29_Figure_3_%28cropped%29.jpg/330px-Coccus_hesperidum_%2810.3897-zookeys.734.22774%29_Figure_3_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Coccus_hesperidum_(10.3897-zookeys.734.22774)_Figure_3_(cropped).jpg",
    "author": "Choi J, Lee S (2018) Review of the genus Coccus Linnaeus from Korea, with descri",
    "license": "CC BY 4.0"
  },
  "thrips": {
    "title": "File:Scirtothrips dorsalis 341599216.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Scirtothrips_dorsalis_341599216.jpg/330px-Scirtothrips_dorsalis_341599216.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Scirtothrips_dorsalis_341599216.jpg",
    "author": "余世文",
    "license": "CC0"
  },
  "plant-bugs": {
    "title": "File:Nezara viridula MHNT verte.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Nezara_viridula_MHNT_verte.jpg/330px-Nezara_viridula_MHNT_verte.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Nezara_viridula_MHNT_verte.jpg",
    "author": "Didier Descouens",
    "license": "CC BY-SA 3.0"
  },
  "leaf-beetles": {
    "title": "File:Javanese Grasshopper, Southern Islands, Singapore imported from iNaturalist photo 456659729.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Javanese_Grasshopper%2C_Southern_Islands%2C_Singapore_imported_from_iNaturalist_photo_456659729.jpg/330px-Javanese_Grasshopper%2C_Southern_Islands%2C_Singapore_imported_from_iNaturalist_photo_456659729.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Javanese_Grasshopper,_Southern_Islands,_Singapore_imported_from_iNaturalist_photo_456659729.jpg",
    "author": "(c) Huey, some rights reserved (CC BY)",
    "license": "CC BY 4.0"
  },
  "trunk-borers": {
    "title": "File:Batocera rufomaculata.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Batocera_rufomaculata.jpg/330px-Batocera_rufomaculata.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Batocera_rufomaculata.jpg",
    "author": "Shantanu Kuveskar",
    "license": "CC BY-SA 3.0"
  },
  "shot-hole": {
    "title": "File:Euwallacea fornicatus 495123960.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Euwallacea_fornicatus_495123960.jpg/330px-Euwallacea_fornicatus_495123960.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Euwallacea_fornicatus_495123960.jpg",
    "author": "Ian Webb",
    "license": "CC BY 4.0"
  },
  "soil-pests": {
    "title": "File:Coptotermes formosanus shiraki USGov k8204-7.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Coptotermes_formosanus_shiraki_USGov_k8204-7.jpg/330px-Coptotermes_formosanus_shiraki_USGov_k8204-7.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Coptotermes_formosanus_shiraki_USGov_k8204-7.jpg",
    "author": "Photo by Scott Bauer.",
    "license": "Public domain"
  },
  "ants-wasps": {
    "title": "File:Anoplolepis gracilipes 458690499.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Anoplolepis_gracilipes_458690499.jpg/330px-Anoplolepis_gracilipes_458690499.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Anoplolepis_gracilipes_458690499.jpg",
    "author": "Philipp Hoenle",
    "license": "CC0"
  },
  "mites": {
    "title": "File:Tetranychus-urticae.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Tetranychus-urticae.jpg/330px-Tetranychus-urticae.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Tetranychus-urticae.jpg",
    "author": "J. Holopainen",
    "license": "CC BY-SA 4.0"
  },
  "snails": {
    "title": "File:Giant African land snail (Achatina fulica) Ranomafana.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Giant_African_land_snail_%28Achatina_fulica%29_Ranomafana.jpg/330px-Giant_African_land_snail_%28Achatina_fulica%29_Ranomafana.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Giant_African_land_snail_(Achatina_fulica)_Ranomafana.jpg",
    "author": "Charles J. Sharp",
    "license": "CC BY-SA 4.0"
  },
  "root-fungi": {
    "title": "File:Rigidoporus microporus (12956367564).jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Rigidoporus_microporus_%2812956367564%29.jpg/330px-Rigidoporus_microporus_%2812956367564%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Rigidoporus_microporus_(12956367564).jpg",
    "author": "Dick Culbert from Gibsons, B.C., Canada",
    "license": "CC BY 2.0"
  },
  "epiphytes": {
    "title": "File:Pyrrosia piloselloides duit-duit.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Pyrrosia_piloselloides_duit-duit.jpg/330px-Pyrrosia_piloselloides_duit-duit.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Pyrrosia_piloselloides_duit-duit.jpg",
    "author": "Tu7uh",
    "license": "CC BY 3.0"
  },
  "fruit-flies": {
    "title": "File:Bactrocera dorsalis.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Bactrocera_dorsalis.jpg/330px-Bactrocera_dorsalis.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Bactrocera_dorsalis.jpg",
    "author": "",
    "license": "Public domain"
  },
  "vertebrates": {
    "title": "File:Asian Palm Civet Over A Tree.jpg",
    "thumb": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Asian_Palm_Civet_Over_A_Tree.jpg/330px-Asian_Palm_Civet_Over_A_Tree.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "desc": "https://commons.wikimedia.org/wiki/File:Asian_Palm_Civet_Over_A_Tree.jpg",
    "author": "Praveenp",
    "license": "CC BY-SA 3.0"
  }
};

export const coverFor = (groupId) => COVERS[groupId] || null;
