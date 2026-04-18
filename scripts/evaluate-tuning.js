import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CHARACTERS } from '../src/data/characters.js';
import { QUESTIONS } from '../src/data/questions.js';
import { PERSONAS } from '../src/testing/personas.js';
import { runPersonaSimulation } from '../src/testing/simulation.js';
import { runNaturalLanguageSimulation } from '../src/testing/languageSimulation.js';
import { INITIAL_SCORES, DIMENSIONS, euclideanDistance, mergeOptionScores, rankCharacterMatches } from '../src/logic/scoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const workflowPath = path.join(rootDir, 'AUTOTUNE_WORKFLOW.md');

function createSeededRandom(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
}

function entropy(probabilities) {
  return probabilities.reduce((sum, probability) => {
    if (probability <= 0) return sum;
    return sum - probability * Math.log2(probability);
  }, 0);
}

function simulateRandomRun(random) {
  let scores = { ...INITIAL_SCORES };

  QUESTIONS.forEach((question) => {
    const optionIndex = Math.floor(random() * question.options.length);
    const option = question.options[optionIndex];
    scores = mergeOptionScores(scores, option.scores, question.weight ?? 1);
  });

  const rankedMatches = rankCharacterMatches(scores, CHARACTERS, CHARACTERS.length);
  return {
    winner: rankedMatches[0],
    runnerUp: rankedMatches[1],
  };
}

function evaluateBalance(sampleSize, seed) {
  const random = createSeededRandom(seed);
  const counts = new Map(CHARACTERS.map((character) => [character.name, 0]));
  const confidenceGaps = [];

  for (let index = 0; index < sampleSize; index += 1) {
    const result = simulateRandomRun(random);
    counts.set(result.winner.character.name, (counts.get(result.winner.character.name) ?? 0) + 1);
    confidenceGaps.push(result.runnerUp ? result.runnerUp.adjustedDistance - result.winner.adjustedDistance : 0);
  }

  const distribution = [...counts.entries()]
    .map(([name, count]) => ({ name, count, share: count / sampleSize }))
    .sort((a, b) => b.count - a.count);

  const probabilities = distribution.map((item) => item.share);
  const activeRoleCount = distribution.filter((item) => item.count > 0).length;

  const topShare = distribution[0]?.share ?? 1;
  const distributionEntropy = entropy(probabilities);
  const maxEntropy = Math.log2(CHARACTERS.length);
  const normalizedEntropy = maxEntropy > 0 ? distributionEntropy / maxEntropy : 0;
  const averageConfidenceGap = average(confidenceGaps);
  const activeRatio = activeRoleCount / CHARACTERS.length;

  const balanceScore = Math.max(
    0,
    Math.min(
      100,
      100
        - Math.max(0, topShare * 100 - 18) * 1.75
        + normalizedEntropy * 28
        - (1 - activeRatio) * 34
        - Math.max(0, averageConfidenceGap - 0.9) * 12
    )
  );

  return {
    sampleSize,
    seed,
    topShare: Number((topShare * 100).toFixed(2)),
    topCharacter: distribution[0]?.name ?? null,
    normalizedEntropy: Number(normalizedEntropy.toFixed(3)),
    averageConfidenceGap: Number(averageConfidenceGap.toFixed(3)),
    activeRoleCount,
    balanceScore: Number(balanceScore.toFixed(2)),
    distribution: distribution.map((item) => ({
      name: item.name,
      count: item.count,
      share: Number((item.share * 100).toFixed(2)),
    })),
  };
}

function evaluatePersona() {
  const numericResult = runPersonaSimulation({ personas: PERSONAS, questions: QUESTIONS, characters: CHARACTERS });
  const languageResult = runNaturalLanguageSimulation({ personas: PERSONAS, questions: QUESTIONS, characters: CHARACTERS });

  const personaScore = Math.max(
    0,
    Math.min(
      100,
      100
        - numericResult.summary.avgExpectationGap * 5.2
        - numericResult.summary.calibrationNeededCount * 18
        - languageResult.summary.reflectionCount * 14
        - languageResult.summary.inconsistentOptionCount * 12
        - languageResult.summary.selfPerceptionDriftCount * 2.2
    )
  );

  return {
    personaScore: Number(personaScore.toFixed(2)),
    avgExpectationGap: numericResult.summary.avgExpectationGap,
    calibrationNeededCount: numericResult.summary.calibrationNeededCount,
    reflectionCount: languageResult.summary.reflectionCount,
    selfPerceptionDriftCount: languageResult.summary.selfPerceptionDriftCount,
    inconsistentOptionCount: languageResult.summary.inconsistentOptionCount,
    avgLanguageToResultGap: languageResult.summary.avgLanguageToResultGap,
    avgOptionToResultGap: languageResult.summary.avgOptionToResultGap,
  };
}

async function main() {
  const sampleSize = Number(process.argv.find((arg) => arg.startsWith('--samples='))?.split('=')[1] ?? 6000);
  const seed = Number(process.argv.find((arg) => arg.startsWith('--seed='))?.split('=')[1] ?? 20260418);
  const workflowText = await readFile(workflowPath, 'utf8');
  const persona = evaluatePersona();
  const balance = evaluateBalance(sampleSize, seed);
  const scoreGap = Number(Math.abs(persona.personaScore - balance.balanceScore).toFixed(2));
  const combinedScore = Number((persona.personaScore + balance.balanceScore - scoreGap * 0.8).toFixed(2));

  const payload = {
    generatedAt: new Date().toISOString(),
    workflowLength: workflowText.length,
    sampleSize,
    seed,
    persona,
    balance,
    scoreGap,
    combinedScore,
  };

  console.log(JSON.stringify(payload, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
