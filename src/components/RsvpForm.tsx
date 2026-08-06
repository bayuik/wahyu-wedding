import { useState } from "react";
import { useLang } from "../lib/useLang";

interface Props {
  guestName: string | null;
}

// "unavailable" is kept apart from "error" so the message can tell the guest to
// come back later rather than implying an immediate retry will work: the
// database is self-hosted and sometimes simply switched off.
type Status = "idle" | "submitting" | "done" | "error" | "unavailable";

export default function RsvpForm({ guestName }: Props) {
  const [, t] = useLang();
  const [name, setName] = useState(guestName ?? "");
  const [attendance, setAttendance] = useState<"hadir" | "tidak" | "maybe">("hadir");
  const [pax, setPax] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attendance, pax, message }),
      });
      if (res.status >= 500) {
        setStatus("unavailable");
        return;
      }
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
      setMessage("");
      document.dispatchEvent(new CustomEvent("wishes:refresh"));
    } catch {
      // a thrown fetch means the server could not be reached at all
      setStatus("unavailable");
    }
  };

  if (status === "done") {
    return (
      <p className="mx-auto max-w-sm text-center text-sm text-dusty-700">
        {t("rsvp.thanks")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-sm flex-col gap-4 text-left">
      <label className="flex flex-col gap-1 text-sm text-dusty-900">
        {t("rsvp.name")}
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-dusty-300 bg-cream-50 px-3 py-2 outline-none focus:border-terracotta-500"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-dusty-900">
        {t("rsvp.attendance")}
        <select
          value={attendance}
          onChange={(e) => setAttendance(e.target.value as typeof attendance)}
          className="rounded-lg border border-dusty-300 bg-cream-50 px-3 py-2 outline-none focus:border-terracotta-500"
        >
          <option value="hadir">{t("rsvp.attend.yes")}</option>
          <option value="tidak">{t("rsvp.attend.no")}</option>
          <option value="maybe">{t("rsvp.attend.maybe")}</option>
        </select>
      </label>

      {attendance === "hadir" && (
        <label className="flex flex-col gap-1 text-sm text-dusty-900">
          {t("rsvp.pax")}
          <input
            type="number"
            min={1}
            max={10}
            value={pax}
            onChange={(e) => setPax(Number(e.target.value))}
            className="rounded-lg border border-dusty-300 bg-cream-50 px-3 py-2 outline-none focus:border-terracotta-500"
          />
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm text-dusty-900">
        {t("rsvp.message")}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder={t("rsvp.message.placeholder")}
          className="rounded-lg border border-dusty-300 bg-cream-50 px-3 py-2 outline-none focus:border-terracotta-500"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-full bg-terracotta-500 px-6 py-2.5 text-sm tracking-widest text-cream-50 uppercase hover:bg-terracotta-700 disabled:opacity-60"
      >
        {status === "submitting" ? t("rsvp.sending") : t("rsvp.submit")}
      </button>

      {status === "error" && (
        <p className="text-sm text-terracotta-700">{t("rsvp.error")}</p>
      )}

      {status === "unavailable" && (
        <p className="text-sm text-terracotta-700">{t("rsvp.unavailable")}</p>
      )}
    </form>
  );
}
