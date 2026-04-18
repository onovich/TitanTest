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
      { text: '静静地喝一杯茶，接受这种必然性。', scores: { fatalism: 10, realism: 8 } },
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
];
