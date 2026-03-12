"use client";

import { StatCard } from "@/components/shared/statCard";
import { WRITING_TYPE_LABELS } from "@/lib/constants";
import { useWritingStats } from "@/hooks/useWriting";

const typeCount = (
  typeBreakdown: Record<string, number>,
  writingType: string,
): number => typeBreakdown[writingType] ?? 0;

export const WritingStats = () => {
  const { data: stats, isLoading } = useWritingStats();

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="This Week"
        value={stats.thisWeekCount}
      />
      <StatCard
        label="This Month"
        value={stats.thisMonthCount}
      />
      <StatCard
        label="Total Entries"
        value={stats.totalEntries}
      />
      <StatCard
        label="Weekly Streak"
        value={stats.currentStreak}
        unit="weeks"
      />
      <StatCard
        label="Most Active"
        value={
          stats.mostActiveType ?
            WRITING_TYPE_LABELS[stats.mostActiveType] ?? stats.mostActiveType :
            null
        }
      />
      <StatCard
        label="Blog Posts"
        value={typeCount(stats.typeBreakdown, "blog_post")}
      />
      <StatCard
        label="Runbook / Docs"
        value={typeCount(stats.typeBreakdown, "runbook_docs")}
      />
      <StatCard
        label="Tweets"
        value={typeCount(stats.typeBreakdown, "tweet")}
      />
      <StatCard
        label="Other"
        value={typeCount(stats.typeBreakdown, "other")}
      />
    </div>
  );
};
