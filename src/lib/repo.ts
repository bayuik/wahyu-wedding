import { rsvp, wishes } from "./schema";

interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

// production (Vercel) can't reach the mini PC's Postgres directly, so it goes
// through PostgREST over the Cloudflare Tunnel instead. Dev on the mini PC
// itself keeps using Drizzle straight against localhost Postgres.
const postgrestUrl = import.meta.env.POSTGREST_URL as string | undefined;

export async function insertRsvp(data: { name: string; attendance: string; pax: number }) {
  if (postgrestUrl) {
    const res = await fetch(`${postgrestUrl}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`postgrest rsvp insert failed: ${res.status} ${await res.text()}`);
    return;
  }
  const { db } = await import("./db");
  await db.insert(rsvp).values(data);
}

export async function insertWish(data: { name: string; message: string }) {
  if (postgrestUrl) {
    const res = await fetch(`${postgrestUrl}/wishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`postgrest wishes insert failed: ${res.status} ${await res.text()}`);
    return;
  }
  const { db } = await import("./db");
  await db.insert(wishes).values(data);
}

export async function listWishes(limit = 50): Promise<Wish[]> {
  if (postgrestUrl) {
    const res = await fetch(`${postgrestUrl}/wishes_public?order=created_at.desc,id.desc&limit=${limit}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`postgrest wishes_public fetch failed: ${res.status}`);
    return res.json();
  }
  const { db } = await import("./db");
  const { desc, eq } = await import("drizzle-orm");
  const rows = await db
    .select()
    .from(wishes)
    .where(eq(wishes.approved, true))
    // id breaks ties so the guestbook order stays stable between page loads
    .orderBy(desc(wishes.createdAt), desc(wishes.id))
    .limit(limit);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    message: r.message,
    created_at: r.createdAt.toISOString(),
  }));
}
