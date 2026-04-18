export const DIMENSIONS = ['freedom', 'moral', 'realism', 'fatalism', 'cause'];

export const INITIAL_SCORES = {
  freedom: 5,
  moral: 5,
  realism: 5,
  fatalism: 5,
  cause: 5,
};

const OPTION_SCORE_BASELINES = {
  freedom: 6.355,
  moral: 6.054,
  realism: 7.583,
  fatalism: 6.478,
  cause: 6.581,
};

const OPTION_SCORE_CALIBRATION_STRENGTHS = {
  freedom: 0.18,
  moral: 0.04,
  realism: 0.42,
  fatalism: 0.12,
  cause: 0.32,
};
const MATCH_DENSITY_PENALTY_WEIGHT = 3.4;

export function clampScore(value, min = 1, max = 10) {
  return Math.min(max, Math.max(min, value));
}

export function calibrateOptionScores(optionScores) {
  return Object.entries(optionScores).reduce((acc, [key, value]) => {
    const baseline = OPTION_SCORE_BASELINES[key] ?? 5;
    const calibrationStrength = OPTION_SCORE_CALIBRATION_STRENGTHS[key] ?? 0;
    acc[key] = clampScore(value - (baseline - 5) * calibrationStrength);
    return acc;
  }, {});
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
}

function profileSignalStrength(scores) {
  return DIMENSIONS.reduce((sum, key) => sum + Math.abs((scores[key] ?? 5) - 5), 0);
}

function clampUnit(value) {
  return Math.max(0, Math.min(1, value));
}

function buildDensityPenaltyMap(characters) {
  const densityEntries = characters.map((character) => {
    const averageDistance = average(
      characters
        .filter((otherCharacter) => otherCharacter.name !== character.name)
        .map((otherCharacter) => euclideanDistance(character.scores, otherCharacter.scores))
    );

    return {
      name: character.name,
      averageDistance,
    };
  });

  const minDistance = Math.min(...densityEntries.map((entry) => entry.averageDistance));
  const maxDistance = Math.max(...densityEntries.map((entry) => entry.averageDistance));
  const spread = Math.max(0.001, maxDistance - minDistance);

  return Object.fromEntries(
    densityEntries.map((entry) => [
      entry.name,
      Number((((maxDistance - entry.averageDistance) / spread) * MATCH_DENSITY_PENALTY_WEIGHT).toFixed(3)),
    ])
  );
}

function buildRankedMatch(finalScores, character, densityPenaltyMap) {
  const distance = euclideanDistance(finalScores, character.scores);
  const signalStrength = profileSignalStrength(finalScores);
  const ambiguityFactor = clampUnit((10.5 - signalStrength) / 5);
  const densityPenalty = Number(((densityPenaltyMap[character.name] ?? 0) * ambiguityFactor).toFixed(3));

  return {
    character,
    distance: Number(distance.toFixed(3)),
    adjustedDistance: Number((distance + densityPenalty).toFixed(3)),
    densityPenalty,
  };
}

export function mergeOptionScores(currentScores, optionScores, weight = 1) {
  const nextScores = { ...currentScores };
  const influence = 0.35 * weight;
  const calibratedScores = calibrateOptionScores(optionScores);

  Object.keys(calibratedScores).forEach((key) => {
    nextScores[key] = clampScore(nextScores[key] + (calibratedScores[key] - nextScores[key]) * influence);
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
  const densityPenaltyMap = buildDensityPenaltyMap(characters);

  return characters.reduce(
    (best, char) => {
      const rankedMatch = buildRankedMatch(finalScores, char, densityPenaltyMap);
      if (rankedMatch.adjustedDistance < best.adjustedDistance) {
        return rankedMatch;
      }
      return best;
    },
    { character: null, distance: Infinity, adjustedDistance: Infinity, densityPenalty: 0 }
  );
}

export function rankCharacterMatches(finalScores, characters, limit = characters.length) {
  const densityPenaltyMap = buildDensityPenaltyMap(characters);

  return [...characters]
    .map((character) => buildRankedMatch(finalScores, character, densityPenaltyMap))
    .sort((a, b) => a.adjustedDistance - b.adjustedDistance)
    .slice(0, limit);
}

export function rankDimensions(scores) {
  return [...DIMENSIONS].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
}
