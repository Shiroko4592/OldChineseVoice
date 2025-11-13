import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  koreanText: text("korean_text").notNull(),
  chineseText: text("chinese_text").notNull(),
  romanization: text("romanization").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
}).extend({
  koreanText: z.string().trim().min(1, "Korean text is required"),
  chineseText: z.string().trim().min(1, "Chinese text is required"),
  romanization: z.string().trim().min(1, "Romanization is required"),
});

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = {
  id: string;
  koreanText: string;
  chineseText: string;
  romanization: string;
  createdAt: string;
};
