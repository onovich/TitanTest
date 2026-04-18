import { DIMENSION_LABELS } from './labels.js';
import { DIMENSIONS, rankDimensions } from './scoring.js';

function findBridgeDimension(userScores, primaryCharacter, alternativeCharacter) {
  if (!primaryCharacter || !alternativeCharacter) {
    return null;
  }

  const comparisons = DIMENSIONS.map((dimension) => {
    const primaryGap = Math.abs((userScores[dimension] ?? 5) - (primaryCharacter.scores[dimension] ?? 5));
    const alternativeGap = Math.abs((userScores[dimension] ?? 5) - (alternativeCharacter.scores[dimension] ?? 5));
    return {
      dimension,
      advantage: Number((alternativeGap - primaryGap).toFixed(3)),
    };
  }).sort((a, b) => b.advantage - a.advantage);

  return comparisons[0]?.advantage > 0 ? comparisons[0].dimension : null;
}

export function buildResultInsights(userScores, rankedMatches) {
  const [primary, alternative] = rankedMatches;
  const topDimensions = rankDimensions(userScores).slice(0, 3);
  const bridgeDimension = findBridgeDimension(userScores, primary?.character, alternative?.character);
  const closeCall = primary && alternative ? Number((alternative.distance - primary.distance).toFixed(3)) <= 1.2 : false;

  const summary = [];
  summary.push(`你的答案最突出的维度是 ${topDimensions.map((dimension) => DIMENSION_LABELS[dimension] ?? dimension).join('、')}。`);

  if (alternative?.character) {
    summary.push(`除了 ${primary.character.name}，你也和 ${alternative.character.name} 很接近。`);
  }

  if (bridgeDimension && alternative?.character) {
    summary.push(
      `真正把你推向 ${primary.character.name} 的关键，是你在“${DIMENSION_LABELS[bridgeDimension] ?? bridgeDimension}”上比 ${alternative.character.name} 更接近 ${primary.character.name}。`
    );
  }

  if (closeCall && alternative?.character) {
    summary.push(`这不是单一标签结果，而是“${primary.character.name} + ${alternative.character.name}”之间的近邻倾向。`);
  }

  return {
    topDimensions,
    primaryName: primary?.character?.name ?? null,
    alternativeName: alternative?.character?.name ?? null,
    closeCall,
    bridgeDimension,
    summary,
  };
}
