import { DIMENSIONS, INITIAL_SCORES, clampScore, euclideanDistance, rankDimensions } from '../logic/scoring.js';

const DIMENSION_RULES = {
  freedom: {
    positive: [
      ['自由', 2.8], ['冲破', 2.4], ['束缚', 2.4], ['反抗', 2.2], ['真相', 1.4], ['出口', 1.4], ['意志', 1.6], ['执念', 1.6], ['逆转', 1.8], ['质疑规则', 2.2], ['刺头', 1.6], ['渴望', 1.6], ['夺走', 1.8], ['战斗', 1.3], ['不惜一切代价', 1.2], ['冲', 1.0], ['选择', 1.2], ['被安排', 1.4], ['身份定义', 1.8], ['束缚现在', 1.6],
    ],
    negative: [
      ['接受', 1.6], ['安全', 1.4], ['舒适', 1.4], ['忠诚', 1.2], ['命令', 1.0], ['服从', 1.4], ['无知', 1.2], ['围巾', 0.8],
    ],
  },
  moral: {
    positive: [
      ['舍弃人性', 3.0], ['牺牲', 1.6], ['背负', 1.8], ['罪孽', 2.0], ['痛下杀手', 2.6], ['欺骗', 1.8], ['统治', 1.2], ['铲除', 1.6], ['残酷', 1.4], ['必要', 1.2], ['恶魔', 1.6], ['工具', 1.0], ['舍弃', 1.2], ['共同敌人', 2.2], ['忍痛放弃', 2.0], ['压倒性力量', 2.0], ['污名', 1.2],
    ],
    negative: [
      ['无法接受', 2.8], ['正义', 1.8], ['沟通', 1.4], ['保护', 1.0], ['爱', 1.0], ['共存', 1.0], ['真实', 1.0], ['幸福', 0.8], ['孩子', 1.4], ['结束循环', 1.8], ['理解', 1.2], ['说服', 1.4], ['公开承担', 1.6],
    ],
  },
  realism: {
    positive: [
      ['理性', 2.8], ['研究', 2.2], ['长期方案', 2.6], ['方案', 1.6], ['概率', 2.6], ['规则', 1.8], ['胜算', 2.0], ['外交', 2.4], ['威慑', 2.0], ['计划', 1.8], ['领导', 1.4], ['安全', 1.8], ['生存', 1.6], ['计算', 2.2], ['统治手段', 2.0], ['现实', 1.6], ['博弈', 2.4], ['喝一杯茶', 1.4], ['接受这种必然性', 1.2],
      ['务实', 2.2], ['士兵', 1.2], ['执行命令', 1.4], ['封印', 1.6], ['不配拥有', 1.4], ['留后手', 2.2], ['部分公开', 1.8], ['情报', 1.8], ['步骤', 1.6], ['复盘', 2.2], ['风险', 1.6], ['民心', 1.2],
    ],
    negative: [
      ['不惜一切代价', 1.6], ['执念', 1.4], ['沉溺', 1.0], ['仇恨', 1.2], ['绝对', 1.0], ['毁天灭地', 1.4],
    ],
  },
  fatalism: {
    positive: [
      ['命运', 2.8], ['既定', 2.2], ['剧本', 1.8], ['必然', 2.2], ['接受', 1.8], ['无法避免', 2.2], ['宿命', 2.8], ['没办法', 1.8], ['黄昏', 1.0], ['喝一杯茶', 1.4], ['沉溺', 1.0], ['忠诚地执行', 1.4], ['扮演角色', 1.6],
      ['梦想', 0.8], ['仇恨', 1.2], ['爱', 0.8], ['煎熬', 1.2], ['封印', 0.8], ['独自承担', 1.6], ['代价', 1.2], ['结局', 1.8], ['未来片段', 2.0], ['韧性', 1.2],
    ],
    negative: [
      ['冲破', 1.6], ['逆转', 1.8], ['扭转', 2.0], ['自由', 1.4], ['真相', 0.8], ['战斗', 0.8],
    ],
  },
  cause: {
    positive: [
      ['大义', 2.8], ['同胞', 2.4], ['民族', 2.4], ['责任', 2.0], ['使命', 2.0], ['大局', 2.2], ['未来', 1.6], ['社会', 1.8], ['领导者', 1.8], ['命令', 1.4], ['群体', 1.6], ['守护家园', 2.2], ['族人', 2.0], ['世界', 1.2], ['生存契机', 2.0], ['外交', 1.4], ['沟通', 1.0],
      ['士兵', 1.2], ['牺牲者', 1.2], ['同伴', 1.8], ['民心', 1.8], ['团结', 2.0], ['内部', 1.2], ['同行', 1.4], ['共同敌人', 1.8],
    ],
    negative: [
      ['只想保护身边', 2.0], ['我爱的人', 1.8], ['私人', 1.4], ['父亲', 1.2], ['围巾', 1.0], ['只想', 1.0], ['自己', 0.8],
    ],
  },
};

const ARCHETYPE_RULES = [
  { tag: 'rebel', keywords: ['自由', '冲破', '反抗', '质疑规则', '个人出口', '不惜一切代价'] },
  { tag: 'strategist', keywords: ['理性', '研究', '方案', '规则', '外交', '博弈', '计划', '概率', '长期'] },
  { tag: 'protector', keywords: ['保护', '爱的人', '守护', '围巾', '父亲', '重要的人', '孩子', '同伴', '家人', '妈妈', '故乡'] },
  { tag: 'collective', keywords: ['同胞', '民族', '责任', '使命', '大义', '社会', '家园', '未来', '民心', '整体秩序'] },
  { tag: 'fatalist', keywords: ['命运', '既定', '必然', '宿命', '接受', '没办法'] },
  { tag: 'truthseeker', keywords: ['真相', '真实', '无知', '追寻'] },
  { tag: 'survivor', keywords: ['活下去', '安全', '生存', '舒适', '恐惧'] },
  { tag: 'utilitarian', keywords: ['牺牲', '舍弃人性', '大局', '欺骗', '杀手', '背负'] },
  { tag: 'soldier', keywords: ['士兵', '执行命令', '责任', '煎熬', '牺牲者', '命令', '服从'] },
  { tag: 'mediator', keywords: ['谈判', '说服', '理解', '共同制定方案', '沟通'] },
];

function countOccurrences(text, keyword) {
  if (!keyword) return 0;
  return text.split(keyword).length - 1;
}

function normalizeText(text) {
  return `${text ?? ''}`.replace(/\s+/g, '');
}

export function inferSemanticWeights(text) {
  const normalized = normalizeText(text);
  const weights = DIMENSIONS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

  DIMENSIONS.forEach((dimension) => {
    DIMENSION_RULES[dimension].positive.forEach(([keyword, weight]) => {
      const hits = countOccurrences(normalized, keyword);
      if (hits) weights[dimension] += weight * hits;
    });
    DIMENSION_RULES[dimension].negative.forEach(([keyword, weight]) => {
      const hits = countOccurrences(normalized, keyword);
      if (hits) weights[dimension] -= weight * hits;
    });
  });

  return weights;
}

export function semanticWeightsToScores(weights) {
  return DIMENSIONS.reduce((acc, dimension) => {
    acc[dimension] = clampScore(INITIAL_SCORES[dimension] + weights[dimension] * 0.8);
    return acc;
  }, {});
}

export function inferSemanticScores(text) {
  return semanticWeightsToScores(inferSemanticWeights(text));
}

export function inferArchetypes(text) {
  const normalized = normalizeText(text);
  return ARCHETYPE_RULES.filter(({ keywords }) => keywords.some((keyword) => normalized.includes(keyword))).map(({ tag }) => tag);
}

export function semanticSimilarity(profileA, profileB) {
  const distance = euclideanDistance(profileA, profileB);
  return Number((1 / (1 + distance)).toFixed(3));
}

export function optionSemanticProfile(questionText, optionText) {
  return inferSemanticScores(`${questionText} ${optionText}`);
}

export function rankByImpact(scores) {
  return [...DIMENSIONS].sort((a, b) => Math.abs((scores[b] ?? 5) - 5) - Math.abs((scores[a] ?? 5) - 5));
}

export function compareSemanticTopDimensions(textScores, numericScores, topN = 2) {
  const effectiveTopN = Math.min(topN, Object.keys(numericScores).length || topN);
  const textTop = rankByImpact(textScores).slice(0, effectiveTopN);
  const numericTop = rankByImpact({ ...INITIAL_SCORES, ...numericScores }).slice(0, effectiveTopN);
  const overlap = textTop.filter((key) => numericTop.includes(key)).length / effectiveTopN;

  return {
    textTop,
    numericTop,
    overlap: Number(overlap.toFixed(3)),
  };
}
