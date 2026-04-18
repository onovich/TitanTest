import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CHARACTERS } from '../src/data/characters.js';
import { QUESTIONS } from '../src/data/questions.js';
import { PERSONAS } from '../src/testing/personas.js';
import { runPersonaSimulation } from '../src/testing/simulation.js';
import { runNaturalLanguageSimulation } from '../src/testing/languageSimulation.js';
import { DIMENSION_LABELS } from '../src/logic/labels.js';
import { DIMENSIONS } from '../src/logic/scoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const reportsDir = path.join(rootDir, 'reports');
const strictMode = process.argv.includes('--strict');

function validateData() {
  const issues = [];

  QUESTIONS.forEach((question) => {
    const dimensionsInQuestion = new Set(
      question.options.flatMap((option) => Object.keys(option.scores))
    );

    if (dimensionsInQuestion.size < 2) {
      issues.push(`题目 ${question.id} 仅覆盖 ${dimensionsInQuestion.size} 个维度，低于最低要求。`);
    }

    question.options.forEach((option, index) => {
      Object.entries(option.scores).forEach(([dimension, value]) => {
        if (!DIMENSIONS.includes(dimension)) {
          issues.push(`题目 ${question.id} 选项 ${index + 1} 使用了未知维度 ${dimension}。`);
        }
        if (value < 1 || value > 10) {
          issues.push(`题目 ${question.id} 选项 ${index + 1} 在维度 ${dimension} 上的值 ${value} 超出 1-10。`);
        }
      });
    });
  });

  CHARACTERS.forEach((character) => {
    DIMENSIONS.forEach((dimension) => {
      const value = character.scores[dimension];
      if (typeof value !== 'number') {
        issues.push(`角色 ${character.name} 缺少维度 ${dimension}。`);
      }
      if (value < 1 || value > 10) {
        issues.push(`角色 ${character.name} 在维度 ${dimension} 上的值 ${value} 超出 1-10。`);
      }
    });
  });

  PERSONAS.forEach((persona) => {
    if (persona.picks.length !== QUESTIONS.length) {
      issues.push(`人格 ${persona.name} 的题目选择数为 ${persona.picks.length}，与题目数 ${QUESTIONS.length} 不一致。`);
    }
  });

  return issues;
}

function buildRecommendations(result, languageResult) {
  const recommendations = [];

  result.summary.topProblemDimensions.forEach(({ dimension, error }) => {
    if (error >= 1.5) {
      recommendations.push(`维度“${DIMENSION_LABELS[dimension] ?? dimension}”的平均误差为 ${error}，建议优先回看相关题目的分值设定。`);
    }
  });

  result.reports
    .filter((report) => report.needsCalibration)
    .forEach((report) => {
      recommendations.push(
        `人格“${report.persona}”出现明显背离：预期偏差 ${report.expectationGap}，维度感知偏差 ${report.dimensionalGap}；建议复查其高影响题目的选项分值。`
      );
    });

  languageResult.reports
    .filter((report) => report.needsReflection)
    .forEach((report) => {
      recommendations.push(
        `人格“${report.persona}”在自然语言直觉模拟中与结果角色存在背离：文本到结果偏差 ${report.languageToResultGap}，选项语义到结果偏差 ${report.optionToResultGap}；建议复查其高频命中的题目文案与分值。`
      );
    });

  languageResult.reports
    .filter((report) => report.selfPerceptionDrift)
    .forEach((report) => {
      recommendations.push(
        `人格“${report.persona}”更像是“自我认知与实际作答存在偏差”：自我叙事到结果偏差 ${report.languageToResultGap}，但选项语义到结果偏差仅 ${report.optionToResultGap}。建议在结果页提示“你的选择比自我描述更接近 ${report.matchedCharacter}”。`
      );
    });

  languageResult.questionConsistency
    .filter((item) => item.warning)
    .forEach((item) => {
      recommendations.push(
        `题目 ${item.questionId} 的选项“${item.optionText}”文本语义 Top 维度为 ${item.textTop.join(' / ')}，与数值 Top 维度 ${item.numericTop.join(' / ')} 重合偏低，建议人工复核。`
      );
    });

  if (!recommendations.length) {
    recommendations.push('当前人格样本未触发明显校准告警，可继续扩充人格样本覆盖面。');
  }

  return recommendations;
}

function buildMarkdown(result, languageResult, issues, recommendations) {
  const lines = [];

  lines.push('# 人格模拟自动化测试报告');
  lines.push('');
  lines.push('## 数值模拟概览');
  lines.push(`- 人格样本数：${result.summary.personaCount}`);
  lines.push(`- 平均预期偏差：${result.summary.avgExpectationGap}`);
  lines.push(`- 触发校准告警的人格数：${result.summary.calibrationNeededCount}`);
  lines.push('');
  lines.push('## 数值主要问题维度');
  result.summary.topProblemDimensions.forEach(({ dimension, error }) => {
    lines.push(`- ${DIMENSION_LABELS[dimension] ?? dimension}：${error}`);
  });
  lines.push('');
  lines.push('## 数值人格明细');

  result.reports.forEach((report) => {
    lines.push(`### ${report.persona}`);
    lines.push(`- 匹配角色：${report.matchName}`);
    lines.push(`- 预期偏差：${report.expectationGap}`);
    lines.push(`- 维度感知偏差：${report.dimensionalGap}`);
    lines.push(`- 是否需要校准：${report.needsCalibration ? '是' : '否'}`);
    lines.push(`- 最终分数：${JSON.stringify(report.finalScores)}`);
    lines.push(`- 预期分数：${JSON.stringify(report.expectedScores)}`);
    lines.push('');
  });

  lines.push('## 自然语言直觉模拟概览');
  lines.push(`- 平均文本到结果偏差：${languageResult.summary.avgLanguageToResultGap}`);
  lines.push(`- 平均选项语义到结果偏差：${languageResult.summary.avgOptionToResultGap}`);
  lines.push(`- 需要反思的人格数：${languageResult.summary.reflectionCount}`);
  lines.push(`- 自我感知偏差人格数：${languageResult.summary.selfPerceptionDriftCount}`);
  lines.push(`- 语义可疑选项数：${languageResult.summary.inconsistentOptionCount}`);
  lines.push('');
  lines.push('## 自然语言人格明细');

  languageResult.reports.forEach((report) => {
    lines.push(`### ${report.persona}`);
    lines.push(`- 匹配角色：${report.matchedCharacter}`);
    lines.push(`- 文本到结果偏差：${report.languageToResultGap}`);
    lines.push(`- 选项语义到结果偏差：${report.optionToResultGap}`);
    lines.push(`- 语义 Top2 重合率：${report.semanticTopOverlap}`);
    lines.push(`- 是否需要反思：${report.needsReflection ? '是' : '否'}`);
    lines.push(`- 是否属于自我感知偏差：${report.selfPerceptionDrift ? '是' : '否'}`);
    lines.push(`- 自动选择路径：${report.chosenOptions.map((item) => `Q${item.questionId}-${item.optionIndex + 1}`).join(', ')}`);
    lines.push('');
  });

  lines.push('## 语义可疑选项');
  const warnings = languageResult.questionConsistency.filter((item) => item.warning);
  if (warnings.length) {
    warnings.forEach((item) => {
      lines.push(`- Q${item.questionId} 选项 ${item.optionIndex + 1}：文本 Top=${item.textTop.join('/')}；数值 Top=${item.numericTop.join('/')}；重合=${item.overlap}`);
    });
  } else {
    lines.push('- 未发现明显语义-数值错位的选项。');
  }

  lines.push('## 数据校验');
  if (issues.length) {
    issues.forEach((issue) => lines.push(`- ${issue}`));
  } else {
    lines.push('- 未发现结构性数据问题。');
  }
  lines.push('');

  lines.push('## 调整建议');
  recommendations.forEach((recommendation) => lines.push(`- ${recommendation}`));
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const issues = validateData();
  const result = runPersonaSimulation({
    personas: PERSONAS,
    questions: QUESTIONS,
    characters: CHARACTERS,
  });
  const languageResult = runNaturalLanguageSimulation({
    personas: PERSONAS,
    questions: QUESTIONS,
    characters: CHARACTERS,
  });
  const recommendations = buildRecommendations(result, languageResult);
  const reportPayload = {
    generatedAt: new Date().toISOString(),
    strictMode,
    issues,
    summary: result.summary,
    reports: result.reports,
    semanticSummary: languageResult.summary,
    semanticReports: languageResult.reports,
    semanticQuestionConsistency: languageResult.questionConsistency,
    recommendations,
  };

  await mkdir(reportsDir, { recursive: true });
  await writeFile(
    path.join(reportsDir, 'persona-simulation-report.json'),
    `${JSON.stringify(reportPayload, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    path.join(reportsDir, 'persona-simulation-report.md'),
    `${buildMarkdown(result, languageResult, issues, recommendations)}\n`,
    'utf8'
  );

  console.log('人格模拟自动化测试完成。');
  console.log(`平均预期偏差: ${result.summary.avgExpectationGap}`);
  console.log(`触发校准告警的人格数: ${result.summary.calibrationNeededCount}`);
  console.log('主要问题维度:');
  result.summary.topProblemDimensions.forEach(({ dimension, error }) => {
    console.log(`- ${DIMENSION_LABELS[dimension] ?? dimension}: ${error}`);
  });
  console.log(`自然语言模拟需反思人格数: ${languageResult.summary.reflectionCount}`);
  console.log(`自然语言模拟自我感知偏差人格数: ${languageResult.summary.selfPerceptionDriftCount}`);
  console.log(`语义可疑选项数: ${languageResult.summary.inconsistentOptionCount}`);

  if (issues.length) {
    console.log('数据校验问题:');
    issues.forEach((issue) => console.log(`- ${issue}`));
  }

  const flagged = result.reports.filter((report) => report.needsCalibration);
  if (flagged.length) {
    console.log('需要校准的人格:');
    flagged.forEach((report) => {
      console.log(
        `- ${report.persona}: 匹配 ${report.matchName}，预期偏差 ${report.expectationGap}，维度感知偏差 ${report.dimensionalGap}`
      );
    });
  }

  const reflected = languageResult.reports.filter((report) => report.needsReflection);
  if (reflected.length) {
    console.log('需要语义复核的人格:');
    reflected.forEach((report) => {
      console.log(
        `- ${report.persona}: 匹配 ${report.matchedCharacter}，文本到结果偏差 ${report.languageToResultGap}，选项语义到结果偏差 ${report.optionToResultGap}`
      );
    });
  }

  const selfDriftReports = languageResult.reports.filter((report) => report.selfPerceptionDrift);
  if (selfDriftReports.length) {
    console.log('存在自我感知偏差的人格:');
    selfDriftReports.forEach((report) => {
      console.log(
        `- ${report.persona}: 匹配 ${report.matchedCharacter}，自我叙事到结果偏差 ${report.languageToResultGap}，但选项语义到结果偏差仅 ${report.optionToResultGap}`
      );
    });
  }

  if (
    strictMode &&
    (issues.length ||
      result.summary.calibrationNeededCount > 0 ||
      languageResult.summary.reflectionCount > 0 ||
      languageResult.summary.inconsistentOptionCount > 0)
  ) {
    process.exitCode = 1;
    return;
  }

  process.exitCode = 0;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
