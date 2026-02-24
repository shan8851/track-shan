import {
  boolean,
  date,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const weightEntries = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull(),
  weightKg: real("weight_kg").notNull(),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const exerciseEntries = pgTable("exercise_entries", {
  id: serial("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull(),
  exerciseType: text("exercise_type", {
    enum: ["football", "strength_training", "other"],
  }).notNull(),
  customLabel: text("custom_label"),
  durationMinutes: integer("duration_minutes").notNull(),
  effortLevel: text("effort_level", {
    enum: ["low", "medium", "high"],
  }).notNull(),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    id: serial("id").primaryKey(),
    date: date("date", { mode: "string" }).notNull(),
    mood: integer("mood").notNull(),
    stressLevel: integer("stress_level").notNull().default(3),
    sleepHours: real("sleep_hours").notNull().default(0),
    coffeeCups: integer("coffee_cups").notNull().default(0),
    hadLateMeal: boolean("had_late_meal").notNull().default(false),
    sleepQuality: text("sleep_quality", {
      enum: ["bad", "ok", "good"],
    }).notNull(),
    productivity: text("productivity", {
      enum: ["bad", "ok", "good"],
    }).notNull(),
    energyLevel: text("energy_level", {
      enum: ["bad", "ok", "good"],
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("daily_checkins_date_unique").on(table.date)],
);
