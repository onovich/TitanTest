import { INITIAL_SCORES, mergeOptionScores, findBestMatch, euclideanDistance, rankDimensions, DIMENSIONS } from '../logic/scoring';

function average(values) {
  return values.reduce((s, v) => s + v, 0) / (values.length || 1);
}

function overlapRate(arrA, arrB, topN = 2) {
  const a = new Set(arrA.slice(0, topN));
  const b = new Set(arrB.slice(0, topN));
  let same = 0;
  a.forEach((item) => {
    if (b.has(item)) same += 1;
  });
  return same / topN;
}

export function runPersonaSimulation({ personas, questions, characters }) {
  const reports = personas.map((persona) => {
    let scores = { ...INITIAL_SCORES };

    questions.forEach((q, index) => {
      const pickIndex = persona.picks[index] ?? 0;
      const option = q.options[pickIndex] ?? q.options[0];
      scores = mergeOptionScores(scores, option.scores);
    });

    const { character, distance } = findBestMatch(scores, characters);
    const expectationGap = euclideanDistance(scores, persona.expectedScores);
    const dimensionalGap = overlapRate(rankDimensions(scores), persona.expectedTopDimensions);

    return {
      persona: persona.name,
      expectedScores: persona.expectedScores,
      finalScores: scores,
      matchName: character?.name,
      matchDistance: Number(distance.toFixed(3)),
      expectationGap: Number(expectationGap.toFixed(3)),
      dimensionalGap: Number((1 - dimensionalGap).toFixed(3)),
      needsCalibration: expectationGap > 3 || dimensionalGap < 0.5,
    };
  });

  const dimensionError = DIMENSIONS.reduce((acc, key) => {
    const absErrors = reports.map((r) => Math.abs((r.finalScores[key] ?? 5) - (r.expectedScores[key] ?? 5)));
    acc[key] = Number(average(absErrors).toFixed(3));
    return acc;
  }, {});

  const sortedDimensionError = Object.entries(dimensionError)
    .sort((a, b) => b[1] - a[1])
    .map(([dimension, error]) => ({ dimension, error }));

  return {
    summary: {
      personaCount: personas.length,
      avgExpectationGap: Number(average(reports.map((r) => r.expectationGap)).toFixed(3)),
      calibrationNeededCount: reports.filter((r) => r.needsCalibration).length,
      topProblemDimensions: sortedDimensionError.slice(0, 3),
    },
    reports,
  };
}
