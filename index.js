import React, { useState } from 'react';
import { QUESTIONS } from './src/data/questions';
import { CHARACTERS } from './src/data/characters';
import { INITIAL_SCORES, mergeOptionScores, findBestMatch } from './src/logic/scoring';
import WelcomeScreen from './src/view/WelcomeScreen';
import QuizScreen from './src/view/QuizScreen';
import ResultScreen from './src/view/ResultScreen';

export default function App() {
  const [step, setStep] = useState('welcome');
  const [currentQ, setCurrentQ] = useState(0);
  const [userScores, setUserScores] = useState(INITIAL_SCORES);
  const [match, setMatch] = useState(null);

  const startQuiz = () => {
    setStep('quiz');
    setCurrentQ(0);
    setUserScores(INITIAL_SCORES);
    setMatch(null);
  };

  const handleAnswer = (optionScores) => {
    const nextScores = mergeOptionScores(userScores, optionScores);
    setUserScores(nextScores);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      return;
    }

    const { character } = findBestMatch(nextScores, CHARACTERS);
    setMatch(character);
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
        {step === 'result' && match && <ResultScreen match={match} onRestart={startQuiz} />}
      </div>
    </div>
  );
}