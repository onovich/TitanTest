import React, { useEffect, useState } from 'react';
import { QUESTIONS } from './src/data/questions';
import { CHARACTERS } from './src/data/characters';
import { INITIAL_SCORES, mergeOptionScores, rankCharacterMatches } from './src/logic/scoring';
import { buildResultInsights } from './src/logic/resultInsights';
import WelcomeScreen from './src/view/WelcomeScreen.jsx';
import QuizScreen from './src/view/QuizScreen.jsx';
import ResultScreen from './src/view/ResultScreen.jsx';

function findCharacterByName(characterName) {
  return CHARACTERS.find(
    (character) => character.name === characterName || character.aliases?.includes(characterName),
  );
}

function buildShareUrl(characterName) {
  const url = new URL(window.location.href);
  if (characterName) {
    url.searchParams.set('character', characterName);
  } else {
    url.searchParams.delete('character');
  }
  return url.toString();
}

export default function App() {
  const [step, setStep] = useState('welcome');
  const [currentQ, setCurrentQ] = useState(0);
  const [userScores, setUserScores] = useState(INITIAL_SCORES);
  const [match, setMatch] = useState(null);
  const [resultInsights, setResultInsights] = useState(null);

  useEffect(() => {
    const sharedCharacterName = new URLSearchParams(window.location.search).get('character');
    if (!sharedCharacterName) {
      document.title = '测测你是《进击的巨人》里的谁｜灵魂共鸣测试';
      return;
    }

    const sharedCharacter = findCharacterByName(sharedCharacterName);
    if (!sharedCharacter) {
      document.title = '测测你是《进击的巨人》里的谁｜灵魂共鸣测试';
      return;
    }

    setMatch(sharedCharacter);
    setResultInsights(null);
    setUserScores(sharedCharacter.scores);
    setStep('result');
  }, []);

  useEffect(() => {
    if (step === 'result' && match) {
      document.title = `我是${match.name}｜测测你是《进击的巨人》里的谁`;
      window.history.replaceState({}, '', buildShareUrl(match.name));
      return;
    }

    document.title = '测测你是《进击的巨人》里的谁｜灵魂共鸣测试';
    window.history.replaceState({}, '', buildShareUrl(null));
  }, [step, match]);

  const startQuiz = () => {
    setStep('quiz');
    setCurrentQ(0);
    setUserScores(INITIAL_SCORES);
    setMatch(null);
    setResultInsights(null);
  };

  const handleAnswer = (optionScores, questionWeight = 1) => {
    const nextScores = mergeOptionScores(userScores, optionScores, questionWeight);
    setUserScores(nextScores);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      return;
    }

    const rankedMatches = rankCharacterMatches(nextScores, CHARACTERS, 2);
    setMatch(rankedMatches[0]?.character ?? null);
    setResultInsights(buildResultInsights(nextScores, rankedMatches));
    setStep('result');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-red-900">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {step === 'welcome' && <WelcomeScreen onStart={startQuiz} />}
        {step === 'quiz' && (
          <QuizScreen
            question={QUESTIONS[currentQ]}
            currentQ={currentQ}
            total={QUESTIONS.length}
            onAnswer={handleAnswer}
          />
        )}
        {step === 'result' && match && (
          <ResultScreen
            match={match}
            onRestart={startQuiz}
            userScores={userScores}
            resultInsights={resultInsights}
          />
        )}

      </div>
    </div>
  );
}
