import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const weightEntries = sqliteTable("weight_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  weightKg: real("weight_kg").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const exerciseEntries = sqliteTable("exercise_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  exerciseType: text("exercise_type", {
    enum: ["football", "strength_training", "other"],
  }).notNull(),
  customLabel: text("custom_label"),
  durationMinutes: integer("duration_minutes").notNull(),
  effortLevel: text("effort_level", {
    enum: ["low", "medium", "high"],
  }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
