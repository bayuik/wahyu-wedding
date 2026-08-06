import { useEffect, useState } from "react";
import { useLang } from "../lib/useLang";

const WEDDING_DATE = new Date("2025-04-09T08:00:00+07:00");

function getRemaining() {
  const diff = WEDDING_DATE.getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  };
}

export default function Countdown() {
  // start null so server-rendered markup has no time-dependent value to mismatch on hydration
  const [, t] = useLang();
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setRemaining(getRemaining());
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const units: [string, number][] = [
    [t("countdown.days"), remaining?.days ?? 0],
    [t("countdown.hours"), remaining?.hours ?? 0],
    [t("countdown.minutes"), remaining?.minutes ?? 0],
    [t("countdown.seconds"), remaining?.seconds ?? 0],
  ];

  return (
    <div className="flex justify-center gap-4 sm:gap-8">
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-display text-4xl text-terracotta-300 sm:text-5xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs tracking-widest text-dusty-100 uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
}

