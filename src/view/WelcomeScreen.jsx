import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="relative inline-block">
        <div className="absolute inset-0 blur-2xl bg-red-600/20 rounded-full"></div>
        <Shield className="w-24 h-24 mx-auto text-red-600 relative z-10" strokeWidth={1} />
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
        测测你是<span className="text-red-600">进击的巨人</span>里的谁
      </h1>
      <p className="text-neutral-400 text-lg leading-relaxed max-w-md mx-auto">
        在残酷的世界中，你的选择决定了你的灵魂。20位核心角色，5个精神维度，寻找与你共鸣的那个生命。
      </p>
      <button
        onClick={onStart}
        className="px-12 py-4 bg-red-700 hover:bg-red-600 transition-all rounded-full font-bold text-xl shadow-xl shadow-red-900/20 group"
      >
        献出你的心脏
        <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
