import type { APIRoute } from "astro";
import { listWishes } from "../../lib/repo";

export const prerender = false;

export const GET: APIRoute = async () => {
  // The database lives on a mini PC that is not always powered on. A guest must
  // never see an error because of that, so an unreachable database is reported
  // as "unavailable" and the guestbook simply hides itself.
  try {
    const rows = await listWishes(50);
    return new Response(JSON.stringify({ wishes: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("wishes unavailable:", e);
    return new Response(JSON.stringify({ wishes: [], unavailable: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
};
