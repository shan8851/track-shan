"use client";

import { useMemo } from "react";

import { CheckinDistributionChart } from "@/components/charts/checkinDistributionChart";
import { CheckinConsistencyStrip } from "@/components/checkin/checkinConsistencyStrip";
import { DailyCheckinForm } from "@/components/checkin/dailyCheckinForm";
import { PageHeader } from "@/components/shared/pageHeader";
import { StatCard } from "@/components/shared/statCard";
import { useCheckinEntries } from "@/hooks/useCheckin";
import { computeCheckinSummary, moodEmoji, moodLabel } from "@/lib/checkinUtils";

const CheckinPage = () => {
  const { data: entries } = useCheckinEntries();

  const summary = useMemo(
    () => computeCheckinSummary(entries ?? []),
    [entries],
  );

  const todayMood =
    summary.today ?
      `${moodEmoji(summary.today.mood)} ${moodLabel(summary.today.mood)}` :
      null;

  return (
    <main className="min-h-screen bg-background">
      <PageHeader backHref="/" />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <h2 className="text-lg font-bold text-terminal">&gt; daily check-in</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Today Mood" value={todayMood} />
          <StatCard label="Total Entries" value={summary.totalEntries} />
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
        <DailyCheckinForm />
        <CheckinDistributionChart />
      </div>
    </main>
  );
};

export default CheckinPage;
