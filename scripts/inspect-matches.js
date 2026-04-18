import { CHARACTERS } from '../src/data/characters.js';
import { PERSONAS } from '../src/testing/personas.js';
import { QUESTIONS } from '../src/data/questions.js';
import { INITIAL_SCORES, mergeOptionScores, euclideanDistance } from '../src/logic/scoring.js';
import { runNaturalLanguageSimulation } from '../src/testing/languageSimulation.js';

function rankMatches(scores) {
  return [...CHARACTERS]
    .map((character) => ({
      name: character.name,
      distance: Number(euclideanDistance(scores, character.scores).toFixed(3)),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);
}

const languageResult = runNaturalLanguageSimulation({ personas: PERSONAS, questions: QUESTIONS, characters: CHARACTERS });

for (const report of languageResult.reports.filter((item) => ['理想主义反叛者', '矛盾型士兵'].includes(item.persona))) {
  let scores = { ...INITIAL_SCORES };
  report.chosenOptions.forEach((choice) => {
    const option = QUESTIONS.find((q) => q.id === choice.questionId).options[choice.optionIndex];
    scores = mergeOptionScores(scores, option.scores);
  });
  console.log(`\n${report.persona}`);
  console.log('Chosen path:', report.chosenOptions.map((item) => `Q${item.questionId}-${item.optionIndex + 1}`).join(', '));
  console.log('Final scores:', JSON.stringify(scores));
  console.log('Top matches:', JSON.stringify(rankMatches(scores)));
}
