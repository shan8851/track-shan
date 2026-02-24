import { afterEach, describe, expect, it, vi } from "vitest";

import {
  aggregateExerciseByDay,
  bmiCategory,
  buildHeatmapData,
  computeBmi,
  computeIntensityLevels,
  computeMovingAverage,
  filterByTimeRange,
  generateYearGrid,
  heatmapColor,
} from "@/lib/chartUtils";

describe("chartUtils", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("computes moving averages with null values until the window is full", () => {
    const input = [
      { date: "2026-02-01", weightKg: 70 },
      { date: "2026-02-02", weightKg: 71 },
      { date: "2026-02-03", weightKg: 72 },
      { date: "2026-02-04", weightKg: 73 },
    ] as const;

    expect(computeMovingAverage(input, 3)).toEqual([null, null, 71, 72]);
  });

  it("filters by time range against the current date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-22T12:00:00.000Z"));

    const input = [
      { date: "2026-02-10", value: 1 },
      { date: "2026-02-13", value: 2 },
      { date: "2026-02-20", value: 3 },
    ] as const;

    expect(filterByTimeRange(input, 7)).toEqual([{ date: "2026-02-20", value: 3 }]);
    expect(filterByTimeRange(input, 10)).toEqual([
      { date: "2026-02-13", value: 2 },
      { date: "2026-02-20", value: 3 },
    ]);
    expect(filterByTimeRange(input, null)).toEqual([...input]);
  });

  it("computes BMI and category boundaries", () => {
    expect(computeBmi(75, 175)).toBe(24.5);
    expect(bmiCategory(18.4)).toBe("Underweight");
    expect(bmiCategory(18.5)).toBe("Normal");
    expect(bmiCategory(25)).toBe("Overweight");
    expect(bmiCategory(30)).toBe("Obese");
  });

  it("aggregates exercise minutes by day", () => {
    const map = aggregateExerciseByDay([
      { date: "2026-02-01", exerciseType: "football", durationMinutes: 30 },
      { date: "2026-02-01", exerciseType: "football", durationMinutes: 45 },
      { date: "2026-02-02", exerciseType: "other", durationMinutes: 20 },
    ]);

    expect(map.get("2026-02-01")).toBe(75);
    expect(map.get("2026-02-02")).toBe(20);
  });

  it("generates a full year grid aligned by weekday columns", () => {
    const endDate = new Date(2026, 1, 22, 12, 0, 0, 0);
    const grid = generateYearGrid(endDate);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const endDow = end.getDay();
    const expectedLength = 52 * 7 + endDow + 1;
    const expectedEndIso = end.toISOString().split("T")[0] ?? "";

    expect(grid).toHaveLength(expectedLength);
    expect(grid[0]?.col).toBe(0);
    expect(grid[0]?.row).toBe(0);
    expect(grid[grid.length - 1]).toEqual({
      date: expectedEndIso,
      col: 52,
      row: endDow,
    });
  });

  it("computes intensity levels and maps heatmap colors", () => {
    const dayMap = new Map<string, number>([
      ["2026-02-01", 0],
      ["2026-02-02", 10],
      ["2026-02-03", 20],
      ["2026-02-04", 30],
      ["2026-02-05", 40],
      ["2026-02-06", 50],
      ["2026-02-07", 60],
    ]);

    const intensityMap = computeIntensityLevels(dayMap);

    expect(intensityMap.get("2026-02-01")).toBe(0);
    expect(intensityMap.get("2026-02-02")).toBe(1);
    expect(intensityMap.get("2026-02-07")).toBe(5);
    expect(heatmapColor(0)).toBe("var(--secondary)");
    expect(heatmapColor(5)).toBe("hsl(140, 70%, 50%, 0.95)");
    expect(heatmapColor(99)).toBe("var(--secondary)");
  });

  it("builds heatmap entries from grid, totals, and intensities", () => {
    const grid = [
      { date: "2026-02-01", col: 0, row: 0 },
      { date: "2026-02-02", col: 0, row: 1 },
    ];
    const dayMap = new Map<string, number>([
      ["2026-02-01", 40],
      ["2026-02-02", 20],
    ]);
    const intensityMap = new Map<string, number>([
      ["2026-02-01", 4],
      ["2026-02-02", 2],
    ]);

    expect(buildHeatmapData(grid, dayMap, intensityMap)).toEqual([
      { date: "2026-02-01", totalMinutes: 40, intensity: 4 },
      { date: "2026-02-02", totalMinutes: 20, intensity: 2 },
    ]);
  });
});
