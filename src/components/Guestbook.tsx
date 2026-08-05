import { useEffect, useState } from "react";

interface Wish {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

export default function Guestbook() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/wishes")
      .then((res) => res.json())
      .then((data) => setWishes(data.wishes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    document.addEventListener("wishes:refresh", load);
    return () => document.removeEventListener("wishes:refresh", load);
  }, []);

  if (loading) return null;
  if (wishes.length === 0) {
    return <p className="text-center text-sm text-dusty-700">Jadi yang pertama kirim ucapan.</p>;
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
