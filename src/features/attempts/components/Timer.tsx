'use client';

import { useEffect, useState } from 'react';

function remainingSeconds(expiresAt: string, serverNow: string, state?: string): number {
  if (state === 'near') return 300;
  const delta = Date.parse(expiresAt) - Date.parse(serverNow);
  return Number.isFinite(delta) ? Math.max(0, Math.floor(delta / 1000)) : 0;
}

function clock(value: number): string {
  return [Math.floor(value / 3600), Math.floor((value % 3600) / 60), value % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
}

export function Timer({
  expiresAt,
  serverNow,
  state,
}: {
  expiresAt: string;
  serverNow: string;
  state?: string;
}) {
  const [remaining, setRemaining] = useState(() => remainingSeconds(expiresAt, serverNow, state));

  useEffect(() => {
    const tick = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(tick);
  }, []);

  const milestone = remaining <= 60 ? 'Còn 1 phút' : remaining <= 300 ? 'Còn 5 phút' : '';
  return (
    <>
      <span
        role="timer"
        aria-label="Thời gian còn lại"
        aria-live="off"
        className="font-mono text-sm font-semibold tabular-nums"
      >
        {clock(remaining)}
      </span>
      <span className="sr-only" role="status">
        {milestone}
      </span>
    </>
  );
}
