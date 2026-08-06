import type { APIRoute } from "astro";
import { insertRsvp, insertWish } from "../../lib/repo";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const { name, attendance, pax, message } = body ?? {};

  if (!name || !attendance) {
    return new Response(JSON.stringify({ error: "name and attendance required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // The database is self-hosted and sometimes offline. Answer with a clean 503
  // so the form can say "try again later" instead of surfacing a raw failure.
  try {
    await insertRsvp({ name, attendance, pax: Number(pax) || 1 });

    if (message && String(message).trim().length > 0) {
      await insertWish({ name, message: String(message).trim() });
    }
  } catch (e) {
    console.error("rsvp insert failed:", e);
    return new Response(JSON.stringify({ error: "unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
