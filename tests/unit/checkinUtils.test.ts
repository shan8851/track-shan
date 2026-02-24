import { describe, expect, it } from "vitest";

import {
  buildRecentCheckinDays,
  checkinMoodColor,
  buildMetricDistribution,
  computeAverageMood,
  computeCheckinSummary,
  computeStreakDays,
  filterByDays,
  moodEmoji,
  moodLabel,
} from "@/lib/checkinUtils";
import type { DailyCheckinEntry } from "@/types/checkin";

const entries: DailyCheckinEntry[] = [
  {
    id: 4,
    date: "2026-02-22",
    mood: 4,
    sleepQuality: "good",
    productivity: "ok",
    energyLevel: "good",
    createdAt: "2026-02-22T08:00:00.000Z",
    updatedAt: "2026-02-22T08:00:00.000Z",
  },
  {
    id: 3,
    date: "2026-02-21",
    mood: 3,
    sleepQuality: "ok",
    productivity: "good",
    energyLevel: "ok",
    createdAt: "2026-02-21T08:00:00.000Z",
    updatedAt: "2026-02-21T08:00:00.000Z",
  },
  {
    id: 2,
    date: "2026-02-20",
    mood: 5,
    sleepQuality: "good",
    productivity: "good",
    energyLevel: "good",
    createdAt: "2026-02-20T08:00:00.000Z",
    updatedAt: "2026-02-20T08:00:00.000Z",
  },
  {
    id: 1,
    date: "2026-02-18",
    mood: 2,
    sleepQuality: "bad",
    productivity: "bad",
    energyLevel: "ok",
    createdAt: "2026-02-18T08:00:00.000Z",
    updatedAt: "2026-02-18T08:00:00.000Z",
  },
];

describe("checkinUtils", () => {
  it("maps mood values to emoji and labels", () => {
    expect(moodEmoji(5)).toBe("😄");
    expect(moodLabel(1)).toBe("Very Low");
  });

  it("filters by day windows", () => {
    const now = new Date("2026-02-22T12:00:00.000Z");
    const filtered = filterByDays(entries, 2, now);
    expect(filtered.map((entry) => entry.date)).toEqual([
      "2026-02-22",
      "2026-02-21",
      "2026-02-20",
    ]);
  });

  it("computes consecutive streak from today", () => {
    const now = new Date("2026-02-22T12:00:00.000Z");
    expect(computeStreakDays(entries, now)).toBe(3);
  });

  it("computes average mood", () => {
    expect(computeAverageMood(entries)).toBe(3.5);
    expect(computeAverageMood([])).toBeNull();
  });

  it("builds summary stats", () => {
    const now = new Date("2026-02-22T12:00:00.000Z");
    expect(computeCheckinSummary(entries, now)).toEqual({
      today: entries[0],
      totalEntries: 4,
      streakDays: 3,
      logged30d: 4,
      activeDays30d: 5,
      averageMood30d: 3.5,
    });
  });

  it("builds mood distribution", () => {
    const moodBuckets = buildMetricDistribution(entries, "mood");
    expect(moodBuckets.map((bucket) => bucket.count)).toEqual([0, 1, 1, 1, 1]);
  });

  it("builds quality distribution", () => {
    const sleepBuckets = buildMetricDistribution(entries, "sleepQuality");
    expect(sleepBuckets.map((bucket) => bucket.count)).toEqual([1, 1, 2]);
  });

  it("builds consistency strip data starting from today", () => {
    const now = new Date("2026-02-22T12:00:00.000Z");
    const strip = buildRecentCheckinDays(entries, 4, now);

    expect(strip.map((day) => day.date)).toEqual([
      "2026-02-22",
      "2026-02-21",
      "2026-02-20",
      "2026-02-19",
    ]);
    expect(strip.map((day) => day.logged)).toEqual([true, true, true, false]);
    expect(strip.map((day) => day.status)).toEqual([
      "logged",
      "logged",
      "logged",
      "missed",
    ]);
    expect(strip[0]?.mood).toBe(4);
    expect(strip[3]?.mood).toBeNull();
  });

  it("marks dates before first check-in as pre_start", () => {
    const now = new Date("2026-02-22T12:00:00.000Z");
    const strip = buildRecentCheckinDays(entries, 7, now);
    expect(strip[5]?.date).toBe("2026-02-17");
    expect(strip[5]?.status).toBe("pre_start");
  });

  it("returns colors for mood and missing days", () => {
    expect(checkinMoodColor(1)).toContain("hsl(");
    expect(checkinMoodColor(5)).toContain("hsl(");
    expect(checkinMoodColor(null)).toBe("var(--secondary)");
  });
});
