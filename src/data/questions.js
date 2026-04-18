export const QUESTIONS = [
  {
    id: 1,
    weight: 0.8,
    text: '如果你长期待在一个让自己施展不开的环境里，通常会怎么做？',
    options: [
      { text: '先找突破口，主动争取变化，必要时接受一点风险。', scores: { freedom: 8, moral: 6, fatalism: 3 } },
      { text: '先把生活稳住，在现有边界里争取更安全的空间。', scores: { freedom: 3, realism: 8, fatalism: 7 } },
      { text: '先摸清规则和资源，再准备更稳妥的转向方案。', scores: { realism: 9, freedom: 5, cause: 6 } },
    ],
  },
  {
    id: 2,
    weight: 0.8,
    text: '当团队资源有限，不可能照顾到每个人时，你更倾向于？',
    options: [
      { text: '优先保住整体目标，即使少数人需要额外承担压力。', scores: { moral: 8, cause: 8, realism: 7 } },
      { text: '尽量压低个体损失，不轻易让少数人被迫买单。', scores: { moral: 3, freedom: 5, cause: 4 } },
      { text: '先把取舍规则讲清楚，让资源分配更透明、更能执行。', scores: { moral: 6, cause: 7, fatalism: 6, realism: 8 } },
    ],
  },
  {
    id: 3,
    weight: 0.8,
    text: '你怎么看待一个人的出身和环境对人生的影响？',
    options: [
      { text: '它会限制人，但通常还是留有可以争取的空间。', scores: { fatalism: 8, freedom: 4, realism: 6 } },
      { text: '条件再差也不能等它让路，还是要自己闯出路来。', scores: { freedom: 9, fatalism: 2, realism: 3 } },
      { text: '先理解资源、规则和概率，再想办法慢慢改写位置。', scores: { realism: 9, fatalism: 4, freedom: 5, cause: 5 } },
    ],
  },
  {
    id: 4,
    weight: 0.8,
    text: '如果你和曾经非常信任的人在关键问题上立场相反，你通常会？',
    options: [
      { text: '如果事情已经无法回避，我会做决定，但会记住后果。', scores: { cause: 8, moral: 8, realism: 7 } },
      { text: '先争取沟通，尽量为彼此留一条还能回头的路。', scores: { cause: 5, realism: 6, moral: 3 } },
      { text: '先确保重要的人不被波及，再决定接下来怎么处理。', scores: { cause: 2, freedom: 4, realism: 6 } },
    ],
  },
  {
    id: 5,
    weight: 0.8,
    text: '更能长期支撑你行动的，通常是什么？',
    options: [
      { text: '能自己决定方向、保住选择权的感觉。', scores: { freedom: 8, cause: 4 } },
      { text: '和重要的人、习惯或长期执念之间的牵引。', scores: { fatalism: 7, realism: 5, moral: 5 } },
      { text: '对责任、群体和未来的持续回应。', scores: { cause: 8, moral: 6 } },
    ],
  },
  {
    id: 6,
    weight: 0.8,
    text: '如果一件你投入很多的事大概率会失败，最后阶段你会？',
    options: [
      { text: '还是会继续尝试，看能不能再多争取一点空间。', scores: { freedom: 8, realism: 5, cause: 3 } },
      { text: '接受结果，但把收尾、交接和影响控制好。', scores: { fatalism: 8, realism: 9, cause: 7 } },
      { text: '把时间留给重要的人，也尽量让过程体面一些。', scores: { moral: 7, fatalism: 6, freedom: 3 } },
    ],
  },
  {
    id: 7,
    weight: 0.8,
    text: '你怎么看待“善意的隐瞒”？',
    options: [
      { text: '特定时候可以有，但不能慢慢变成习惯。', scores: { moral: 8, realism: 8, cause: 7 } },
      { text: '我更偏向说清楚，因为长期信任比一时方便重要。', scores: { freedom: 7, moral: 3, realism: 5 } },
      { text: '如果能保护具体的人，我能接受有限度的隐瞒。', scores: { fatalism: 7, moral: 6, freedom: 3 } },
    ],
  },
  {
    id: 8,
    weight: 0.8,
    text: '如果一个真相可能打乱你现有生活，你还会想知道吗？',
    options: [
      { text: '会，不知道反而更难真正做选择。', scores: { freedom: 8, realism: 5, cause: 3 } },
      { text: '会看时机，有些事需要准备好再面对。', scores: { realism: 8, fatalism: 7, freedom: 3 } },
      { text: '会想知道，但也会预留消化和协商空间。', scores: { realism: 9, cause: 7, moral: 4 } },
    ],
  },
  {
    id: 9,
    weight: 0.8,
    text: '如果你突然掌握了远超常人的资源或影响力，你更可能？',
    options: [
      { text: '会把它当成底牌，但不想让它变成唯一的解决方式。', scores: { freedom: 7, moral: 7, cause: 6 } },
      { text: '先限制使用边界，尽量避免影响外溢。', scores: { moral: 4, realism: 8, fatalism: 6 } },
      { text: '把它当成长期博弈的筹码，换更稳定的合作空间。', scores: { realism: 9, moral: 6, cause: 8 } },
    ],
  },
  {
    id: 10,
    weight: 0.8,
    text: '在团队里，大家通常会自然把什么事交给你？',
    options: [
      { text: '负责评估局势、统筹资源，并把关键决策推进落地。', scores: { realism: 8, moral: 7, cause: 8 } },
      { text: '把关键执行部分做扎实，并盯住每一步的代价。', scores: { fatalism: 7, cause: 7, freedom: 3, realism: 7 } },
      { text: '提出异议，提醒大家还有哪些出口没被看到。', scores: { freedom: 8, moral: 4, cause: 2, realism: 5 } },
    ],
  },
  {
    id: 11,
    weight: 0.45,
    text: '如果你的某种身份或处境会让身边人跟着承担风险，你通常会？',
    options: [
      { text: '会先认下这层风险，拉开一点距离，避免它继续波及身边人。', scores: { fatalism: 8, cause: 7, moral: 6 } },
      { text: '会说明情况，再和相关的人一起定方案。', scores: { realism: 8, cause: 8, freedom: 5 } },
      { text: '不想被身份完全定义，但会更谨慎安排自己的选择。', scores: { freedom: 8, fatalism: 3, moral: 4 } },
    ],
  },
  {
    id: 12,
    weight: 0.45,
    text: '一个曾和你立场相反、甚至伤过你的人主动求助，你会？',
    options: [
      { text: '会先帮他脱离当下困境，再处理之后的界限。', scores: { moral: 2, cause: 4, freedom: 4 } },
      { text: '会帮，但会同时评估风险并留一点后手。', scores: { realism: 9, moral: 6, cause: 7 } },
      { text: '如果这会明显拖累更多人，我会优先顾全整体责任。', scores: { moral: 8, cause: 8, realism: 7 } },
    ],
  },
  {
    id: 13,
    weight: 0.45,
    text: '为了避免恐慌，上级希望暂时不公开全部信息，你更倾向于？',
    options: [
      { text: '先配合稳定局面，同时尽快安排后续公开节奏。', scores: { realism: 7, cause: 8, fatalism: 7, moral: 6 } },
      { text: '部分公开，保留关键筹码，避免全面失控。', scores: { realism: 9, cause: 8, moral: 7 } },
      { text: '尽量多公开，让人至少保有基本判断空间。', scores: { freedom: 7, moral: 3, cause: 3, realism: 4 } },
    ],
  },
  {
    id: 14,
    weight: 0.45,
    text: '如果追究一段旧怨能让你出气，但会让关系更糟，你会？',
    options: [
      { text: '还是会想追究，但也知道这会把自己继续困在里面。', scores: { moral: 7, freedom: 7, fatalism: 6 } },
      { text: '会停下来，不想把更多人拖进后续消耗。', scores: { realism: 8, cause: 7, moral: 3 } },
      { text: '先把情绪压住，按步骤把冲突转成可执行的处理方案。', scores: { realism: 8, cause: 8, moral: 6 } },
    ],
  },
  {
    id: 15,
    weight: 0.45,
    text: '哪种状态最让你坐立不安？',
    options: [
      { text: '人生方向总被别人安排，自己几乎没有选择空间。', scores: { freedom: 8, fatalism: 2, cause: 3 } },
      { text: '因为自己的软弱而拖累同伴。', scores: { cause: 7, fatalism: 7, moral: 5 } },
      { text: '一个本可避免的失误，害很多人去承担后果。', scores: { realism: 9, moral: 7, cause: 7 } },
    ],
  },
  {
    id: 16,
    weight: 0.45,
    text: '如果给团队树一个简单靶子，能短时间凝聚共识，你会？',
    options: [
      { text: '只在别无选择时考虑，但不想让真实完全退场。', scores: { moral: 8, realism: 8, cause: 8 } },
      { text: '非常时期可以做，但由我自己承担这个做法的污名。', scores: { moral: 7, fatalism: 7, cause: 7 } },
      { text: '不会，靠简化敌人换来的团结通常后患更大。', scores: { freedom: 7, moral: 2, cause: 4, realism: 5 } },
    ],
  },
  {
    id: 17,
    weight: 0.45,
    text: '当现场气氛越来越乱、大家都开始着急时，你通常会？',
    options: [
      { text: '先做个明确动作打断混乱，再慢慢把节奏拉回来。', scores: { freedom: 7, cause: 5, realism: 4 } },
      { text: '拉住所有人，按步骤把局面重新排好。', scores: { realism: 9, cause: 8, freedom: 4 } },
      { text: '先稳住自己和重要的人，再判断局势能不能接住。', scores: { fatalism: 7, realism: 7, freedom: 2 } },
    ],
  },
  {
    id: 18,
    weight: 0.45,
    text: '如果你提前收到一些不完整、但可能准确的预警信息，你会？',
    options: [
      { text: '会把这份预警当作可能发生的风险，先做好安排和后手，但不完全照单执行。', scores: { fatalism: 8, cause: 7, moral: 6 } },
      { text: '把它当作情报，尽可能改写最坏结果。', scores: { realism: 9, freedom: 7, cause: 7 } },
      { text: '不希望被预警绑住，还是想保留当下的主动权。', scores: { freedom: 8, fatalism: 3, realism: 4 } },
    ],
  },
  {
    id: 19,
    weight: 0.45,
    text: '当你发现自己做错了一件影响不小的事，你通常会？',
    options: [
      { text: '先把眼前该补的洞补上，再回头承担责任。', scores: { moral: 8, cause: 8, fatalism: 7 } },
      { text: '尽快停下并承认，不让错误继续扩散。', scores: { moral: 3, freedom: 6, cause: 4 } },
      { text: '冷静复盘，优先把后续损失降到最低。', scores: { realism: 9, moral: 7, cause: 7 } },
    ],
  },
  {
    id: 20,
    weight: 0.45,
    text: '你更相信什么最能推动长期改变？',
    options: [
      { text: '不轻易退让的意志，以及守住选择权的能力。', scores: { moral: 7, cause: 6, freedom: 8 } },
      { text: '让人愿意同行的理解、沟通与说服。', scores: { moral: 2, cause: 8, realism: 6 } },
      { text: '在绝境里仍然能活下来的韧性。', scores: { fatalism: 7, realism: 7, freedom: 3 } },
    ],
  },
];
