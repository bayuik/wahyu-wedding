import type { APIRoute } from "astro";
import { listWishes } from "../../lib/repo";

export const prerender = false;

export const GET: APIRoute = async () => {
  const rows = await listWishes(50);

  return new Response(JSON.stringify({ wishes: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
