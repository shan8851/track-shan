import { afterEach, describe, expect, it, vi } from "vitest";

import {
  formatDate,
  formatDelta,
  formatDuration,
  formatTrend,
  formatWeight,
  todayDateString,
} from "@/lib/formatters";

describe("formatters", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats date, weight, and deltas", () => {
    expect(formatDate("2026-02-22")).toBe("22 Feb 2026");
    expect(formatWeight(74.26)).toBe("74.3 kg");
    expect(formatDelta(1.234, "kg")).toBe("+1.2 kg");
    expect(formatDelta(-0.75, "kg")).toBe("-0.8 kg");
  });

  it("formats durations across minute/hour boundaries", () => {
    expect(formatDuration(45)).toBe("45m");
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(75)).toBe("1h 15m");
    expect(formatDuration(125)).toBe("2h 5m");
  });

  it("formats trend arrows", () => {
    expect(formatTrend("up")).toBe("↑");
    expect(formatTrend("down")).toBe("↓");
    expect(formatTrend("stable")).toBe("→");
  });

  it("returns an ISO date string for today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-22T12:00:00.000Z"));

    expect(todayDateString()).toBe("2026-02-22");
  });
});
