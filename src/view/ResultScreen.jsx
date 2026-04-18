import React, { useState } from 'react';
import { User, RefreshCw, Share2 } from 'lucide-react';
import { PORTRAITS } from '../data/portraits';
import { DIMENSION_LABELS } from '../logic/labels';

function resolvePublicAssetUrl(assetPath) {
  if (!assetPath) {
    return assetPath;
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${assetPath.replace(/^\//, '')}`;
}

function isWeChatLikeBrowser() {
  const userAgent = window.navigator.userAgent ?? '';
  return /micromessenger|wechat|wxwork/i.test(userAgent) || typeof window.WeixinJSBridge !== 'undefined';
}

export default function ResultScreen({ match, onRestart, userScores, resultInsights }) {
  const [shareStatus, setShareStatus] = useState('');
  const portrait = PORTRAITS[match.name];
  const hasSelectedPortrait = Boolean(portrait?.selected?.src);
  const portraitSrc = hasSelectedPortrait ? resolvePublicAssetUrl(portrait.selected.src) : null;

  const copyShareText = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const fallbackInput = document.createElement('textarea');
    fallbackInput.value = text;
    document.body.appendChild(fallbackInput);
    fallbackInput.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(fallbackInput);
    return copied;
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const text = `我在《进击的巨人》灵魂共鸣测试中，匹配到了【${match.name}】！来看看你是谁？`;
    const sharePayload = `${text}\n${shareUrl}`;
    const isWeChatBrowser = isWeChatLikeBrowser();

    if (isWeChatBrowser) {
      const copied = await copyShareText(sharePayload);
      setShareStatus(
        copied
          ? '微信内无法直接调用系统分享，请点右上角“···”后选择“发送给朋友”或“分享到朋友圈”，结果链接已复制。'
          : '微信内无法直接调用系统分享，请点右上角“···”后选择“发送给朋友”或“分享到朋友圈”。'
      );
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `我是${match.name}｜进击的巨人角色测试`,
          text,
          url: shareUrl,
        });
        setShareStatus('已打开系统分享面板');
        return;
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }
      }
    }

    if (await copyShareText(sharePayload)) {
      setShareStatus('结果文案和链接已复制');
      return;
    }

    window.prompt('请复制这段结果文案与链接后自行分享：', sharePayload);
    setShareStatus('已打开手动复制窗口');
  };

  return (
    <div className="animate-in zoom-in-95 duration-700 space-y-8">
      <div className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
        <div className="p-8 md:p-12 space-y-6">
          <div className="flex justify-center">
            {hasSelectedPortrait ? (
              <img
                src={portraitSrc}
                alt={portrait.selected.alt ?? `${match.name}头像`}
                className="w-28 h-28 rounded-3xl object-cover border border-red-600/30 shadow-lg shadow-red-950/30"
                style={{ objectPosition: portrait.selected.objectPosition ?? 'center' }}
              />
            ) : (
              <div className="w-28 h-28 bg-red-600/10 rounded-3xl flex flex-col items-center justify-center border border-dashed border-red-600/30 gap-2 px-3 text-center">
                <User className="text-red-600 w-9 h-9" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-red-200/80">头像待确认</span>
              </div>
            )}
          </div>

          {portrait && !hasSelectedPortrait && (
            <p className="text-center text-xs text-neutral-500">
              已整理 {portrait.candidates.length} 个候选，推荐编号：{portrait.recommended.join(' / ')}
            </p>
          )}

          <div className="text-center space-y-2">
            <h3 className="text-neutral-400 uppercase tracking-widest text-sm font-bold">你的共鸣角色是</h3>
            <h2 className="text-5xl md:text-6xl font-black text-white">{match.name}</h2>
          </div>

          {match.quote && (
            <div className="p-6 bg-black/40 rounded-2xl italic text-neutral-300 text-center text-lg border-l-4 border-red-600">
              “{match.quote}”
            </div>
          )}

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

        {shareStatus && <p className="px-6 pb-6 text-center text-sm text-green-400">{shareStatus}</p>}
      </div>

      <p className="text-center text-neutral-500 text-sm">* 结果基于你的价值取向向量计算，旨在映射角色的哲学立场。</p>
    </div>
  );
}
