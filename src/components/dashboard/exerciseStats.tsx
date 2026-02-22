"use client";

import { StatCard } from "@/components/shared/statCard";
import { useExerciseStats } from "@/hooks/useExercise";
import { EXERCISE_TYPE_LABELS } from "@/lib/constants";
import { formatDuration } from "@/lib/formatters";

export const ExerciseStats = () => {
  const { data: stats, isLoading } = useExerciseStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border bg-card p-4 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const topType = Object.entries(stats.typeBreakdown).sort(
    ([, a], [, b]) => b - a
  )[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Sessions (7d)"
        value={stats.sessions7d}
      />
      <StatCard
        label="Sessions (30d)"
        value={stats.sessions30d}
      />
      <StatCard
        label="Duration (30d)"
        value={formatDuration(stats.duration30d)}
      />
      <StatCard
        label="Streak"
        value={stats.currentStreak}
        unit="days"
      />
      <StatCard
        label="Top Type"
        value={topType ? EXERCISE_TYPE_LABELS[topType[0]] ?? topType[0] : null}
      />
      <StatCard
        label="Avg Effort"
        value={stats.averageEffort}
      />
      <StatCard
        label="Sessions (90d)"
        value={stats.sessions90d}
      />
      <StatCard
        label="Duration (90d)"
        value={formatDuration(stats.duration90d)}
      />
    </div>
  );
};
