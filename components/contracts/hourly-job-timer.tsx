'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Square, CheckCircle2, Clock } from 'lucide-react';

type Props = {
  contractId: string;
  hourlyRate: number;
  currency?: string;
  isClient: boolean;
};

function fmt(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function HourlyJobTimer({ contractId, hourlyRate, currency = '৳', isClient }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [justConfirmed, setJustConfirmed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const earned = (seconds / 3600) * hourlyRate;

  async function confirmPayment() {
    setConfirmed(true);
    setJustConfirmed(true);
    setRunning(false);
    setTimeout(() => setJustConfirmed(false), 2500);
    // Sandbox only — no real charge. is_demo payment flow.
  }

  return (
    <div className="rounded-card-sm border border-warm-border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-warm-ink">
          <Clock className="h-4 w-4 text-warm-red" />
          Hourly Timer
        </h4>
        <span className="font-mono text-2xl font-bold text-warm-ink tabular-nums">{fmt(seconds)}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-warm-muted">
        <span>Rate: {currency}{hourlyRate}/hr</span>
        <span className="font-medium text-warm-ink">{currency}{earned.toFixed(2)} earned</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {!running ? (
          <button
            onClick={() => setRunning(true)}
            className="flex items-center gap-2 rounded-card-sm bg-warm-green px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Play className="h-4 w-4" /> Start
          </button>
        ) : (
          <button
            onClick={() => setRunning(false)}
            className="flex items-center gap-2 rounded-card-sm bg-warm-red px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        )}

        {isClient && seconds > 0 && !confirmed && (
          <button
            onClick={confirmPayment}
            className="flex items-center gap-2 rounded-card-sm border border-warm-gold px-4 py-2 text-sm font-medium text-warm-gold hover:bg-warm-gold/5"
          >
            <CheckCircle2 className="h-4 w-4" /> Confirm &amp; Pay (Sandbox)
          </button>
        )}
      </div>

      {justConfirmed && (
        <p className="mt-3 text-sm text-warm-green">
          {isClient ? 'Payment confirmed (demo). No real charge was made.' : 'Awaiting client confirmation (demo).'}
        </p>
      )}
    </div>
  );
}
