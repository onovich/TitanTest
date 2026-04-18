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
  const totalBadgeUrl = useMemo(() => {
    const host = window.location.hostname || 'local-preview';
    const repoBase = (import.meta.env.BASE_URL ?? '/').replace(/^\/+|\/+$/g, '') || 'root';
    const todayKey = new Date().toISOString().slice(0, 10);
    const cacheBust = `${todayKey}-${Math.floor(Date.now() / 60000)}`;
    const pagePrefix = `titantest.${host}.${repoBase}`.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();

    return buildBadgeUrl(`${pagePrefix}.total`, 'TOTAL', cacheBust);
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/55 px-4 py-4 text-center text-sm text-neutral-400 space-y-3">
      <p className="text-xs tracking-[0.16em] text-neutral-500">结果页访客统计</p>
      <div className="flex flex-col items-center gap-2 overflow-hidden">
        <span className="text-[11px] tracking-[0.24em] text-neutral-500">总访客</span>
        <img
          src={totalBadgeUrl}
          alt="总访客"
          className="block h-8 w-auto max-w-full object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-xs text-neutral-600 leading-relaxed">若浏览器拦截外部徽章图片，统计数字可能暂时不可见。</p>
    </div>
  );
}