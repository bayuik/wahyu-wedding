import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { wishes } from "../../lib/schema";
import { desc, eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async () => {
  const rows = await db
    .select()
    .from(wishes)
    .where(eq(wishes.approved, true))
    .orderBy(desc(wishes.createdAt))
    .limit(50);

  return new Response(JSON.stringify({ wishes: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
