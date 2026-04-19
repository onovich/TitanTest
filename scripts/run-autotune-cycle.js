import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const runtimeTuningPath = path.join(rootDir, 'src', 'data', 'runtimeTuning.js');
const characterTuningPath = path.join(rootDir, 'src', 'data', 'characterTuning.js');
const workflowPath = path.join(rootDir, 'AUTOTUNE_WORKFLOW.md');
const logsDir = path.join(rootDir, 'logs', 'autotune');
const statePath = path.join(logsDir, 'best-state.json');

const args = process.argv.slice(2);
const maxIterations = Math.min(Number(args.find((arg) => arg.startsWith('--max='))?.split('=')[1] ?? 100), 100);
const minIterations = Math.max(1, Number(args.find((arg) => arg.startsWith('--min='))?.split('=')[1] ?? 1));
const balanceSamples = Number(args.find((arg) => arg.startsWith('--samples='))?.split('=')[1] ?? 6000);
const commitEachIteration = !args.includes('--no-commit');

function parseExportedConst(text, constantName) {
  const executable = text.replace(new RegExp(`^export const\\s+${constantName}\\s*=\\s*`), `const ${constantName} = `);
  const factory = new Function(`${executable}; return ${constantName};`);
  return factory();
}

function stringifyRuntimeTuning(config) {
  return `export const RUNTIME_TUNING = ${JSON.stringify(config, null, 2)};\n`;
}

function stringifyCharacterTuning(config) {
  return `export const CHARACTER_TUNING = ${JSON.stringify(config, null, 2)};\n`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mutateRuntimeConfig(config, iteration, mode, variant = 'balanced') {
  const next = JSON.parse(JSON.stringify(config));
  const direction = iteration % 2 === 0 ? 1 : -1;
  const fineStep = mode === 'recover' ? 0.03 : 0.05;

  if (variant === 'density') {
    next.matchDensityPenaltyWeight = clamp(next.matchDensityPenaltyWeight + 0.22, 0.2, 6);
    next.ambiguityCenter = clamp(next.ambiguityCenter + 0.15, 8.5, 12.5);
    next.ambiguityWidth = clamp(next.ambiguityWidth + 0.12, 3, 7.5);
    return next;
  }

  if (variant === 'restore') {
    next.optionScoreCalibrationStrengths.realism = clamp(next.optionScoreCalibrationStrengths.realism - 0.02, 0.08, 0.7);
    next.optionScoreCalibrationStrengths.cause = clamp(next.optionScoreCalibrationStrengths.cause - 0.02, 0.06, 0.6);
    next.matchDensityPenaltyWeight = clamp(next.matchDensityPenaltyWeight - 0.18, 0.2, 6);
    next.ambiguityCenter = clamp(next.ambiguityCenter - 0.12, 8.5, 12.5);
    return next;
  }

  next.optionScoreCalibrationStrengths.realism = clamp(next.optionScoreCalibrationStrengths.realism + 0.02 * direction, 0.08, 0.7);
  next.optionScoreCalibrationStrengths.cause = clamp(next.optionScoreCalibrationStrengths.cause + 0.015 * direction, 0.06, 0.6);
  next.optionScoreCalibrationStrengths.fatalism = clamp(next.optionScoreCalibrationStrengths.fatalism + 0.01 * -direction, 0.02, 0.28);
  next.optionScoreCalibrationStrengths.freedom = clamp(next.optionScoreCalibrationStrengths.freedom + fineStep * -0.5 * direction, 0.04, 0.35);
  next.optionScoreCalibrationStrengths.moral = clamp(next.optionScoreCalibrationStrengths.moral + 0.01 * (direction > 0 ? 1 : -1), 0, 0.18);
  next.matchDensityPenaltyWeight = clamp(next.matchDensityPenaltyWeight + 0.18 * direction, 0.2, 6);
  next.ambiguityCenter = clamp(next.ambiguityCenter + 0.16 * direction, 8.5, 12.5);
  next.ambiguityWidth = clamp(next.ambiguityWidth + 0.12 * (direction > 0 ? 1 : -1), 3, 7.5);

  return next;
}

function mutateCharacterTuning(config, evaluation, iteration, mode, variant = 'balanced') {
  const next = JSON.parse(JSON.stringify(config));
  const direction = mode === 'recover' ? 0.02 : 0.03;
  const distribution = evaluation.balance.distribution ?? [];
  const topEntries = distribution.filter((item) => item.share > 0).slice(0, 4);
  const weakEntries = distribution.filter((item) => item.share > 0 && item.share < 1.2).slice(0, 4);

  if (variant === 'identity') {
    return next;
  }

  topEntries.forEach((entry, index) => {
    const currentScale = next.signalScales[entry.name] ?? 1;
    next.signalScales[entry.name] = clamp(currentScale + Math.max(0.008, direction - index * 0.006), 0.86, 1.28);
  });

  weakEntries.forEach((entry, index) => {
    const currentScale = next.signalScales[entry.name] ?? 1;
    next.signalScales[entry.name] = clamp(currentScale - Math.max(0.006, 0.015 - index * 0.003), 0.86, 1.28);
  });

  if (variant === 'focus-top' && topEntries[0]) {
    const name = topEntries[0].name;
    next.signalScales[name] = clamp((next.signalScales[name] ?? 1) + 0.04, 0.86, 1.28);
  }

  return next;
}

function getModerationFloor(evaluation) {
  return evaluation.extremity?.dramaticityScore ?? 0;
}

function getRegressionSummary(candidateEvaluation, baselineEvaluation) {
  return {
    personaDrop: Math.max(0, baselineEvaluation.persona.personaScore - candidateEvaluation.persona.personaScore),
    balanceDrop: Math.max(0, baselineEvaluation.balance.balanceScore - candidateEvaluation.balance.balanceScore),
    promptDrop: Math.max(0, (baselineEvaluation.extremity?.promptScore ?? 0) - (candidateEvaluation.extremity?.promptScore ?? 0)),
    optionDrop: Math.max(0, (baselineEvaluation.extremity?.optionScore ?? 0) - (candidateEvaluation.extremity?.optionScore ?? 0)),
    dramaticityDrop: Math.max(0, (baselineEvaluation.extremity?.dramaticityScore ?? 0) - (candidateEvaluation.extremity?.dramaticityScore ?? 0)),
    clarityDrop: Math.max(0, (baselineEvaluation.quality?.clarityScore ?? 0) - (candidateEvaluation.quality?.clarityScore ?? 0)),
    differentiationDrop: Math.max(0, (baselineEvaluation.quality?.differentiationScore ?? 0) - (candidateEvaluation.quality?.differentiationScore ?? 0)),
    gapIncrease: Math.max(0, candidateEvaluation.scoreGap - baselineEvaluation.scoreGap),
    reflectionIncrease: Math.max(0, candidateEvaluation.persona.reflectionCount - baselineEvaluation.persona.reflectionCount),
    driftIncrease: Math.max(0, candidateEvaluation.persona.selfPerceptionDriftCount - baselineEvaluation.persona.selfPerceptionDriftCount),
    inconsistencyIncrease: Math.max(0, candidateEvaluation.persona.inconsistentOptionCount - baselineEvaluation.persona.inconsistentOptionCount),
  };
}

function rankCandidate(candidateEvaluation, bestEvaluation) {
  const moderationFloor = getModerationFloor(candidateEvaluation);
  const regression = getRegressionSummary(candidateEvaluation, bestEvaluation);
  const improvementBonus =
    ((candidateEvaluation.extremity?.dramaticityScore ?? 0) > (bestEvaluation.extremity?.dramaticityScore ?? 0) ? 14 : 0) +
    ((candidateEvaluation.quality?.differentiationScore ?? 0) > (bestEvaluation.quality?.differentiationScore ?? 0) ? 12 : 0) +
    ((candidateEvaluation.quality?.clarityScore ?? 0) > (bestEvaluation.quality?.clarityScore ?? 0) ? 10 : 0) +
    (candidateEvaluation.persona.personaScore > bestEvaluation.persona.personaScore ? 6 : 0) +
    (candidateEvaluation.balance.balanceScore > bestEvaluation.balance.balanceScore ? 5 : 0) +
    (candidateEvaluation.scoreGap < bestEvaluation.scoreGap ? 6 : 0);

  const regressionPenalty =
    regression.dramaticityDrop * 3.8 +
    regression.differentiationDrop * 3.4 +
    regression.clarityDrop * 2.8 +
    regression.personaDrop * 1.9 +
    regression.balanceDrop * 1.5 +
    regression.promptDrop * 0.9 +
    regression.optionDrop * 0.9 +
    regression.gapIncrease * 1.8 +
    regression.reflectionIncrease * 8 +
    regression.driftIncrease * 4 +
    regression.inconsistencyIncrease * 5;

  return Number(
    (
      candidateEvaluation.combinedScore +
      (candidateEvaluation.extremity?.dramaticityScore ?? 0) * 0.75 +
      (candidateEvaluation.quality?.differentiationScore ?? 0) * 0.58 +
      (candidateEvaluation.quality?.clarityScore ?? 0) * 0.5 +
      candidateEvaluation.persona.personaScore * 0.18 +
      candidateEvaluation.balance.balanceScore * 0.12 +
      moderationFloor * 0.1 +
      candidateEvaluation.balance.activeRoleCount * 1.2 +
      improvementBonus -
      regressionPenalty
    ).toFixed(2)
  );
}

function shouldAcceptCandidate(candidateEvaluation, bestEvaluation) {
  const regression = getRegressionSummary(candidateEvaluation, bestEvaluation);
  const moderationFloor = getModerationFloor(candidateEvaluation);
  const bestModerationFloor = getModerationFloor(bestEvaluation);

  const noMajorRegression =
    regression.personaDrop <= 1.2 &&
    regression.balanceDrop <= 2.5 &&
    regression.promptDrop <= 1.5 &&
    regression.optionDrop <= 1.5 &&
    regression.gapIncrease <= 2.2 &&
    regression.reflectionIncrease <= 0 &&
    regression.driftIncrease <= 0 &&
    regression.inconsistencyIncrease <= 0;

  const strongOverallImprovement =
    candidateEvaluation.combinedScore >= bestEvaluation.combinedScore + 2.5 &&
    (candidateEvaluation.extremity?.dramaticityScore ?? 0) >= (bestEvaluation.extremity?.dramaticityScore ?? 0) - 1.2 &&
    (candidateEvaluation.quality?.differentiationScore ?? 0) >= (bestEvaluation.quality?.differentiationScore ?? 0) - 1.5 &&
    (candidateEvaluation.quality?.clarityScore ?? 0) >= (bestEvaluation.quality?.clarityScore ?? 0) - 1.5 &&
    candidateEvaluation.persona.personaScore >= bestEvaluation.persona.personaScore - 1.4 &&
    candidateEvaluation.balance.balanceScore >= bestEvaluation.balance.balanceScore - 2.5 &&
    moderationFloor >= bestModerationFloor - 0.8;

  const multiMetricImprovementCount = [
    (candidateEvaluation.extremity?.dramaticityScore ?? 0) > (bestEvaluation.extremity?.dramaticityScore ?? 0),
    (candidateEvaluation.quality?.differentiationScore ?? 0) > (bestEvaluation.quality?.differentiationScore ?? 0),
    (candidateEvaluation.quality?.clarityScore ?? 0) > (bestEvaluation.quality?.clarityScore ?? 0),
    candidateEvaluation.persona.personaScore > bestEvaluation.persona.personaScore,
    candidateEvaluation.balance.balanceScore > bestEvaluation.balance.balanceScore,
    candidateEvaluation.scoreGap < bestEvaluation.scoreGap,
  ].filter(Boolean).length;

  return noMajorRegression && (strongOverallImprovement || multiMetricImprovementCount >= 3);
}

function runJsonCommand(argsList) {
  const output = execFileSync('node', argsList, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return JSON.parse(output);
}

function runShell(command) {
  return execFileSync('powershell', ['-NoProfile', '-Command', command], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function isSatisfied(evaluation) {
  return (
    (evaluation.extremity?.dramaticityScore ?? 0) >= 84 &&
    (evaluation.quality?.differentiationScore ?? 0) >= 80 &&
    (evaluation.quality?.clarityScore ?? 0) >= 78 &&
    evaluation.persona.personaScore >= 72 &&
    evaluation.balance.balanceScore >= 66 &&
    evaluation.scoreGap <= 22
  );
}

function getLastReview(history) {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index].review) {
      return history[index].review;
    }
  }
  return null;
}

function buildReview(history, checkpoint) {
  const recent = history.slice(Math.max(0, history.length - 20));
  const avgCombined = recent.reduce((sum, item) => sum + item.accepted.combinedScore, 0) / Math.max(1, recent.length);
  const avgGap = recent.reduce((sum, item) => sum + item.accepted.scoreGap, 0) / Math.max(1, recent.length);
  const bestCombined = Math.max(...recent.map((item) => item.accepted.combinedScore));

  return {
    checkpoint,
    avgCombined: Number(avgCombined.toFixed(2)),
    avgGap: Number(avgGap.toFixed(2)),
    bestCombined: Number(bestCombined.toFixed(2)),
  };
}

async function main() {
  await mkdir(logsDir, { recursive: true });

  const workflowText = await readFile(workflowPath, 'utf8');
  const originalRuntimeText = await readFile(runtimeTuningPath, 'utf8');
  const originalCharacterText = await readFile(characterTuningPath, 'utf8');
  let currentRuntimeConfig = parseExportedConst(originalRuntimeText, 'RUNTIME_TUNING');
  let currentCharacterConfig = parseExportedConst(originalCharacterText, 'CHARACTER_TUNING');
  let bestEvaluation = runJsonCommand(['scripts/evaluate-tuning.js', `--samples=${balanceSamples}`, '--seed=20260418']);
  let degradationStreak = 0;
  const history = [];

  await writeFile(statePath, `${JSON.stringify({ runtimeTuning: currentRuntimeConfig, characterTuning: currentCharacterConfig, evaluation: bestEvaluation }, null, 2)}\n`, 'utf8');

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const mode = degradationStreak >= 1 ? 'recover' : 'normal';
    const candidateSpecs = [
      { name: 'balanced-runtime', runtime: mutateRuntimeConfig(currentRuntimeConfig, iteration, mode, 'balanced'), character: mutateCharacterTuning(currentCharacterConfig, bestEvaluation, iteration, mode, 'identity') },
      { name: 'density-runtime', runtime: mutateRuntimeConfig(currentRuntimeConfig, iteration, mode, 'density'), character: mutateCharacterTuning(currentCharacterConfig, bestEvaluation, iteration, mode, 'identity') },
      { name: 'restore-runtime', runtime: mutateRuntimeConfig(currentRuntimeConfig, iteration, mode, 'restore'), character: mutateCharacterTuning(currentCharacterConfig, bestEvaluation, iteration, mode, 'identity') },
      { name: 'balanced-character', runtime: JSON.parse(JSON.stringify(currentRuntimeConfig)), character: mutateCharacterTuning(currentCharacterConfig, bestEvaluation, iteration, mode, 'balanced') },
      { name: 'focus-top-character', runtime: JSON.parse(JSON.stringify(currentRuntimeConfig)), character: mutateCharacterTuning(currentCharacterConfig, bestEvaluation, iteration, mode, 'focus-top') },
    ];

    const evaluatedCandidates = [];

    for (const spec of candidateSpecs) {
      await writeFile(runtimeTuningPath, stringifyRuntimeTuning(spec.runtime), 'utf8');
      await writeFile(characterTuningPath, stringifyCharacterTuning(spec.character), 'utf8');
      const evaluation = runJsonCommand([
        'scripts/evaluate-tuning.js',
        `--samples=${balanceSamples}`,
        `--seed=${20260418 + iteration}`,
      ]);
      evaluatedCandidates.push({ ...spec, evaluation, rank: rankCandidate(evaluation, bestEvaluation) });
    }

    evaluatedCandidates.sort((a, b) => b.rank - a.rank);
    const chosenCandidate = evaluatedCandidates[0];
    const candidateEvaluation = chosenCandidate.evaluation;

    const accept = shouldAcceptCandidate(candidateEvaluation, bestEvaluation);

    if (accept) {
      currentRuntimeConfig = chosenCandidate.runtime;
      currentCharacterConfig = chosenCandidate.character;
      bestEvaluation = candidateEvaluation;
      degradationStreak = 0;
      await writeFile(statePath, `${JSON.stringify({ runtimeTuning: currentRuntimeConfig, characterTuning: currentCharacterConfig, evaluation: bestEvaluation }, null, 2)}\n`, 'utf8');
    } else {
      degradationStreak += 1;
      await writeFile(runtimeTuningPath, stringifyRuntimeTuning(currentRuntimeConfig), 'utf8');
      await writeFile(characterTuningPath, stringifyCharacterTuning(currentCharacterConfig), 'utf8');
    }

    const record = {
      iteration,
      generatedAt: new Date().toISOString(),
      workflowLength: workflowText.length,
      mode,
      selectedCandidate: chosenCandidate.name,
      accepted: bestEvaluation,
      candidate: candidateEvaluation,
      candidateRanks: evaluatedCandidates.map((item) => ({
        name: item.name,
        rank: item.rank,
        combinedScore: item.evaluation.combinedScore,
        personaScore: item.evaluation.persona.personaScore,
        balanceScore: item.evaluation.balance.balanceScore,
        dramaticityScore: item.evaluation.extremity?.dramaticityScore,
        clarityScore: item.evaluation.quality?.clarityScore,
        differentiationScore: item.evaluation.quality?.differentiationScore,
        promptScore: item.evaluation.extremity?.promptScore,
        optionScore: item.evaluation.extremity?.optionScore,
        scoreGap: item.evaluation.scoreGap,
      })),
      accept,
      degradationStreak,
    };

    history.push(record);
    await writeFile(path.join(logsDir, `iteration-${String(iteration).padStart(3, '0')}.json`), `${JSON.stringify(record, null, 2)}\n`, 'utf8');

    runShell('node .\\scripts\\run-persona-tests.js');
    runShell(`node .\\scripts\\analyze-random-balance.js --samples=${balanceSamples} --seed=${20260418 + iteration}`);

    if (iteration % 20 === 0) {
      const review = buildReview(history, iteration / 20);
      const previousReview = getLastReview(history);
      const gettingWorse = previousReview ? review.avgCombined < previousReview.avgCombined && review.avgGap > previousReview.avgGap : false;
      if (gettingWorse) {
        degradationStreak += 1;
      }
      record.review = review;
      await writeFile(path.join(logsDir, `review-${String(iteration).padStart(3, '0')}.json`), `${JSON.stringify(review, null, 2)}\n`, 'utf8');
      if (degradationStreak >= 2) {
        currentRuntimeConfig.matchDensityPenaltyWeight = clamp(currentRuntimeConfig.matchDensityPenaltyWeight * 0.88, 0.2, 6);
        currentRuntimeConfig.optionScoreCalibrationStrengths.realism = clamp(currentRuntimeConfig.optionScoreCalibrationStrengths.realism * 0.92, 0.08, 0.7);
        currentRuntimeConfig.optionScoreCalibrationStrengths.cause = clamp(currentRuntimeConfig.optionScoreCalibrationStrengths.cause * 0.92, 0.06, 0.6);
        await writeFile(runtimeTuningPath, stringifyRuntimeTuning(currentRuntimeConfig), 'utf8');
      }
    }

    if (commitEachIteration) {
      const safeMessage = `chore: autotune iteration ${String(iteration).padStart(3, '0')}`;
      runShell(`git add src/data/runtimeTuning.js src/data/characterTuning.js reports logs/autotune; git commit -m \"${safeMessage}\"; git push origin main`);
    }

    if (iteration >= minIterations && isSatisfied(bestEvaluation)) {
      break;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
