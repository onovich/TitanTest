const COMMON_STARTERS = [
  '先',
  '会',
  '我会',
  '如果',
  '还是',
  '尽量',
  '需要',
  '不想',
  '只要',
  '把',
];

const ABSTRACT_TERMS = [
  '空间',
  '局势',
  '判断',
  '规则',
  '资源',
  '概率',
  '位置',
  '后续',
  '影响',
  '条件',
  '节奏',
  '筹码',
  '关系',
  '局面',
  '方案',
  '结果',
];

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getBigrams(text) {
  const normalized = (text ?? '').replace(/[，。！？、；：“”‘’\s]/g, '');
  const grams = new Set();

  for (let index = 0; index < normalized.length - 1; index += 1) {
    grams.add(normalized.slice(index, index + 2));
  }

  if (!grams.size && normalized) {
    grams.add(normalized);
  }

  return grams;
}

function setOverlapRatio(left, right) {
  if (!left.size || !right.size) {
    return 0;
  }

  let overlap = 0;
  left.forEach((item) => {
    if (right.has(item)) {
      overlap += 1;
    }
  });

  return overlap / Math.max(left.size, right.size);
}

function getStarter(text) {
  return COMMON_STARTERS.find((starter) => text.startsWith(starter)) ?? text.slice(0, 2);
}

function evaluateOptionClarity(optionText) {
  const text = optionText ?? '';
  const lengthPenalty = Math.max(0, text.length - 22) * 1.8;
  const commaPenalty = (text.match(/[，、；]/g) ?? []).length * 4;
  const abstractPenalty = ABSTRACT_TERMS.filter((term) => text.includes(term)).length * 2.4;
  const nestedPenalty = /(不是|而是|至少|尽量|同时|再|先.+再)/.test(text) ? 3.5 : 0;

  return clamp(100 - lengthPenalty - commaPenalty - abstractPenalty - nestedPenalty, 0, 100);
}

function evaluateQuestionDifferentiation(question) {
  const options = question.options.map((option) => option.text);
  const pairScores = [];

  for (let left = 0; left < options.length; left += 1) {
    for (let right = left + 1; right < options.length; right += 1) {
      const leftText = options[left];
      const rightText = options[right];
      const overlap = setOverlapRatio(getBigrams(leftText), getBigrams(rightText));
      const sameStarterPenalty = getStarter(leftText) === getStarter(rightText) ? 12 : 0;
      const sameLengthPenalty = Math.abs(leftText.length - rightText.length) <= 2 ? 6 : 0;
      const pairScore = clamp(100 - overlap * 80 - sameStarterPenalty - sameLengthPenalty, 0, 100);
      pairScores.push(pairScore);
    }
  }

  return Number(average(pairScores).toFixed(2));
}

function evaluateQuestionClarity(question) {
  const stemScore = evaluateOptionClarity(question.text);
  const optionScores = question.options.map((option) => evaluateOptionClarity(option.text));
  const optionScore = average(optionScores);

  return {
    stemScore: Number(stemScore.toFixed(2)),
    optionScore: Number(optionScore.toFixed(2)),
    overallScore: Number((stemScore * 0.35 + optionScore * 0.65).toFixed(2)),
  };
}

export function evaluateQuestionQuality(questions) {
  const items = questions.map((question) => {
    const clarity = evaluateQuestionClarity(question);
    const differentiationScore = evaluateQuestionDifferentiation(question);

    return {
      id: question.id,
      text: question.text,
      clarity,
      differentiationScore,
      options: question.options.map((option) => ({
        text: option.text,
        clarityScore: Number(evaluateOptionClarity(option.text).toFixed(2)),
      })),
    };
  });

  const clarityScore = Number(average(items.map((item) => item.clarity.overallScore)).toFixed(2));
  const differentiationScore = Number(average(items.map((item) => item.differentiationScore)).toFixed(2));

  return {
    clarityScore,
    differentiationScore,
    items,
    flaggedClarityCount: items.filter((item) => item.clarity.overallScore < 74).length,
    flaggedDifferentiationCount: items.filter((item) => item.differentiationScore < 72).length,
  };
}
