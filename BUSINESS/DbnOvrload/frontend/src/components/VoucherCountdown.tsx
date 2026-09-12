import { useEffect, useMemo, useRef, useState } from "react";
import { COLORS } from "../theme/colors";

interface Props {
  /** ISO timestamp the token expires at (issuedAt + 60s). */
  expiresAt: string;
  /** Total window length in seconds (for the ring proportion). */
  ttlSeconds: number;
  onExpire?: () => void;
  size?: number;
}

/**
 * Aggressive circular progress ring (#00F0FF) counting down the 60-second
 * redemption window. Turns radioactive lime in the final 10s, forcing the
 * student to convert at the till.
 */
export function VoucherCountdown({ expiresAt, ttlSeconds, onExpire, size = 220 }: Props) {
  const expiryMs = useMemo(() => new Date(expiresAt).getTime(), [expiresAt]);
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, expiryMs - Date.now()));
  const firedExpire = useRef(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const left = Math.max(0, expiryMs - Date.now());
      setRemainingMs(left);
      if (left <= 0 && !firedExpire.current) {
        firedExpire.current = true;
        onExpire?.();
      }
      if (left > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [expiryMs, onExpire]);

  const seconds = Math.ceil(remainingMs / 1000);
  const fraction = Math.max(0, Math.min(1, remainingMs / (ttlSeconds * 1000)));
  const isUrgent = seconds <= 10 && seconds > 0;
  const expired = remainingMs <= 0;

  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - fraction);
  const ringColor = expired ? COLORS.slate : isUrgent ? COLORS.radio : COLORS.volt;

  return (
    <div className="flex flex-col items-center" role="timer" aria-live="assertive">
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} className={isUrgent ? "animate-flash" : ""}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={COLORS.slate}
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: "stroke-dashoffset 80ms linear, stroke 200ms ease",
              filter: `drop-shadow(0 0 10px ${ringColor})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {expired ? (
            <span className="font-display text-2xl font-bold text-neutral-400">EXPIRED</span>
          ) : (
            <>
              <span
                className="font-display text-6xl font-bold tabular-nums"
                style={{ color: ringColor }}
              >
                {seconds}
              </span>
              <span className="mt-1 text-xs uppercase tracking-widest text-neutral-400">
                seconds to the till
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
