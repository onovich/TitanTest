import { CHARACTER_TUNING } from './characterTuning.js';

function clampScore(value) {
  return Math.min(10, Math.max(1, value));
}

function applyCharacterTuning(character) {
  const scale = CHARACTER_TUNING.signalScales[character.name] ?? 1;
  const tunedScores = Object.fromEntries(
    Object.entries(character.scores).map(([dimension, value]) => [
      dimension,
      Number(clampScore(5 + (value - 5) * scale).toFixed(3)),
    ])
  );

  return {
    ...character,
    scores: tunedScores,
  };
}

const BASE_CHARACTERS = [
  { name: '艾伦·耶格尔', aliases: ['艾伦 耶格尔'], desc: '把自由置于首位，会主动打破边界，并愿意为终结循环承担极端代价。', scores: { freedom: 10, moral: 10, realism: 4, fatalism: 9, cause: 4 }, quote: '如果有人要夺走我的自由，我就会先夺走他们的自由。' },
  { name: '阿明·阿诺德', aliases: ['阿尔敏 阿诺德'], desc: '重视理解真相、沟通与策略推演，相信主动舍弃一部分才能为更多人争到改变空间。', scores: { freedom: 7, moral: 6, realism: 8, fatalism: 5, cause: 9 }, quote: '什么都无法舍弃的人，什么也改变不了。' },
  { name: '三笠·阿克曼', aliases: ['三笠 阿克曼'], desc: '以守护重要之人为行动核心，决策时常把具体关系放在宏大目标之前。', scores: { freedom: 3, moral: 4, realism: 5, fatalism: 4, cause: 2 }, quote: '这个世界是如此的残酷，却又如此的美丽。' },
  { name: '艾尔文·史密斯', aliases: ['埃尔文 史密斯'], desc: '擅长动员与战略赌博的调查兵团团长，会为突破真相承担高额牺牲。', scores: { freedom: 9, moral: 9, realism: 10, fatalism: 6, cause: 5 }, quote: '士兵们，愤怒吧！士兵们，咆哮吧！士兵们，战斗吧！' },
  { name: '利威尔·阿克曼', aliases: ['利威尔 阿克曼'], desc: '高执行力的前线指挥者，习惯在判断、同伴牺牲与整体结果之间做冷静决定。', scores: { freedom: 4, moral: 5, realism: 8, fatalism: 7, cause: 6 }, quote: '选择吧，是相信自己，还是相信同伴……我不知道正确答案。你只能选择到时候不会后悔的做法。' },
  { name: '莱纳·布朗', aliases: ['莱纳 布朗'], desc: '长期在战士职责、同伴情感与自我罪责之间撕裂的执行者。', scores: { freedom: 4, moral: 8, realism: 7, fatalism: 8, cause: 8 }, quote: '已经太迟了……我已经不知道什么才是对的了。现在的我，只能面对自己犯下的罪，以战士的身份尽到最后。' },
  { name: '吉克·耶格尔', aliases: ['吉克 耶格尔'], desc: '以减少痛苦为目标的极端计划制定者，倾向用冷静计算替代情感希望。', scores: { freedom: 8, moral: 9, realism: 9, fatalism: 6, cause: 8 }, quote: '如果我们打一开始就没出生到这个世界上……就不会受苦了。' },
  { name: '阿尼·利昂纳德', aliases: ['阿妮 利昂纳德'], desc: '疏离而清醒，优先保护少数私人关系，不愿为宏大叙事投入过多热情。', scores: { freedom: 4, moral: 9, realism: 10, fatalism: 8, cause: 1 }, quote: '如果能回到父亲身边……就算重来一次，我也还是会这么做。' },
  { name: '贝特霍尔德·胡佛', aliases: ['贝尔托特 胡佛'], desc: '在看清后果后仍继续执行任务，倾向把自己交给既定角色与结果。', scores: { freedom: 2, moral: 8, realism: 9, fatalism: 10, cause: 6 }, quote: '总得有人去做的，总得有人亲手染上鲜血。' },
  { name: '让·基尔希斯坦', aliases: ['让 基尔希斯坦'], desc: '从自保倾向明显的普通士兵成长为会先看局势、再为同伴和整体扛责的现实派骨干。', scores: { freedom: 6, moral: 4, realism: 8, fatalism: 3, cause: 7 }, quote: '如果我闭上耳朵、躲在房间里不出来……死者的骨灰绝不会原谅我。' },
  { name: '格里沙·耶格尔', aliases: ['格里沙 耶格尔'], desc: '被时代、家人与使命同时推动的人，总想保护亲人，却反复被更大的责任和悔恨裹挟着前进。', scores: { freedom: 5, moral: 7, realism: 4, fatalism: 9, cause: 7 }, quote: '如果早知道自由的代价是这样，我绝不会付出。' },
  { name: '艾伦·克鲁格', aliases: ['艾伦 克鲁格'], desc: '长期潜伏的行动者，为更远的自由目标接受高风险与脏手手段。', scores: { freedom: 9, moral: 10, realism: 8, fatalism: 8, cause: 9 }, quote: '这世上没有所谓的真相。任何人都可能成为神，也可能成为恶魔，只要有人那样宣称。' },
  { name: '肯尼·阿克曼', aliases: ['肯尼 阿克曼'], desc: '以个人欲望和执念驱动行动，对人性保持强烈的犬儒观察。', scores: { freedom: 10, moral: 9, realism: 7, fatalism: 5, cause: 1 }, quote: '人如果不沉迷于某些事物，是撑不下去的。' },
  { name: '威利·戴巴', aliases: ['威利 戴巴'], desc: '以政治叙事和个人牺牲为手段，争取族群生存空间的贵族领袖。', scores: { freedom: 6, moral: 9, realism: 9, fatalism: 7, cause: 10 }, quote: '如果可以选择，我宁愿自己从未出生……但我并不想死。因为……我生在这个世界上。' },
  { name: '弗洛克·福斯特', aliases: ['弗洛克 福斯特'], desc: '把岛内生存放在首位，相信强力动员和极端手段能换来安全。', scores: { freedom: 6, moral: 10, realism: 7, fatalism: 4, cause: 9 }, quote: '如果艾伦死了，帕拉迪岛就会沉入血海！全世界都会向我们复仇！' },
  { name: '贾碧·布朗', aliases: ['加比 布朗'], desc: '从深信敌我宣传到主动修正偏见，学习把敌人重新看作具体的人。', scores: { freedom: 7, moral: 7, realism: 5, fatalism: 6, cause: 9 }, quote: '这座岛上根本没有恶魔……只有和我们一样的人。' },
  {
    name: '多托·匹西斯',
    aliases: ['多托 匹西斯', '匹西斯', '多托·皮克西斯', 'Dot Pyxis'],
    desc: '驻屯兵团南方最高司令官，以人类整体生存为优先，擅长在混乱中重建秩序与士气。',
    scores: { freedom: 5, moral: 8, realism: 9, fatalism: 6, cause: 9 },
    quote: '如果人类会灭亡，不是因为被巨人吃掉，而是因为我们会先自相残杀。',
  },
  {
    name: '尤弥尔·弗里茨',
    aliases: ['尤弥尔'],
    desc: '在长期奴役中失去自主，只能把终结自身服从的可能寄托在他人身上。',
    scores: { freedom: 1, moral: 10, realism: 2, fatalism: 10, cause: 1 },
    quote: '两千年来，我只是一直在等待，等那个终于能替我斩断锁链的人。',
    quoteType: 'inspired',
  },
  {
    name: '达里斯·萨克雷',
    aliases: ['达里斯 萨克雷', '达里斯·扎卡雷', '达里斯·扎卡里', 'Dhalis Zachary', 'Darius Zackly'],
    desc: '掌握军法与裁断权的最高军事统帅，参与政变时同时体现制度判断与私怨报复。',
    scores: { freedom: 3, moral: 8, realism: 9, fatalism: 5, cause: 8 },
    quote: '我想确认一件事，耶格尔。作为士兵，你能控制巨人之力继续为人类效力吗？',
  },
  {
    name: '萨莎·布劳斯',
    aliases: ['达兹', '萨莎 布劳斯'],
    desc: '出身乡村的猎户少女，直觉敏锐、行动勇敢，在战争里仍保留对具体生活与他人的朴素善意。',
    scores: { freedom: 3, moral: 4, realism: 6, fatalism: 4, cause: 3 },
    quote: '肉。',
  },
];

export const CHARACTERS = BASE_CHARACTERS.map(applyCharacterTuning);
