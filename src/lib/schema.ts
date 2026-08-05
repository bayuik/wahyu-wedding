import { pgTable, serial, text, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: text("name").notNull(),
  group: text("group"),
  invitedTo: varchar("invited_to", { length: 20 }).notNull().default("both"), // akad | resepsi | both
});

export const rsvp = pgTable("rsvp", {
  id: serial("id").primaryKey(),
  guestId: integer("guest_id").references(() => guests.id),
  name: text("name").notNull(),
  attendance: varchar("attendance", { length: 10 }).notNull(), // hadir | tidak | maybe
  pax: integer("pax").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const giftLog = pgTable("gift_log", {
  id: serial("id").primaryKey(),
  name: text("name"),
  channel: varchar("channel", { length: 20 }).notNull(), // bank | qris | ewallet
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
