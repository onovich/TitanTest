export const QUESTIONS = [
  {
    id: 1,
    weight: 0.8,
    text: '如果你被困在一个让你越待越窒息的环境里，第一反应会是什么？',
    options: [
      { text: '我会先狠狠干一记，哪怕冒险，也要把出口撞出来。', scores: { freedom: 8, moral: 6, fatalism: 3 } },
      { text: '我会先把饭碗和安全攥住，宁可憋一阵，也不先把自己搭进去。', scores: { freedom: 3, realism: 8, fatalism: 7 } },
      { text: '我会先摸清规则、资源和局面，再选一个能带动后续的换轨点。', scores: { realism: 9, freedom: 5, cause: 6 } },
    ],
  },
  {
    id: 2,
    weight: 0.8,
    text: '当资源只够保住一部分人时，你会怎么切这刀？',
    options: [
      { text: '先保住最关键的任务，哪怕有人得咬牙把压力扛完。', scores: { moral: 8, cause: 8, realism: 7 } },
      { text: '宁可全队慢一点，我也不想先点名谁去吃亏。', scores: { moral: 3, freedom: 5, cause: 4 } },
      { text: '把规则和责任摊在桌上，谁该扛什么，当场讲清。', scores: { moral: 6, cause: 7, fatalism: 6, realism: 8 } },
    ],
  },
  {
    id: 3,
    weight: 0.8,
    text: '你怎么看出身和环境给人上的那道锁？',
    options: [
      { text: '那道锁真的很重，门不是没有，只是每一步都得拿代价去换。', scores: { fatalism: 8, freedom: 4, realism: 6 } },
      { text: '锁再重也不能认命，路很多时候就是硬冲出来的。', scores: { freedom: 9, fatalism: 2, realism: 3 } },
      { text: '先看规则往谁那边倾斜，再一点点挪位置，才是真的翻盘。', scores: { realism: 9, fatalism: 4, freedom: 5, cause: 5 } },
    ],
  },
  {
    id: 4,
    weight: 0.8,
    text: '如果你和最信的人在关键立场上彻底翻脸，你会？',
    options: [
      { text: '真到了非站队不可的时候，我会出手，但不会装作自己没疼过。', scores: { cause: 8, moral: 8, realism: 7 } },
      { text: '我会把该说的话一次说尽，至少别让关系死得太草率。', scores: { cause: 5, realism: 6, moral: 3 } },
      { text: '我先切隔离、做止损，别让旁边的人跟着被这场对撞拖下去。', scores: { cause: 2, freedom: 4, realism: 6 } },
    ],
  },
  {
    id: 5,
    weight: 0.8,
    text: '真正把你一路往前拽的，通常是哪股力？',
    options: [
      { text: '哪怕代价高，我也想把方向和选择权死死握在自己手里。', scores: { freedom: 9, cause: 4, moral: 5 } },
      { text: '嘴上能说算了，可真把我拖着走的，往往还是那点执念和那几个人。', scores: { fatalism: 8, realism: 5, moral: 5 } },
      { text: '只要还有人等我顶事，我就很难心安理得地停下。', scores: { cause: 9, moral: 6, fatalism: 6 } },
    ],
  },
  {
    id: 6,
    weight: 0.8,
    text: '如果你赌了很久的一件事眼看要输，最后一程你会？',
    options: [
      { text: '我还会再往前拱一下，哪怕只多抢回一寸空间。', scores: { freedom: 8, realism: 5, cause: 3 } },
      { text: '我会认这局大概率输了，但把收尾、交接和影响都压住。', scores: { fatalism: 8, realism: 9, cause: 7 } },
      { text: '我会把剩下的时间留给重要的人，至少让结尾别太难看。', scores: { moral: 7, fatalism: 6, freedom: 3 } },
    ],
  },
  {
    id: 7,
    weight: 0.8,
    text: '你怎么看“带着善意的隐瞒”？',
    options: [
      { text: '只有局面快失控时我才会先压消息，把秩序和收尾稳住。', scores: { moral: 8, realism: 8, cause: 7 } },
      { text: '宁可先难堪一阵，我也想把真相摊开，让人自己保留判断。', scores: { freedom: 8, moral: 3, realism: 5 } },
      { text: '要是能替具体的人挡下一波伤，我愿意把这口锅背在自己身上。', scores: { fatalism: 8, moral: 6, freedom: 3 } },
    ],
  },
  {
    id: 8,
    weight: 0.8,
    text: '如果一个真相足够把你现在的生活掀乱，你还要不要知道？',
    options: [
      { text: '要，难听的真相也比活在别人替我写好的版本里强。', scores: { freedom: 8, realism: 5, cause: 3 } },
      { text: '要，但不会现在就掀；有些真相得等自己接得住再看。', scores: { realism: 8, fatalism: 7, freedom: 3 } },
      { text: '要，我会先备好情报、退路和谈法，再把真相摊到桌面上。', scores: { realism: 9, cause: 7, moral: 4 } },
    ],
  },
  {
    id: 9,
    weight: 0.8,
    text: '如果你突然握住远超常人的资源和影响力，你会怎么用？',
    options: [
      { text: '我会把它压成一张底牌，真要掀桌时再掀，不让自己事事都靠它。', scores: { freedom: 7, moral: 7, cause: 6 } },
      { text: '先给它套上笼头，不然这玩意迟早先把身边的人卷下水。', scores: { moral: 4, realism: 8, fatalism: 6 } },
      { text: '我会拿它去换规则、位置和盟友，把优势变成长期筹码。', scores: { realism: 9, moral: 6, cause: 8 } },
    ],
  },
  {
    id: 10,
    weight: 0.8,
    text: '在团队里，大家最自然会把哪种烂摊子递给你？',
    options: [
      { text: '遇到要判局势、排优先级、先把规则钉住的事，大家会来找我。', scores: { realism: 8, moral: 7, cause: 9 } },
      { text: '真到要补漏洞、收残局、把代价一笔笔算清时，通常是我顶上。', scores: { fatalism: 7, cause: 7, freedom: 3, realism: 8 } },
      { text: '当所有人顺着惯性往前冲，我会先把最刺耳但最该说的话甩出来。', scores: { freedom: 9, moral: 4, cause: 2, realism: 5 } },
    ],
  },
  {
    id: 11,
    weight: 0.45,
    text: '如果你的身份会把风险传给身边人，你通常会怎么处理？',
    options: [
      { text: '要是这层拖累已经躲不开，我会先认下它，再拉开距离，不让同伴替我担风险。', scores: { fatalism: 8, cause: 7, moral: 6 } },
      { text: '我会把风险、边界和方案一次讲明，再和相关的人一起定规则。', scores: { realism: 8, cause: 8, freedom: 5 } },
      { text: '我不想被这层身份牵着走，但往后每一步都会比以前更谨慎。', scores: { freedom: 8, fatalism: 3, moral: 4 } },
    ],
  },
  {
    id: 12,
    weight: 0.45,
    text: '一个曾站在你对面、甚至伤过你的人忽然来求助，你会？',
    options: [
      { text: '先把他从眼前的坑里拽出来，之后再慢慢算界限。', scores: { moral: 2, cause: 4, freedom: 4 } },
      { text: '我会帮，但会一边评估风险，一边把后手留够。', scores: { realism: 9, moral: 6, cause: 7 } },
      { text: '如果帮他会明显拖垮更多人，我会先守住整体责任。', scores: { moral: 8, cause: 8, realism: 7 } },
    ],
  },
  {
    id: 13,
    weight: 0.45,
    text: '为了稳住局面，上级要你暂时别把全部信息说出去，你站哪边？',
    options: [
      { text: '我会先配合把局面和秩序稳住，但会盯死公开节奏，逼这件事尽快转进公开。', scores: { realism: 7, cause: 8, fatalism: 7, moral: 6 } },
      { text: '我倾向分层公开：先放能稳局的信息，把关键筹码和后续方案暂时扣住。', scores: { realism: 9, cause: 8, moral: 7 } },
      { text: '我更想把真相尽量说开，至少别让所有人一直被代替判断。', scores: { freedom: 7, moral: 3, cause: 3, realism: 4 } },
    ],
  },
  {
    id: 14,
    weight: 0.45,
    text: '如果翻旧账能让你出气，却会把关系彻底撕坏，你会？',
    options: [
      { text: '我大概率还是会把这口气讨回来，哪怕知道讨完人也回不去了。', scores: { moral: 8, freedom: 8, fatalism: 6 } },
      { text: '我会把事停在这里，别再让更多无关的人替这笔旧账买单。', scores: { realism: 8, cause: 7, moral: 3 } },
      { text: '我会先把情绪扣住，把旧账留到更能谈判、也更利于后续局面的时候再翻。', scores: { realism: 9, cause: 8, moral: 6 } },
    ],
  },
  {
    id: 15,
    weight: 0.45,
    text: '哪种局面最让你浑身发紧、坐都坐不住？',
    options: [
      { text: '人生方向老被别人摆布，自己几乎没有选择权。', scores: { freedom: 8, fatalism: 2, cause: 3 } },
      { text: '因为自己的软弱，把同伴硬生生拖下水。', scores: { cause: 7, fatalism: 7, moral: 5 } },
      { text: '一个本来能避免的失误，却让很多人替你吞后果。', scores: { realism: 9, moral: 7, cause: 7 } },
    ],
  },
  {
    id: 16,
    weight: 0.45,
    text: '如果给团队立一个简单靶子，就能在短时间把人拧成一股绳，你会？',
    options: [
      { text: '只有别无选择时我才会这么干，但不想让真实彻底退场。', scores: { moral: 8, realism: 8, cause: 8 } },
      { text: '非常时期可以做，这个污名我来背，不让别人替我洗。', scores: { moral: 7, fatalism: 7, cause: 7 } },
      { text: '我不会这么干，靠简化敌人换来的团结，后患通常更大。', scores: { freedom: 7, moral: 2, cause: 4, realism: 5 } },
    ],
  },
  {
    id: 17,
    weight: 0.45,
    text: '当场面越来越乱、所有人都开始发急时，你通常会先做什么？',
    options: [
      { text: '我会先硬叫停，哪怕语气刺一点，也得先把混乱掐住。', scores: { freedom: 8, cause: 5, realism: 4 } },
      { text: '我会把人一层层拉回步骤里，先重建秩序，再处理情绪。', scores: { realism: 9, cause: 8, freedom: 4 } },
      { text: '我会先守住自己和最重要的人，确认不会一起失控，再决定接不接场。', scores: { fatalism: 8, realism: 7, freedom: 2 } },
    ],
  },
  {
    id: 18,
    weight: 0.45,
    text: '如果你提前收到一份不完整、却可能很准的预警，你会怎么用？',
    options: [
      { text: '要是最坏结局已经露头，我会先把人和后手安顿好，再决定跟这局走多远。', scores: { fatalism: 8, cause: 7, moral: 6 } },
      { text: '我会把它当情报狠狠干，用在几个关键点上，尽量把最坏结果往回扳。', scores: { realism: 9, freedom: 7, cause: 7 } },
      { text: '我不想被一纸预警牵着鼻子走，最后的选择权还是要留在自己手里。', scores: { freedom: 8, fatalism: 3, realism: 4 } },
    ],
  },
  {
    id: 19,
    weight: 0.45,
    text: '当你发现自己做错了一件影响不小的事，你第一反应更像？',
    options: [
      { text: '先把最危险的连锁反应压住，哪怕那一下得由我先把后果扛下来。', scores: { moral: 8, cause: 8, fatalism: 8 } },
      { text: '我会立刻叫停、认错，宁可当场难堪，也不让错继续滚大。', scores: { moral: 3, freedom: 7, cause: 4 } },
      { text: '我会先拆责任链、做复盘，把后面还能切断的损失先切掉。', scores: { realism: 9, moral: 7, cause: 8 } },
    ],
  },
  {
    id: 20,
    weight: 0.45,
    text: '你更相信，什么东西最能把一个局面慢慢改写？',
    options: [
      { text: '总得有人死死守线不退，让所有人知道这条线不是拿来试探的。', scores: { moral: 7, cause: 6, freedom: 9 } },
      { text: '让更多人真正被说服、愿意一起走，比一阵热血推着冲更久。', scores: { moral: 2, cause: 9, realism: 6 } },
      { text: '不是每次都赢，而是一次次快撑不住时，还是有人能活着把火接下去。', scores: { fatalism: 8, realism: 7, freedom: 3 } },
    ],
  },
];
