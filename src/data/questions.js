export const QUESTIONS = [
  {
    id: 1,
    text: '当你发现自己被困在无法逾越的「围墙」内，你会如何选择？',
    options: [
      { text: '不惜一切代价冲破它，哪怕这会引发灾难。', scores: { freedom: 10, moral: 8, fatalism: 2 } },
      { text: '在墙内寻找最舒适、最安全的生存方式。', scores: { freedom: 2, realism: 8, fatalism: 7 } },
      { text: '研究墙壁的构造，寻找理性突围的长期方案。', scores: { realism: 10, freedom: 5, cause: 6 } },
    ],
  },
  {
    id: 2,
    text: '如果牺牲100个无辜的人能救下10000个同胞，你的态度是？',
    options: [
      { text: '毫不犹豫地执行，为了生存必须舍弃人性。', scores: { moral: 10, cause: 10, realism: 7 } },
      { text: '绝对无法接受，杀戮永远不能换取正义。', scores: { moral: 2, freedom: 5, cause: 3 } },
      { text: '痛苦地接受，并决定由自己来背负这份罪孽。', scores: { moral: 7, cause: 8, fatalism: 9 } },
    ],
  },
  {
    id: 3,
    text: '你如何看待「命运」这件事？',
    options: [
      { text: '命运是既定的，我们只是在扮演剧本里的角色。', scores: { fatalism: 10, freedom: 2, realism: 6 } },
      { text: '命运是可以被意志扭转的，只要你有足够的执念。', scores: { freedom: 10, fatalism: 2, realism: 4 } },
      { text: '命运是概率的集合，我们要利用规则最大化胜算。', scores: { realism: 10, fatalism: 4, freedom: 6 } },
    ],
  },
  {
    id: 4,
    text: '当昔日的战友突然站到了你的对立面，你会？',
    options: [
      { text: '为了大义，即便流泪也要痛下杀手。', scores: { cause: 10, moral: 8, realism: 7 } },
      { text: '尝试沟通，寻找第三条共存的道路。', scores: { cause: 5, realism: 4, moral: 3 } },
      { text: '放弃立场，只想保护身边的这几个人。', scores: { cause: 1, freedom: 4, realism: 5 } },
    ],
  },
  {
    id: 5,
    text: '你认为什么才是一个人活着的真正动力？',
    options: [
      { text: '对自由的渴望，没有任何东西能束缚我。', scores: { freedom: 10, cause: 4 } },
      { text: '对某些东西的「沉溺」，比如梦想、仇恨或爱。', scores: { fatalism: 7, realism: 5 } },
      { text: '对社会或民族应尽的责任与使命。', scores: { cause: 10, moral: 6 } },
    ],
  },
  {
    id: 6,
    text: '如果世界末日不可避免，你会如何度过最后时刻？',
    options: [
      { text: '发动最后的一搏，试图逆转结果。', scores: { freedom: 8, realism: 5 } },
      { text: '冷静接受大势已定，但会把最后的秩序、撤离和告别安排好。', scores: { fatalism: 8, realism: 9, cause: 7 } },
      { text: '保护好最重要的人，能多活一秒是一秒。', scores: { cause: 1, moral: 4 } },
    ],
  },
  {
    id: 7,
    text: '你如何看待谎言？',
    options: [
      { text: '谎言是必要的统治手段，为了大局可以欺骗大众。', scores: { moral: 9, realism: 9, cause: 8 } },
      { text: '谎言是软弱的表现，我追求绝对的真实。', scores: { freedom: 8, moral: 3 } },
      { text: '只要能保护我爱的人，谎言也无所谓。', scores: { cause: 2, moral: 6 } },
    ],
  },
  {
    id: 8,
    text: '面对未知的真相，即便它可能让你崩溃，你也要追寻吗？',
    options: [
      { text: '是的，真相高于一切生存意义。', scores: { freedom: 9, realism: 6, cause: 5 } },
      { text: '不，有些时候无知才是一种幸福。', scores: { realism: 8, fatalism: 9, freedom: 2 } },
    ],
  },
  {
    id: 9,
    text: '当你获得一种毁天灭地的力量，你会？',
    options: [
      { text: '用它来铲除一切敌人，换取绝对的安全。', scores: { freedom: 10, moral: 10, cause: 7 } },
      { text: '封印它，认为人类不配拥有这种力量。', scores: { moral: 5, realism: 8, fatalism: 6 } },
      { text: '作为威慑筹码，通过外交进行博弈。', scores: { realism: 10, moral: 6, cause: 8 } },
    ],
  },
  {
    id: 10,
    text: '在群体中，你通常扮演什么角色？',
    options: [
      { text: '制定计划并下达残酷命令的领导者。', scores: { realism: 10, moral: 8, cause: 9 } },
      { text: '忠诚地执行命令，哪怕内心煎熬。', scores: { fatalism: 8, cause: 7, freedom: 3 } },
      { text: '总是在质疑规则，试图寻找个人出口的刺头。', scores: { freedom: 9, moral: 5, cause: 3 } },
    ],
  },
  {
    id: 11,
    weight: 0.5,
    text: '如果你发现自己的身份本身就会给身边人带来灾难，你更可能？',
    options: [
      { text: '切断关系，独自承担后果，不把灾难带给同伴。', scores: { fatalism: 9, cause: 7, moral: 6 } },
      { text: '坦白真相，和同伴一起制定长期方案。', scores: { realism: 10, cause: 8, freedom: 5 } },
      { text: '拒绝被身份定义，继续按自己的意志生活。', scores: { freedom: 10, fatalism: 2, moral: 4 } },
    ],
  },
  {
    id: 12,
    weight: 0.5,
    text: '一个敌方阵营的孩子向你求救时，你会？',
    options: [
      { text: '先救下来，孩子不该继承上一代的仇恨。', scores: { moral: 2, cause: 5, freedom: 3 } },
      { text: '会救，但会评估风险并留下后手。', scores: { realism: 9, moral: 6, cause: 8 } },
      { text: '忍痛放弃，不能让群体承担额外风险。', scores: { moral: 9, cause: 9, realism: 7 } },
    ],
  },
  {
    id: 13,
    weight: 0.5,
    text: '上级要求你隐瞒真相来稳定民心，你更倾向于？',
    options: [
      { text: '接受，为了稳定民心和整体秩序，必须暂时封锁消息。', scores: { realism: 7, cause: 8, fatalism: 8, moral: 6 } },
      { text: '部分公开，保留关键筹码，避免全面失控。', scores: { realism: 10, cause: 8, moral: 7 } },
      { text: '拒绝，民众有知道真相与自己选择的自由。', scores: { freedom: 7, moral: 3, cause: 5 } },
    ],
  },
  {
    id: 14,
    weight: 0.5,
    text: '如果复仇能给你私人解脱，却会让仇恨循环继续，你会？',
    options: [
      { text: '仍然复仇，因为有些账必须亲手清算。', scores: { moral: 8, freedom: 7, fatalism: 6 } },
      { text: '理性停下报复，避免更多无辜者继续被拖进循环。', scores: { realism: 8, cause: 7, moral: 3 } },
      { text: '把愤怒压下来，当成外交筹码，逼对方坐上谈判桌。', scores: { realism: 10, cause: 9, moral: 6 } },
    ],
  },
  {
    id: 15,
    weight: 0.5,
    text: '下面哪件事最让你难以忍受？',
    options: [
      { text: '被圈养、被安排，连选择人生的资格都没有。', scores: { freedom: 10, fatalism: 2, cause: 3 } },
      { text: '因为自己的软弱而拖累同伴。', scores: { cause: 7, fatalism: 7, moral: 5 } },
      { text: '一个本可避免的失误，害死了太多人。', scores: { realism: 10, moral: 7, cause: 7 } },
    ],
  },
  {
    id: 16,
    weight: 0.5,
    text: '如果制造一个“共同敌人”就能迅速让内部团结起来，你会？',
    options: [
      { text: '会做，只要能让群体存活，真实可以让位。', scores: { moral: 10, realism: 8, cause: 9 } },
      { text: '只在最后关头才会做，并由自己背负污名。', scores: { moral: 7, fatalism: 8, cause: 7 } },
      { text: '不会，建立在谎言上的团结会毁掉长期信任与真相。', scores: { freedom: 6, cause: 6, realism: 7 } },
    ],
  },
  {
    id: 17,
    weight: 0.5,
    text: '当现场所有人都情绪失控时，你更像？',
    options: [
      { text: '第一个冲上去打破僵局，哪怕很鲁莽。', scores: { freedom: 8, cause: 5, realism: 3 } },
      { text: '拉住所有人，按步骤把局面重新排好。', scores: { realism: 10, cause: 8, freedom: 4 } },
      { text: '先别逞强，顺着局势保护自己和重要的人安全。', scores: { fatalism: 7, realism: 7, freedom: 2 } },
    ],
  },
  {
    id: 18,
    weight: 0.5,
    text: '如果你能提前看到一些未来片段，你会怎么对待它？',
    options: [
      { text: '按那个结局推进，接受必要代价。', scores: { fatalism: 10, cause: 8, moral: 7 } },
      { text: '把它当作情报，尽可能改写最坏结果。', scores: { realism: 10, freedom: 7, cause: 7 } },
      { text: '故意不看，因为未来不该反过来束缚现在。', scores: { freedom: 9, fatalism: 2, realism: 4 } },
    ],
  },
  {
    id: 19,
    weight: 0.5,
    text: '当你犯下一个无法挽回的错误后，你会？',
    options: [
      { text: '继续前进，把罪责硬生生变成结果。', scores: { moral: 8, cause: 8, fatalism: 7 } },
      { text: '立刻停手并公开承担，不再让错误扩大。', scores: { moral: 2, freedom: 6, cause: 4 } },
      { text: '冷静复盘，优先把后续损失降到最低。', scores: { realism: 10, moral: 7, cause: 7 } },
    ],
  },
  {
    id: 20,
    weight: 0.5,
    text: '你更相信哪一种力量能改变世界？',
    options: [
      { text: '让敌人恐惧到不敢越线的压倒性力量。', scores: { moral: 9, cause: 8, freedom: 7 } },
      { text: '让人愿意同行的理解、沟通与说服。', scores: { moral: 2, cause: 8, realism: 6 } },
      { text: '在绝境里仍然能活下来的韧性。', scores: { fatalism: 7, realism: 7, freedom: 3 } },
    ],
  },
];
