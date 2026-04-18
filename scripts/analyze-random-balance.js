import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CHARACTERS } from '../src/data/characters.js';
import { QUESTIONS } from '../src/data/questions.js';
import { INITIAL_SCORES, DIMENSIONS, euclideanDistance, mergeOptionScores, rankCharacterMatches } from '../src/logic/scoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const reportsDir = path.join(rootDir, 'reports');

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

function standardDeviation(values) {
  const avg = average(values);
  return Math.sqrt(average(values.map((value) => (value - avg) ** 2)));
}

function entropy(probabilities) {
  return probabilities.reduce((sum, probability) => {
    if (probability <= 0) return sum;
    return sum - probability * Math.log2(probability);
  }, 0);
}

function simulateRandomRun(random) {
  let scores = { ...INITIAL_SCORES };
  const picks = [];

  QUESTIONS.forEach((question) => {
    const optionIndex = Math.floor(random() * question.options.length);
    const option = question.options[optionIndex];
    picks.push({ questionId: question.id, optionIndex });
    scores = mergeOptionScores(scores, option.scores, question.weight ?? 1);
  });

  const rankedMatches = rankCharacterMatches(scores, CHARACTERS, CHARACTERS.length);
  return {
    picks,
    scores,
    winner: rankedMatches[0],
    runnerUp: rankedMatches[1],
    confidenceGap: Number((rankedMatches[1].distance - rankedMatches[0].distance).toFixed(3)),
  };
}

function analyzeCharacterCentrality() {
  return CHARACTERS.map((character) => {
    const averageDistanceToOthers = average(
      CHARACTERS.filter((other) => other.name !== character.name).map((other) => euclideanDistance(character.scores, other.scores))
    );
    const distanceToNeutral = euclideanDistance(character.scores, INITIAL_SCORES);

    return {
      name: character.name,
      averageDistanceToOthers: Number(averageDistanceToOthers.toFixed(3)),
      distanceToNeutral: Number(distanceToNeutral.toFixed(3)),
    };
  }).sort((a, b) => a.averageDistanceToOthers - b.averageDistanceToOthers);
}

function summarizeDimensionSpread() {
  return DIMENSIONS.map((dimension) => {
    const values = CHARACTERS.map((character) => character.scores[dimension]);
    return {
      dimension,
      average: Number(average(values).toFixed(3)),
      deviation: Number(standardDeviation(values).toFixed(3)),
      min: Math.min(...values),
      max: Math.max(...values),
    };
  });
}

function buildMarkdown(report) {
  const lines = [];
  lines.push('# 随机答题均衡性分析');
  lines.push('');
  lines.push(`- 样本数：${report.sampleSize}`);
  lines.push(`- 最大命中角色：${report.topCharacter.name}（${report.topCharacter.count} 次，占比 ${report.topCharacter.share}%）`);
  lines.push(`- 命中分布熵：${report.distributionEntropy} / ${report.maxEntropy}`);
  lines.push(`- 平均第一二名距离差：${report.averageConfidenceGap}`);
  lines.push('');
  lines.push('## 角色命中分布');
  report.distribution.forEach((item) => {
    lines.push(`- ${item.name}：${item.count} 次（${item.share}%）`);
  });
  lines.push('');
  lines.push('## 角色中心性');
  report.centrality.forEach((item) => {
    lines.push(`- ${item.name}：到其他角色平均距离 ${item.averageDistanceToOthers}；到中性点距离 ${item.distanceToNeutral}`);
  });
  lines.push('');
  lines.push('## 维度离散度');
  report.dimensionSpread.forEach((item) => {
    lines.push(`- ${item.dimension}：均值 ${item.average}，标准差 ${item.deviation}，范围 ${item.min}-${item.max}`);
  });
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const sampleSize = Number(process.argv.find((arg) => arg.startsWith('--samples='))?.split('=')[1] ?? 5000);
  const seed = Number(process.argv.find((arg) => arg.startsWith('--seed='))?.split('=')[1] ?? 20260418);
  const random = createSeededRandom(seed);
  const counts = new Map(CHARACTERS.map((character) => [character.name, 0]));
  const confidenceGaps = [];

  for (let index = 0; index < sampleSize; index += 1) {
    const result = simulateRandomRun(random);
    counts.set(result.winner.character.name, (counts.get(result.winner.character.name) ?? 0) + 1);
    confidenceGaps.push(result.confidenceGap);
  }

  const distribution = [...counts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      share: Number(((count / sampleSize) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);

  const probabilities = distribution.map((item) => item.count / sampleSize);
  const centrality = analyzeCharacterCentrality();
  const dimensionSpread = summarizeDimensionSpread();
  const report = {
    generatedAt: new Date().toISOString(),
    sampleSize,
    seed,
    topCharacter: distribution[0],
    averageConfidenceGap: Number(average(confidenceGaps).toFixed(3)),
    distributionEntropy: Number(entropy(probabilities).toFixed(3)),
    maxEntropy: Number(Math.log2(CHARACTERS.length).toFixed(3)),
    distribution,
    centrality,
    dimensionSpread,
  };

  await mkdir(reportsDir, { recursive: true });
  await writeFile(path.join(reportsDir, 'random-balance-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(path.join(reportsDir, 'random-balance-report.md'), `${buildMarkdown(report)}\n`, 'utf8');

  console.log(`随机测试样本: ${sampleSize}`);
  console.log(`最大命中角色: ${report.topCharacter.name} (${report.topCharacter.share}%)`);
  console.log(`分布熵: ${report.distributionEntropy}/${report.maxEntropy}`);
  distribution.slice(0, 10).forEach((item) => {
    console.log(`- ${item.name}: ${item.count} (${item.share}%)`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});