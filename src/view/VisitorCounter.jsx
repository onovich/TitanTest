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
      <p>访客计数器</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <img
          src={totalBadgeUrl}
          alt="累计访问"
          className="h-6"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <img
          src={todayBadgeUrl}
          alt="今日访问"
          className="h-6"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-xs text-neutral-600">若微信或极简模式屏蔽外部徽章图片，可能暂时看不到数字。</p>
    </div>
  );
}