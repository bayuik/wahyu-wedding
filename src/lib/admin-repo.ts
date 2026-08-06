import { rsvp, wishes } from "./schema";

/**
 * Admin-only reads. These deliberately bypass the PostgREST path used by the
 * public API: the `wedding_api` role can only INSERT and read `wishes_public`,
 * so full guest data is reachable only over a direct Postgres connection.
 *
 * In practice that means the dashboard runs where DATABASE_URL is set (the mini
 * PC itself), not from the Vercel deployment.
 */
function assertDirectDb() {
  if (!import.meta.env.DATABASE_URL) {
    throw new Error(
      "Dashboard butuh koneksi Postgres langsung (DATABASE_URL). " +
        "Jalankan dari mini PC, bukan dari deployment Vercel yang cuma punya POSTGREST_URL."
    );
  }
}

export interface RsvpRow {
  id: number;
  name: string;
  attendance: string;
  pax: number;
  createdAt: Date;
}

export async function listRsvps(): Promise<RsvpRow[]> {
  assertDirectDb();
  const { db } = await import("./db");
  const { desc } = await import("drizzle-orm");
  // id breaks ties: rows submitted in the same instant would otherwise come back
  // in arbitrary order, and an UPDATE would visibly reshuffle the list
  return db.select().from(rsvp).orderBy(desc(rsvp.createdAt), desc(rsvp.id));
}

export interface RsvpStats {
  responses: number;
  attending: number;
  notAttending: number;
  maybe: number;
  /** headcount: how many people the "hadir" responses add up to, for catering */
  totalPax: number;
}

export function summarise(rows: RsvpRow[]): RsvpStats {
  return {
    responses: rows.length,
    attending: rows.filter((r) => r.attendance === "hadir").length,
    notAttending: rows.filter((r) => r.attendance === "tidak").length,
    maybe: rows.filter((r) => r.attendance === "maybe").length,
    totalPax: rows
      .filter((r) => r.attendance === "hadir")
      .reduce((sum, r) => sum + (r.pax || 0), 0),
  };
}

export interface WishRow {
  id: number;
  name: string;
  message: string;
  approved: boolean;
  createdAt: Date;
}

/** Every wish, including hidden ones, so they can be moderated back and forth. */
export async function listAllWishes(): Promise<WishRow[]> {
  assertDirectDb();
  const { db } = await import("./db");
  const { desc } = await import("drizzle-orm");
  return db.select().from(wishes).orderBy(desc(wishes.createdAt), desc(wishes.id));
}

export async function setWishApproved(id: number, approved: boolean) {
  assertDirectDb();
  const { db } = await import("./db");
  const { eq } = await import("drizzle-orm");
  await db.update(wishes).set({ approved }).where(eq(wishes.id, id));
}
