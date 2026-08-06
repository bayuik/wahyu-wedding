import type { APIRoute } from "astro";
import { isAuthed } from "../../../lib/admin-auth";
import { setWishApproved } from "../../../lib/admin-repo";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // guest data is behind this check, so refuse before touching the database
  if (!isAuthed(cookies)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  const approved = body?.approved;

  if (!Number.isInteger(id) || typeof approved !== "boolean") {
    return new Response(JSON.stringify({ error: "id and approved required" }), { status: 400 });
  }

  await setWishApproved(id, approved);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
