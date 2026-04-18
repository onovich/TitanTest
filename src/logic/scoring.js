export const DIMENSIONS = ['freedom', 'moral', 'realism', 'fatalism', 'cause'];

export const INITIAL_SCORES = {
  freedom: 5,
  moral: 5,
  realism: 5,
  fatalism: 5,
  cause: 5,
};

export function clampScore(value, min = 1, max = 10) {
  return Math.min(max, Math.max(min, value));
}

export function mergeOptionScores(currentScores, optionScores) {
  const nextScores = { ...currentScores };

  Object.keys(optionScores).forEach((key) => {
    nextScores[key] = clampScore(nextScores[key] + (optionScores[key] - 5) * 0.5);
  });

  return nextScores;
}

export function euclideanDistance(scoreA, scoreB) {
  return Math.sqrt(
    DIMENSIONS.reduce((sum, key) => {
      return sum + Math.pow((scoreA[key] ?? 5) - (scoreB[key] ?? 5), 2);
    }, 0)
  );
}

export function findBestMatch(finalScores, characters) {
  return characters.reduce(
    (best, char) => {
      const distance = euclideanDistance(finalScores, char.scores);
      if (distance < best.distance) {
        return { character: char, distance };
      }
      return best;
    },
    { character: null, distance: Infinity }
  );
}

export function rankDimensions(scores) {
  return [...DIMENSIONS].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
}
