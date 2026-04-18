import React from 'react';
import { User, RefreshCw, Share2 } from 'lucide-react';
import { DIMENSION_LABELS } from '../logic/labels';

export default function ResultScreen({ match, onRestart, userScores, resultInsights }) {
  const handleShare = async () => {
    const text = `我在《进击的巨人》灵魂共鸣测试中，匹配到了【${match.name}】！来看看你是谁？`;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const fallbackInput = document.createElement('textarea');
    fallbackInput.value = text;
    document.body.appendChild(fallbackInput);
    fallbackInput.select();
    document.execCommand('copy');
    document.body.removeChild(fallbackInput);
  };

  return (
    <div className="animate-in zoom-in-95 duration-700 space-y-8">
      <div className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
        <div className="p-8 md:p-12 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/30">
              <User className="text-red-600 w-10 h-10" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-neutral-400 uppercase tracking-widest text-sm font-bold">你的共鸣角色是</h3>
            <h2 className="text-5xl md:text-6xl font-black text-white">{match.name}</h2>
          </div>

          <div className="p-6 bg-black/40 rounded-2xl italic text-neutral-300 text-center text-lg border-l-4 border-red-600">
            “{match.quote}”
          </div>

          <div className="space-y-4">
            <p className="text-neutral-400 leading-relaxed text-lg text-center">{match.desc}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
            {Object.entries(match.scores).map(([key, val]) => (
              <div key={key} className="text-center p-3 bg-neutral-800/50 rounded-lg">
                <div className="text-xs uppercase text-neutral-500 mb-1">{DIMENSION_LABELS[key] ?? key}</div>
                <div className="text-xl font-bold text-red-500">{val}</div>
              </div>
            ))}
          </div>

          {resultInsights && (
            <div className="space-y-4 pt-4">
              <div className="p-5 bg-neutral-800/40 rounded-2xl border border-neutral-700/60 space-y-3">
                <h4 className="text-sm uppercase tracking-[0.25em] text-neutral-400 font-bold">结果解读</h4>
                {resultInsights.summary.map((line) => (
                  <p key={line} className="text-neutral-300 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(userScores).map(([key, val]) => (
                  <div key={key} className="text-center p-3 bg-black/30 rounded-lg border border-neutral-800">
                    <div className="text-xs uppercase text-neutral-500 mb-1">{DIMENSION_LABELS[key] ?? key}</div>
                    <div className="text-xl font-bold text-white">{Number(val).toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-neutral-800/50 p-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRestart}
            className="flex-1 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> 重新测试
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-3 bg-red-700 hover:bg-red-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" /> 分享结果
          </button>
        </div>
      </div>

      <p className="text-center text-neutral-500 text-sm">* 结果基于你的价值取向向量计算，旨在映射角色的哲学立场。</p>
    </div>
  );
}
