import { INITIAL_SCORES, mergeOptionScores, findBestMatch, euclideanDistance, rankDimensions } from '../logic/scoring.js';
import {
  inferSemanticScores,
  semanticSimilarity,
  optionSemanticProfile,
  compareSemanticTopDimensions,
  inferArchetypes,
  rankByImpact,
} from './semantic.js';

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
}

function blendProfiles(primary, secondary, primaryWeight = 0.6) {
  return Object.keys(INITIAL_SCORES).reduce((acc, dimension) => {
    acc[dimension] = (primary[dimension] ?? 5) * primaryWeight + (secondary[dimension] ?? 5) * (1 - primaryWeight);
    return acc;
  }, {});
}

function profileSignalStrength(profile) {
  return Object.values(profile).reduce((sum, value) => sum + Math.abs((value ?? 5) - 5), 0);
}

function buildCharacterSemanticProfile(character) {
  const textProfile = inferSemanticScores(`${character?.desc ?? ''} ${character?.quote ?? ''}`);
  const textWeight = profileSignalStrength(textProfile) >= 5 ? 0.65 : 0.35;
  return blendProfiles(textProfile, character?.scores ?? INITIAL_SCORES, textWeight);
}

function pickOptionByLanguage(persona, question, options = {}) {
  const { randomize = false, decisionNoise = 0, random = Math.random } = options;
  const personaLanguageProfile = inferSemanticScores(`${persona.narrative} ${persona.selfImage ?? ''}`);

  const scoredOptions = question.options.map((option, index) => {
    const optionProfile = optionSemanticProfile(question.text, option.text);
    const semanticMatch = semanticSimilarity(personaLanguageProfile, optionProfile);
    const optionArchetypes = inferArchetypes(`${question.text} ${option.text}`);
    const personaArchetypes = inferArchetypes(`${persona.narrative} ${persona.selfImage ?? ''}`);
    const archetypeBonus = optionArchetypes.filter((tag) => personaArchetypes.includes(tag)).length * 0.04;

    return {
      index,
      option,
      optionProfile,
      semanticMatch: Number((semanticMatch + archetypeBonus).toFixed(3)),
      noisyScore: Number(
        (
          semanticMatch +
          archetypeBonus +
          (randomize ? (random() * 2 - 1) * decisionNoise : 0)
        ).toFixed(3)
      ),
    };
  });

  scoredOptions.sort((a, b) => b.noisyScore - a.noisyScore);
  return scoredOptions[0];
}

export function analyzeQuestionSemanticConsistency(questions) {
  return questions.flatMap((question) => {
    return question.options.map((option, index) => {
      const textProfile = inferSemanticScores(option.text);
      const consistency = compareSemanticTopDimensions(textProfile, option.scores);
      return {
        questionId: question.id,
        optionIndex: index,
        optionText: option.text,
        textTop: consistency.textTop,
        numericTop: consistency.numericTop,
        overlap: consistency.overlap,
        warning: consistency.overlap < 0.5,
      };
    });
  });
}

export function runNaturalLanguageSimulation({ personas, questions, characters, randomize = false, decisionNoise = 0, random = Math.random }) {
  const reports = personas.map((persona) => {
    let scores = { ...INITIAL_SCORES };
    const personaProfile = inferSemanticScores(`${persona.narrative} ${persona.selfImage ?? ''}`);
    const chosenOptions = [];
    const aggregatedOptionProfiles = [];

    questions.forEach((question) => {
      const selected = pickOptionByLanguage(persona, question, { randomize, decisionNoise, random });
      scores = mergeOptionScores(scores, selected.option.scores);
      chosenOptions.push({
        questionId: question.id,
        optionIndex: selected.index,
        optionText: selected.option.text,
        semanticMatch: selected.semanticMatch,
        noisyScore: selected.noisyScore,
      });
      aggregatedOptionProfiles.push(selected.optionProfile);
    });

    const { character, distance } = findBestMatch(scores, characters);
    const characterSemanticProfile = buildCharacterSemanticProfile(character);
    const averageOptionProfile = Object.keys(INITIAL_SCORES).reduce((acc, dimension) => {
      acc[dimension] = average(aggregatedOptionProfiles.map((profile) => profile[dimension] ?? 5));
      return acc;
    }, {});

    const expectationGap = euclideanDistance(scores, persona.expectedScores);
    const languageToResultGap = euclideanDistance(personaProfile, characterSemanticProfile);
    const optionToResultGap = euclideanDistance(averageOptionProfile, characterSemanticProfile);
    const semanticTopOverlap = rankByImpact(characterSemanticProfile)
      .slice(0, 2)
      .filter((key) => rankByImpact(personaProfile).slice(0, 2).includes(key)).length / 2;
    const selfPerceptionDrift = languageToResultGap > 5 && optionToResultGap <= 2.8;
    const calibrationConcern = !selfPerceptionDrift && (optionToResultGap > 2.8 || (semanticTopOverlap < 0.5 && optionToResultGap > 2.2));

    return {
      persona: persona.name,
      matchedCharacter: character?.name,
      scoreDistance: Number(distance.toFixed(3)),
      expectationGap: Number(expectationGap.toFixed(3)),
      languageToResultGap: Number(languageToResultGap.toFixed(3)),
      optionToResultGap: Number(optionToResultGap.toFixed(3)),
      semanticTopOverlap: Number(semanticTopOverlap.toFixed(3)),
      selfPerceptionDrift,
      calibrationConcern,
      needsReflection: calibrationConcern,
      chosenOptions,
      personaProfile,
      resultProfile: characterSemanticProfile,
      averageOptionProfile,
    };
  });

  const questionConsistency = analyzeQuestionSemanticConsistency(questions);

  return {
    summary: {
      personaCount: reports.length,
      reflectionCount: reports.filter((report) => report.needsReflection).length,
      selfPerceptionDriftCount: reports.filter((report) => report.selfPerceptionDrift).length,
      avgLanguageToResultGap: Number(average(reports.map((report) => report.languageToResultGap)).toFixed(3)),
      avgOptionToResultGap: Number(average(reports.map((report) => report.optionToResultGap)).toFixed(3)),
      inconsistentOptionCount: questionConsistency.filter((item) => item.warning).length,
    },
    reports,
    questionConsistency,
  };
}
