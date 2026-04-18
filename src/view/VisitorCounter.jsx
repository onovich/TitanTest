import React, { useMemo } from 'react';

function buildBadgeUrl(pageId, leftText, cacheBust) {
  const url = new URL('https://visitor-badge.laobi.icu/badge');
  url.searchParams.set('page_id', pageId);
  url.searchParams.set('left_text', leftText);
  url.searchParams.set('left_color', '1f2937');
  url.searchParams.set('right_color', '991b1b');
  url.searchParams.set('cache', 'false');
  url.searchParams.set('v', cacheBust);
  return url.toString();
}

export default function VisitorCounter() {
  const { totalBadgeUrl, todayBadgeUrl } = useMemo(() => {
    const host = window.location.hostname || 'local-preview';
    const repoBase = (import.meta.env.BASE_URL ?? '/').replace(/^\/+|\/+$/g, '') || 'root';
    const todayKey = new Date().toISOString().slice(0, 10);
    const cacheBust = `${todayKey}-${Math.floor(Date.now() / 60000)}`;
    const pagePrefix = `titantest.${host}.${repoBase}`.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();

    return {
      totalBadgeUrl: buildBadgeUrl(`${pagePrefix}.total`, '累计访问', cacheBust),
      todayBadgeUrl: buildBadgeUrl(`${pagePrefix}.day.${todayKey}`, '今日访问', cacheBust),
    };
  }, []);

  return (
    <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500 space-y-3">
      <p className="tracking-[0.18em] uppercase text-xs text-neutral-400">访客计数器</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 flex items-center justify-center min-h-12 overflow-hidden">
          <img
            src={totalBadgeUrl}
            alt="累计访问"
            className="h-6 max-w-full object-contain"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 flex items-center justify-center min-h-12 overflow-hidden">
          <img
            src={todayBadgeUrl}
            alt="今日访问"
            className="h-6 max-w-full object-contain"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <p className="text-xs text-neutral-600 leading-relaxed">若微信或极简模式屏蔽外部徽章图片，可能暂时看不到数字。</p>
    </div>
  );
}