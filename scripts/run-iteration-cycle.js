import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CHARACTERS } from '../src/data/characters.js';
import { QUESTIONS } from '../src/data/questions.js';
import { PERSONAS } from '../src/testing/personas.js';
import { runPersonaSimulation } from '../src/testing/simulation.js';
import { runNaturalLanguageSimulation } from '../src/testing/languageSimulation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const logsDir = path.join(rootDir, 'logs', 'iterations');

const args = process.argv.slice(2);
const maxIterationsArg = args.find((arg) => arg.startsWith('--max='));
const thresholdArg = args.find((arg) => arg.startsWith('--threshold='));
const maxIterations = Math.min(Number(maxIterationsArg?.split('=')[1] ?? 30), 50);
const satisfactionThreshold = Number(thresholdArg?.split('=')[1] ?? 80);

function createSeededRandom(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function computeSatisfactionScore(numericResult, languageResult) {
  const hardPenalty =
    numericResult.summary.calibrationNeededCount * 16 +
    languageResult.summary.reflectionCount * 12 +
    languageResult.summary.inconsistentOptionCount * 12;
  const softPenalty =
    numericResult.summary.avgExpectationGap * 2.2 +
    Math.max(0, languageResult.summary.avgOptionToResultGap - 2.2) * 6 +
    languageResult.summary.selfPerceptionDriftCount * 1.5;

  const score = 100 - hardPenalty - softPenalty;

  return Number(Math.max(0, Math.min(100, score)).toFixed(2));
}

function buildIterationAssessment(score, threshold, numericResult, languageResult) {
  if (score >= threshold && languageResult.summary.reflectionCount === 0 && languageResult.summary.inconsistentOptionCount === 0) {
    return {
      verdict: '满意',
      action: languageResult.summary.selfPerceptionDriftCount > 0
        ? '无需继续调分；保留结果解释层处理自我感知偏差。'
        : '无需继续调优；当前数值与语义直觉都稳定。',
    };
  }

  if (numericResult.summary.calibrationNeededCount > 0 || languageResult.summary.inconsistentOptionCount > 0) {
    return {
      verdict: '继续调优',
      action: '优先检查选项分值与语义映射，再重新执行测试。',
    };
  }

  return {
    verdict: '继续观察',
    action: '当前无硬性告警，但满意度未达阈值；继续积累样本验证稳定性。',
  };
}

function buildMarkdown(iteration, record) {
  const lines = [];
  lines.push(`# 迭代 ${String(iteration).padStart(2, '0')} 日志`);
  lines.push('');
  lines.push(`- 时间：${record.generatedAt}`);
  lines.push(`- 种子：${record.seed}`);
  lines.push(`- 满意度：${record.satisfactionScore} / 100`);
  lines.push(`- 判定：${record.verdict}`);
  lines.push(`- 动作：${record.action}`);
  lines.push('');
  lines.push('## 数值测试');
  lines.push(`- 平均预期偏差：${record.numeric.avgExpectationGap}`);
  lines.push(`- 校准告警：${record.numeric.calibrationNeededCount}`);
  lines.push('');
  lines.push('## 语义直觉测试');
  lines.push(`- 平均文本到结果偏差：${record.language.avgLanguageToResultGap}`);
  lines.push(`- 平均选项语义到结果偏差：${record.language.avgOptionToResultGap}`);
  lines.push(`- 语义反思：${record.language.reflectionCount}`);
  lines.push(`- 自我感知偏差：${record.language.selfPerceptionDriftCount}`);
  lines.push(`- 语义可疑选项：${record.language.inconsistentOptionCount}`);
  lines.push('');
  lines.push('## 说明');
  lines.push(`- ${record.note}`);
  lines.push('');
  return lines.join('\n');
}

function createQuestionHotspots() {
  return QUESTIONS.map((question) => ({
    questionId: question.id,
    questionText: question.text,
    options: question.options.map((option, index) => ({
      optionIndex: index,
      optionText: option.text,
      totalSelections: 0,
      subThresholdSelections: 0,
      reflectionSelections: 0,
      selfPerceptionSelections: 0,
    })),
  }));
}

function updateQuestionHotspots(hotspots, languageResult, isSubThreshold) {
  languageResult.reports.forEach((report) => {
    report.chosenOptions.forEach((choice) => {
      const question = hotspots.find((item) => item.questionId === choice.questionId);
      const option = question?.options.find((item) => item.optionIndex === choice.optionIndex);
      if (!option) {
        return;
      }

      option.totalSelections += 1;
      if (isSubThreshold) {
        option.subThresholdSelections += 1;
      }
      if (report.needsReflection) {
        option.reflectionSelections += 1;
      }
      if (report.selfPerceptionDrift) {
        option.selfPerceptionSelections += 1;
      }
    });
  });
}

function buildHotspotMarkdown(questionHotspots, iterations) {
  const lines = [];
  lines.push('## 题目热点');
  const totalDecisionCount = iterations * PERSONAS.length;

  questionHotspots.forEach((question) => {
    lines.push(`### Q${question.questionId}`);
    lines.push(`- ${question.questionText}`);

    question.options
      .map((option) => ({
        ...option,
        selectionRate: Number(((option.totalSelections / totalDecisionCount) * 100).toFixed(1)),
        subThresholdRate: Number(((option.subThresholdSelections / Math.max(1, option.totalSelections)) * 100).toFixed(1)),
        driftRate: Number(((option.selfPerceptionSelections / Math.max(1, option.totalSelections)) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.totalSelections - a.totalSelections)
      .forEach((option) => {
        lines.push(
          `- 选项 ${option.optionIndex + 1}：总命中 ${option.totalSelections} 次（占全部人格作答的 ${option.selectionRate}%），低满意轮次命中 ${option.subThresholdSelections} 次，占该选项命中的 ${option.subThresholdRate}%；自我感知偏差路径命中 ${option.selfPerceptionSelections} 次，占 ${option.driftRate}%`
        );
      });

    lines.push('');
  });

  return lines.join('\n');
}

async function main() {
  await mkdir(logsDir, { recursive: true });

  const history = [];
  const questionHotspots = createQuestionHotspots();

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const seed = 20260418 + iteration;
    const random = createSeededRandom(seed);
      const numericResult = runPersonaSimulation({
      personas: PERSONAS,
      questions: QUESTIONS,
      characters: CHARACTERS,
    });
    const languageResult = runNaturalLanguageSimulation({
      personas: PERSONAS,
      questions: QUESTIONS,
      characters: CHARACTERS,
      randomize: true,
        decisionNoise: 0.02,
      random,
    });

    const satisfactionScore = computeSatisfactionScore(numericResult, languageResult);
    const assessment = buildIterationAssessment(satisfactionScore, satisfactionThreshold, numericResult, languageResult);
    updateQuestionHotspots(questionHotspots, languageResult, satisfactionScore < satisfactionThreshold);
    const record = {
      iteration,
      seed,
      generatedAt: new Date().toISOString(),
      satisfactionScore,
      verdict: assessment.verdict,
      action: assessment.action,
      note:
        assessment.verdict === '满意'
          ? '数值与语义模拟均未出现需要改分的硬性问题，当前主要剩余的是个别人格的自我感知偏差。'
          : '本轮用于验证稳定性；若后续扩充人格样本出现新告警，应优先回看该轮附近的题目与语义日志。',
      numeric: {
        avgExpectationGap: numericResult.summary.avgExpectationGap,
        calibrationNeededCount: numericResult.summary.calibrationNeededCount,
      },
      language: {
        avgLanguageToResultGap: languageResult.summary.avgLanguageToResultGap,
        avgOptionToResultGap: languageResult.summary.avgOptionToResultGap,
        reflectionCount: languageResult.summary.reflectionCount,
        selfPerceptionDriftCount: languageResult.summary.selfPerceptionDriftCount,
        inconsistentOptionCount: languageResult.summary.inconsistentOptionCount,
      },
    };

    history.push(record);

    await writeFile(
      path.join(logsDir, `iteration-${String(iteration).padStart(2, '0')}.json`),
      `${JSON.stringify(record, null, 2)}\n`,
      'utf8'
    );
    await writeFile(
      path.join(logsDir, `iteration-${String(iteration).padStart(2, '0')}.md`),
      `${buildMarkdown(iteration, record)}\n`,
      'utf8'
    );
  }

  const averageSatisfaction = Number(
    (history.reduce((sum, item) => sum + item.satisfactionScore, 0) / history.length).toFixed(2)
  );
  const summary = {
    generatedAt: new Date().toISOString(),
    iterations: history.length,
    threshold: satisfactionThreshold,
    averageSatisfaction,
    minSatisfaction: Math.min(...history.map((item) => item.satisfactionScore)),
    maxSatisfaction: Math.max(...history.map((item) => item.satisfactionScore)),
    satisfiedIterations: history.filter((item) => item.satisfactionScore >= satisfactionThreshold).length,
    finalVerdict: averageSatisfaction >= satisfactionThreshold ? 'satisfied' : 'needs-more-work',
    questionHotspots,
  };

  await writeFile(path.join(logsDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  await writeFile(
    path.join(logsDir, 'summary.md'),
    [
      '# 迭代测试汇总',
      '',
      `- 迭代轮数：${summary.iterations}`,
      `- 满意阈值：${summary.threshold}`,
      `- 平均满意度：${summary.averageSatisfaction}`,
      `- 最低满意度：${summary.minSatisfaction}`,
      `- 最高满意度：${summary.maxSatisfaction}`,
      `- 达标轮数：${summary.satisfiedIterations}`,
      `- 最终结论：${summary.finalVerdict}`,
      '',
      buildHotspotMarkdown(questionHotspots, history.length),
      '',
      '## 说明',
      '- 每轮都包含数值模拟与自然语言直觉模拟。',
      '- 语义直觉模拟加入轻微决策噪声，以模拟真实用户读题时的波动。',
      '- 若平均满意度达标且不存在硬性校准告警，则视为当前版本稳定。',
      '',
    ].join('\n'),
    'utf8'
  );

  console.log(`完成 ${history.length} 轮迭代测试。`);
  console.log(`平均满意度: ${summary.averageSatisfaction}`);
  console.log(`达标轮数: ${summary.satisfiedIterations}/${summary.iterations}`);
  console.log(`最终结论: ${summary.finalVerdict}`);

  process.exitCode = summary.finalVerdict === 'satisfied' ? 0 : 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
