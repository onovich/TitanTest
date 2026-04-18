import React from 'react';

export default function QuizScreen({ question, currentQ, total, onAnswer }) {
  return (
    <div className="space-y-8">
      <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
        <div
          className="bg-red-600 h-full transition-all duration-500"
          style={{ width: `${((currentQ + 1) / total) * 100}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-end">
        <span className="text-red-600 font-mono text-sm tracking-widest uppercase">
          Question {currentQ + 1} / {total}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold leading-snug">{question.text}</h2>

      <div className="grid gap-4">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(opt.scores, question.weight ?? 1)}
            className="w-full p-5 text-left bg-neutral-900 border border-neutral-800 hover:border-red-800 hover:bg-neutral-800 transition-all rounded-xl group"
          >
            <span className="text-lg text-neutral-300 group-hover:text-white transition-colors">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
