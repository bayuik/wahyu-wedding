import { useEffect, useState } from "react";
import { useLang } from "../lib/useLang";

interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

/**
 * List of guest wishes.
 *
 * The database is self-hosted on a mini PC that is not always switched on, so
 * every failure path here hides the section instead of showing an error.
 *
 * "Unavailable" and "no wishes yet" are kept separate on purpose: falling back
 * to the empty-state text would tell guests that nobody has written anything,
 * which is a different and misleading claim.
 */
export default function Guestbook() {
  const [, t] = useLang();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const load = () => {
    fetch("/api/wishes")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (data?.unavailable) {
          setUnavailable(true);
          return;
        }
        setUnavailable(false);
        setWishes(data.wishes ?? []);
      })
      .catch(() => setUnavailable(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    document.addEventListener("wishes:refresh", load);
    return () => document.removeEventListener("wishes:refresh", load);
  }, []);

  if (loading || unavailable) return null;

  if (wishes.length === 0) {
    return <p className="text-center text-sm text-dusty-700">{t("rsvp.empty")}</p>;
  }

  return (
    <div className="mx-auto mt-10 flex max-w-xl flex-col gap-4">
      {wishes.map((w) => (
        <div key={w.id} className="rounded-lg bg-cream-50 p-4 text-left shadow-sm">
          <p className="text-sm font-semibold text-dusty-900">{w.name}</p>
          <p className="mt-1 text-sm text-dusty-700">{w.message}</p>
        </div>
      ))}
    </div>
  );
}
