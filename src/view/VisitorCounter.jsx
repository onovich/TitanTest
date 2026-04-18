import React, { useEffect, useState } from 'react';

const API_BASE = 'https://api.countapi.xyz';

function formatCount(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--';
  }

  return new Intl.NumberFormat('zh-CN').format(value);
}

function buildNamespace() {
  const host = window.location.hostname || 'local-preview';
  return `titantest-${host.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}`;
}

async function fetchCounter(endpoint) {
  const response = await fetch(`${API_BASE}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Counter request failed: ${response.status}`);
  }

  return response.json();
}

export default function VisitorCounter() {
  const [stats, setStats] = useState({ total: null, today: null, ready: false });

  useEffect(() => {
    let disposed = false;

    async function loadStats() {
      const namespace = buildNamespace();
      const todayKey = new Date().toISOString().slice(0, 10);
      const sessionKey = `visitor-counted:${namespace}:${todayKey}`;
      const shouldIncrement = !window.sessionStorage.getItem(sessionKey);
      const action = shouldIncrement ? 'hit' : 'get';

      try {
        const [total, today] = await Promise.all([
          fetchCounter(`${action}/${namespace}/total-visits`),
          fetchCounter(`${action}/${namespace}/day-${todayKey}`),
        ]);

        if (shouldIncrement) {
          window.sessionStorage.setItem(sessionKey, '1');
        }

        if (!disposed) {
          setStats({ total: total.value, today: today.value, ready: true });
        }
      } catch (error) {
        if (!disposed) {
          setStats({ total: null, today: null, ready: true });
        }
      }
    }

    loadStats();

    return () => {
      disposed = true;
    };
  }, []);

  return (
    <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500">
      <p>
        访客计数器 · 累计访问 {formatCount(stats.total)} · 今日访问 {formatCount(stats.today)}
      </p>
      {!stats.ready && <p className="mt-2 text-xs text-neutral-600">正在同步统计…</p>}
    </div>
  );
}