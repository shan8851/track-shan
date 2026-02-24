"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { CheckinConsistencyStrip } from "@/components/checkin/checkinConsistencyStrip";
import { StatCard } from "@/components/shared/statCard";
import { Button } from "@/components/ui/button";
import { useCheckinEntries } from "@/hooks/useCheckin";
import { computeCheckinSummary, moodEmoji, moodLabel } from "@/lib/checkinUtils";

export const CheckinSection = () => {
  const { data: entries, isLoading } = useCheckinEntries();

  const summary = useMemo(
    () => computeCheckinSummary(entries ?? []),
    [entries],
  );

  const todayMood =
    summary.today ?
      `${moodEmoji(summary.today.mood)} ${moodLabel(summary.today.mood)}` :
      null;

  return (
    <section className="space-y-4" data-testid="checkin-section">
      <div className="flex items-center justify-between">
        <Link href="/checkin" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
          <h2 className="text-lg font-bold text-terminal">&gt; daily check-in</h2>
          <ArrowRight className="h-4 w-4 text-terminal opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Button size="sm" asChild>
          <Link href="/checkin">Open</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border border-border bg-card p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Today Mood" value={todayMood} />
            <StatCard
              label="30d Avg Mood"
              value={summary.averageMood30d !== null ? summary.averageMood30d : null}
            />
            <StatCard
              label="30d Logged"
              value={
                summary.activeDays30d === 0 ?
                  "0/0" :
                  `${summary.logged30d}/${summary.activeDays30d}`
              }
            />
            <StatCard label="Streak" value={summary.streakDays} unit="days" />
          </div>
          <CheckinConsistencyStrip entries={entries ?? []} days={30} />
        </div>
      )}
    </section>
  );
};
