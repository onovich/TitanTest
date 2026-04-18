function createPortrait(assetDir, recommended, candidates, selectedId = null, selectedOverrides = {}) {
  const normalizedCandidates = candidates.map((candidate, index) => ({
    id: index + 1,
    src: `/portraits/${assetDir}/${String(index + 1).padStart(2, '0')}.png`,
    ...candidate,
  }));

  const selectedCandidate = normalizedCandidates.find((candidate) => candidate.id === selectedId);

  return {
    assetDir,
    selected: selectedCandidate
      ? {
          ...selectedCandidate,
          sourceSrc: selectedCandidate.src,
          src: `/portraits-selected/${assetDir}.png`,
          ...selectedOverrides,
        }
      : null,
    recommended,
    candidates: normalizedCandidates,
  };
}

export const PORTRAITS = {
  '艾伦·耶格尔': createPortrait('eren_yeager', [1, 2], [
    { fileTitle: 'Eren_Yeager_character_image.png', note: '标准角色图。' },
    { fileTitle: 'Eren_Yeager_character_image_(850).png', note: '850 时期版。' },
    { fileTitle: 'Eren_Yeager_square_picture.png', note: '更接近头像裁切。' },
  ], 3),
  '阿明·阿诺德': createPortrait('armin_arlert', [1, 3], [
    { fileTitle: 'Armin_Arlert_character_image.png', note: '通用半身立绘。' },
    { fileTitle: 'Armin_Arlert_character_image_(850).png', note: '850 时期版。' },
    { fileTitle: 'Armin_Arlert_artwork.png', note: '宣传图感更强。' },
  ], 3, { objectPosition: 'center 22%' }),
  '三笠·阿克曼': createPortrait('mikasa_ackerman', [1, 3], [
    { fileTitle: 'Mikasa_Ackerman_character_image.png', note: '通用首选。' },
    { fileTitle: 'Mikasa_Ackerman_character_image_(854).png', note: '后期角色图。' },
    { fileTitle: 'Mikasa_Ackermann_(Anime)_character_image.png', note: '动画新版立绘。' },
  ], 3),
  '艾尔文·史密斯': createPortrait('erwin_smith', [1, 2], [
    { fileTitle: 'Erwin_Smith_character_image.png', note: '标准半身图。' },
    { fileTitle: 'Erwin_Smith_(Anime)_character_image.png', note: '动画版更清晰。' },
  ], 2),
  '利威尔·阿克曼': createPortrait('levi_ackerman', [1, 3], [
    { fileTitle: 'Levi_Ackerman_character_image.png', note: '常规首选。' },
    { fileTitle: 'Levi_Ackermann_(Anime)_character_image.png', note: '动画新版立绘。' },
    { fileTitle: 'Levi_Ackermann_(Anime)_character_image_(854).png', note: '后期动画角色图。' },
  ], 3),
  '莱纳·布朗': createPortrait('reiner_braun', [1, 2], [
    { fileTitle: 'Reiner_Braun_character_image.png', note: '默认头像优选。' },
    { fileTitle: 'Reiner_Braun_(Anime)_character_image_(854).png', note: '后期造型更稳重。' },
  ], 2),
  '吉克·耶格尔': createPortrait('zeke_yeager', [1, 2], [
    { fileTitle: 'Zeke_Yeager_character_image.png', note: '默认候选。' },
    { fileTitle: 'Zeke_Yeager_character_image_(850).png', note: '850 时期版。' },
    { fileTitle: 'Zeke_Yeager_character_image_(832).png', note: '更年轻时期版。' },
  ], 2),
  '阿尼·利昂纳德': createPortrait('annie_leonhart', [1, 2], [
    { fileTitle: 'Annie_Leonhart_character_image.png', note: '经典立绘。' },
    { fileTitle: 'Annie_Leonhart_(Anime)_character_image_(854).png', note: '后期版本更清晰。' },
  ], 2),
  '贝特霍尔德·胡佛': createPortrait('bertolt_hoover', [1, 2], [
    { fileTitle: 'Bertolt_Hoover_character_image.png', note: '稳定的半身候选。' },
    { fileTitle: 'Bertolt_Hoover_character_image_(845).png', note: '845 时期版。' },
    { fileTitle: 'Bertolt_Hoover_(School_Castes)_character_image.png', note: '衍生版，色彩更活。' },
  ], 1),
  '让·基尔希斯坦': createPortrait('jean_kirschtein', [1, 2], [
    { fileTitle: 'Jean_Kirschtein_(Anime)_character_image.png', note: '动画版常规候选。' },
    { fileTitle: 'Jean_Kirschtein_(Anime)_character_image_(854).png', note: '后期角色图。' },
  ], 1),
  '格里沙·耶格尔': createPortrait('grisha_yeager', [1, 2], [
    { fileTitle: 'Grisha_Yeager_character_image.png', note: '默认立绘。' },
    { fileTitle: 'Grisha_Yeager_character_image_(832).png', note: '832 时期版。' },
    { fileTitle: 'Grisha_Yeager_character_image_(817).png', note: '更年轻时期版。' },
  ], 1),
  '艾伦·克鲁格': createPortrait('eren_kruger', [1, 2], [
    { fileTitle: 'Eren_Kruger_character_image.png', note: '正传默认候选。' },
    { fileTitle: 'Eren_Kruger_(Anime)_character_image.png', note: '动画版更清晰。' },
  ], 2),
  '肯尼·阿克曼': createPortrait('kenny_ackerman', [1, 3], [
    { fileTitle: 'Kenny_Ackerman_character_image.png', note: '默认首选。' },
    { fileTitle: 'Kenny_Ackerman_character_image_(842).png', note: '842 时期版。' },
    { fileTitle: 'Kenny_Ackermann_(Anime)_character_image.png', note: '动画版更清晰。' },
  ], 3),
  '威利·戴巴': createPortrait('willy_tybur', [1, 2], [
    { fileTitle: 'Willy_Tybur_character_image.png', note: '默认正式半身候选。' },
    { fileTitle: 'Willy_Tybur_(Anime)_character_image.png', note: '动画版画质更好。' },
  ], 2),
  '弗洛克·福斯特': createPortrait('floch_forster', [1, 2], [
    { fileTitle: 'Floch_Forster_character_image.png', note: '稳定默认候选。' },
    { fileTitle: 'Floch_Forster_(Anime)_character_image.png', note: '动画版更清楚。' },
  ], 2),
  '贾碧·布朗': createPortrait('gabi_braun', [1, 2], [
    { fileTitle: 'Gabi_Braun_character_image.png', note: '默认半身图。' },
    { fileTitle: 'Gabi_Braun_(Anime)_character_image.png', note: '动画版面部细节更清楚。' },
  ], 1),
  '多托·匹西斯': createPortrait('dot_pyxis', [1, 2], [
    { fileTitle: 'Dot_Pyxis_(Anime)_character_image.png', note: '候选已记录，待补下载与裁切。' },
    { fileTitle: 'Dot_Pixis_character_image.png', note: '漫画系候选，待核对清晰度。' },
  ]),
  '尤弥尔·弗里茨': createPortrait('ymir_fritz', [1, 2], [
    { fileTitle: 'Ymir_Fritz_character_image.png', note: '默认半身图。' },
    { fileTitle: 'Ymir_Fritz_(Anime)_character_image.png', note: '动画版更清楚。' },
  ], 2),
  '达里斯·萨克雷': createPortrait('dhalis_zachary', [1, 2], [
    { fileTitle: 'Dhalis_Zachary_(Anime)_character_image.png', note: '候选已记录，待补下载与裁切。' },
    { fileTitle: 'Darius_Zackly_character_image.png', note: '漫画页别名候选，待核对文件名。' },
  ]),
  '萨莎·布劳斯': createPortrait('sasha_blouse', [1, 2], [
    { fileTitle: 'Sasha_Blouse_character_image.png', note: '标准角色图。' },
    { fileTitle: 'Sasha_Blouse_character_image_(850).png', note: '850 时期版。' },
    { fileTitle: 'Sasha_Blouse_(School_Castes)_character_image.png', note: '衍生版，画面更鲜亮。' },
  ], 2),
};