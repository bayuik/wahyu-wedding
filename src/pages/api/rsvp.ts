import type { APIRoute } from "astro";
import { insertRsvp, insertWish } from "../../lib/repo";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { name, attendance, pax, message } = body ?? {};

  if (!name || !attendance) {
    return new Response(JSON.stringify({ error: "name and attendance required" }), { status: 400 });
  }

  await insertRsvp({
    name,
    attendance,
    pax: Number(pax) || 1,
  });

  if (message && String(message).trim().length > 0) {
    await insertWish({ name, message: String(message).trim() });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
