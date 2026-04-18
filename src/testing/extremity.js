import { QUESTION_EXTREMITY_REVIEW } from '../data/questionExtremityReview.js';

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
}

function toModerationScore(rawAverage) {
  const normalized = Math.max(0, Math.min(1, (5 - rawAverage) / 4));
  return Number((normalized * 100).toFixed(2));
}

export function evaluateQuestionExtremity(questions) {
  const reviewMap = new Map(QUESTION_EXTREMITY_REVIEW.map((item) => [item.id, item]));
  const items = questions.map((question) => {
    const review = reviewMap.get(question.id);
    const optionReviews = review?.optionScores ?? question.options.map(() => 3);

    return {
      id: question.id,
      text: question.text,
      stemScore: review?.stemScore ?? 3,
      note: review?.note ?? '',
      options: question.options.map((option, index) => ({
        index,
        text: option.text,
        score: optionReviews[index] ?? 3,
      })),
    };
  });

  const stemScores = items.map((item) => item.stemScore);
  const optionScores = items.flatMap((item) => item.options.map((option) => option.score));
  const promptAverage = Number(average(stemScores).toFixed(3));
  const optionAverage = Number(average(optionScores).toFixed(3));
  const promptMax = Number(Math.max(...stemScores).toFixed(3));
  const optionMax = Number(Math.max(...optionScores).toFixed(3));
  const flaggedPrompts = items.filter((item) => item.stemScore > 3);
  const flaggedOptions = items.flatMap((item) =>
    item.options
      .filter((option) => option.score > 3)
      .map((option) => ({ questionId: item.id, optionIndex: option.index, text: option.text, score: option.score }))
  );

  return {
    promptAverage,
    optionAverage,
    promptMax,
    optionMax,
    promptScore: toModerationScore(promptAverage),
    optionScore: toModerationScore(optionAverage),
    flaggedPromptCount: flaggedPrompts.length,
    flaggedOptionCount: flaggedOptions.length,
    items,
    flaggedPrompts,
    flaggedOptions,
  };
}

export function buildExtremityMarkdownReport(report) {
  const lines = [];
  lines.push('# 题库极端性人工复评分');
  lines.push('');
  lines.push('- 评分说明：1=非常中庸；3=略带戏剧性但可接受；5=明显极端/戏剧化');
  lines.push(`- 题干平均分：${report.promptAverage}`);
  lines.push(`- 选项平均分：${report.optionAverage}`);
  lines.push(`- 题干中庸得分：${report.promptScore}`);
  lines.push(`- 选项中庸得分：${report.optionScore}`);
  lines.push('');

  report.items.forEach((item) => {
    lines.push(`## Q${item.id}`);
    lines.push(`- 题干分：${item.stemScore}`);
    lines.push(`- 题干：${item.text}`);
    lines.push(`- 备注：${item.note || '—'}`);
    item.options.forEach((option) => {
      lines.push(`- 选项 ${option.index + 1}｜分 ${option.score}：${option.text}`);
    });
    lines.push('');
  });

  return lines.join('\n');
}
