export const QUESTIONS = [
  {
    id: 1,
    weight: 0.8,
    text: '当你发现自己被困在无法逾越的「围墙」内，你会如何选择？',
    options: [
      { text: '会先寻找突破口，必要时愿意冒险打破现状。', scores: { freedom: 9, moral: 7, fatalism: 2 } },
      { text: '先把生活稳住，在现有边界里争取更安全的空间。', scores: { freedom: 3, realism: 8, fatalism: 7 } },
      { text: '研究墙壁与规则本身，准备更长期、代价更低的突围方案。', scores: { realism: 9, freedom: 5, cause: 6 } },
    ],
  },
  {
    id: 2,
    weight: 0.8,
    text: '如果牺牲100个无辜的人能救下10000个同胞，你的态度是？',
    options: [
      { text: '如果别无选择，我会痛苦地执行，但必须有人承担责任。', scores: { moral: 9, cause: 9, realism: 7 } },
      { text: '我会尽量寻找替代方案，不轻易接受拿无辜者交换结果。', scores: { moral: 3, freedom: 5, cause: 4 } },
      { text: '也许会接受部分牺牲，但前提是过程透明、代价可控。', scores: { moral: 7, cause: 8, fatalism: 8, realism: 7 } },
    ],
  },
  {
    id: 3,
    weight: 0.8,
    text: '你如何看待「命运」这件事？',
    options: [
      { text: '命运会限制人，但仍留有可以争取的空间。', scores: { fatalism: 9, freedom: 3, realism: 6 } },
      { text: '很多结果能被意志改写，只是代价常比想象更高。', scores: { freedom: 9, fatalism: 2, realism: 4 } },
      { text: '命运更像条件与概率，我们要学会读懂规则。', scores: { realism: 9, fatalism: 4, freedom: 6 } },
    ],
  },
  {
    id: 4,
    weight: 0.8,
    text: '当昔日的战友突然站到了你的对立面，你会？',
    options: [
      { text: '如果局势逼到这一步，我会下手，但会把情分和后果都记住。', scores: { cause: 9, moral: 8, realism: 7 } },
      { text: '先争取沟通，尽量为彼此留一条还能回头的路。', scores: { cause: 5, realism: 6, moral: 3 } },
      { text: '我会优先把身边人带离最危险的位置，再决定站哪边。', scores: { cause: 2, freedom: 4, realism: 6 } },
    ],
  },
  {
    id: 5,
    weight: 0.8,
    text: '你认为什么才是一个人活着的真正动力？',
    options: [
      { text: '对自由与自我选择的渴望。', scores: { freedom: 9, cause: 4 } },
      { text: '对某些关系、梦想或执念的投入。', scores: { fatalism: 7, realism: 5, moral: 5 } },
      { text: '对群体、责任和未来的回应。', scores: { cause: 9, moral: 6 } },
    ],
  },
  {
    id: 6,
    weight: 0.8,
    text: '如果世界末日不可避免，你会如何度过最后时刻？',
    options: [
      { text: '还会再尝试一次，但更看重把代价控制在能承受范围。', scores: { freedom: 8, realism: 6 } },
      { text: '冷静接受大势已定，但会把最后的秩序、撤离和告别安排好。', scores: { fatalism: 8, realism: 9, cause: 7 } },
      { text: '陪重要的人把最后一段路走好，也尽量维持体面与秩序。', scores: { moral: 7, fatalism: 6 } },
    ],
  },
  {
    id: 7,
    weight: 0.8,
    text: '你如何看待谎言？',
    options: [
      { text: '必要时可以隐瞒一部分，但不该把谎言当成常态。', scores: { moral: 9, realism: 8, cause: 8 } },
      { text: '我更偏向坦诚，因为长期信任比一时方便重要。', scores: { freedom: 8, moral: 3, realism: 5 } },
      { text: '只要能保护具体的人，我能接受有限度的谎言。', scores: { fatalism: 7, moral: 6 } },
    ],
  },
  {
    id: 8,
    weight: 0.8,
    text: '面对未知的真相，即便它可能让你崩溃，你也要追寻吗？',
    options: [
      { text: '会追寻，因为真相通常比想象更值得面对。', scores: { freedom: 8, realism: 6, cause: 5 } },
      { text: '会看时机，有些真相需要准备好再去承受。', scores: { realism: 8, fatalism: 8, freedom: 2 } },
      { text: '会追寻，但要给自己和同伴留下理解与消化真相的余地。', scores: { realism: 9, cause: 7, moral: 4 } },
    ],
  },
  {
    id: 9,
    weight: 0.8,
    text: '当你获得一种毁天灭地的力量，你会？',
    options: [
      { text: '会把它当成底牌，但尽量不让它先变成解决问题的唯一方式。', scores: { freedom: 8, moral: 8, cause: 7 } },
      { text: '宁可限制它的使用范围，避免任何人轻易被它吞没。', scores: { moral: 5, realism: 8, fatalism: 6 } },
      { text: '作为威慑筹码，通过外交进行博弈。', scores: { realism: 9, moral: 6, cause: 8 } },
    ],
  },
  {
    id: 10,
    weight: 0.8,
    text: '在群体中，你通常扮演什么角色？',
    options: [
      { text: '负责规划方向，也愿意扛起艰难决定。', scores: { realism: 8, moral: 7, cause: 9 } },
      { text: '把事情执行到位，但会记住每个命令背后的代价。', scores: { fatalism: 8, cause: 7, freedom: 3 } },
      { text: '习惯提出异议，帮大家看见被忽略的出口。', scores: { freedom: 8, moral: 5, cause: 3 } },
    ],
  },
  {
    id: 11,
    weight: 0.45,
    text: '如果你发现自己的身份本身就会给身边人带来灾难，你更可能？',
    options: [
      { text: '会暂时拉开距离，尽量不把风险直接带给同伴。', scores: { fatalism: 9, cause: 7, moral: 6 } },
      { text: '坦白真相，和同伴一起制定长期方案。', scores: { realism: 9, cause: 8, freedom: 5 } },
      { text: '不愿完全被身份定义，但会更谨慎地安排自己的选择。', scores: { freedom: 9, fatalism: 2, moral: 4 } },
    ],
  },
  {
    id: 12,
    weight: 0.45,
    text: '一个敌方阵营的孩子向你求救时，你会？',
    options: [
      { text: '会先救下来，再想办法降低后续风险。', scores: { moral: 2, cause: 5, freedom: 3 } },
      { text: '会救，但会评估风险并留下后手。', scores: { realism: 9, moral: 6, cause: 8 } },
      { text: '如果局势极度危险，我会优先保护更多人的安全。', scores: { moral: 9, cause: 9, realism: 7 } },
    ],
  },
  {
    id: 13,
    weight: 0.45,
    text: '上级要求你隐瞒真相来稳定民心，你更倾向于？',
    options: [
      { text: '接受短期封锁，但会尽快准备更稳妥的公开方式。', scores: { realism: 7, cause: 8, fatalism: 8, moral: 6 } },
      { text: '部分公开，保留关键筹码，避免全面失控。', scores: { realism: 9, cause: 8, moral: 7 } },
      { text: '倾向公开更多事实，让人们尽可能保有判断空间。', scores: { freedom: 7, moral: 3, cause: 5 } },
    ],
  },
  {
    id: 14,
    weight: 0.45,
    text: '如果复仇能给你私人解脱，却会让仇恨循环继续，你会？',
    options: [
      { text: '仍然想复仇，但会承认这会把自己也继续拖进循环。', scores: { moral: 8, freedom: 7, fatalism: 6 } },
      { text: '理性停下报复，避免更多无辜者继续被拖进循环。', scores: { realism: 8, cause: 7, moral: 3 } },
      { text: '把愤怒压下来，当成谈判筹码，为后续局面争取空间。', scores: { realism: 9, cause: 8, moral: 6 } },
    ],
  },
  {
    id: 15,
    weight: 0.45,
    text: '下面哪件事最让你难以忍受？',
    options: [
      { text: '被圈养、被安排，连选择人生方向的空间都没有。', scores: { freedom: 9, fatalism: 2, cause: 3 } },
      { text: '因为自己的软弱而拖累同伴。', scores: { cause: 7, fatalism: 7, moral: 5 } },
      { text: '一个本可避免的失误，害很多人去承担后果。', scores: { realism: 9, moral: 7, cause: 7 } },
    ],
  },
  {
    id: 16,
    weight: 0.45,
    text: '如果制造一个“共同敌人”就能迅速让内部团结起来，你会？',
    options: [
      { text: '若真到最后关头，我会考虑，但不会轻易让真实完全让位。', scores: { moral: 9, realism: 8, cause: 9 } },
      { text: '只在最后关头才会做，并由自己背负污名。', scores: { moral: 7, fatalism: 8, cause: 7 } },
      { text: '不会，建立在谎言上的团结会毁掉长期信任与真相。', scores: { freedom: 6, cause: 6, realism: 7 } },
    ],
  },
  {
    id: 17,
    weight: 0.45,
    text: '当现场所有人都情绪失控时，你更像？',
    options: [
      { text: '会先出手打破僵局，但不想让场面继续失控。', scores: { freedom: 8, cause: 5, realism: 3 } },
      { text: '拉住所有人，按步骤把局面重新排好。', scores: { realism: 9, cause: 8, freedom: 4 } },
      { text: '先稳住自己和重要的人，再判断局势能不能接住。', scores: { fatalism: 7, realism: 7, freedom: 2 } },
    ],
  },
  {
    id: 18,
    weight: 0.45,
    text: '如果你能提前看到一些未来片段，你会怎么对待它？',
    options: [
      { text: '会参考那个结局，但不想把自己完全交给它。', scores: { fatalism: 9, cause: 8, moral: 7 } },
      { text: '把它当作情报，尽可能改写最坏结果。', scores: { realism: 9, freedom: 7, cause: 7 } },
      { text: '不会让未来决定现在，宁可保留当下的主动权。', scores: { freedom: 9, fatalism: 2, realism: 4 } },
    ],
  },
  {
    id: 19,
    weight: 0.45,
    text: '当你犯下一个无法挽回的错误后，你会？',
    options: [
      { text: '先扛着继续做完该做的事，再回头承担责任。', scores: { moral: 8, cause: 8, fatalism: 7 } },
      { text: '尽快停下并承担，不让错误继续扩大。', scores: { moral: 2, freedom: 6, cause: 4 } },
      { text: '冷静复盘，优先把后续损失降到最低。', scores: { realism: 9, moral: 7, cause: 7 } },
    ],
  },
  {
    id: 20,
    weight: 0.45,
    text: '你更相信哪一种力量能改变世界？',
    options: [
      { text: '让对手知道你有底线、有能力，也有不轻易退让的意志。', scores: { moral: 9, cause: 8, freedom: 7 } },
      { text: '让人愿意同行的理解、沟通与说服。', scores: { moral: 2, cause: 8, realism: 6 } },
      { text: '在绝境里仍然能活下来的韧性。', scores: { fatalism: 7, realism: 7, freedom: 3 } },
    ],
  },
];
