"use client";

import { ActivityHeatmap } from "@/components/charts/activityHeatmap";
import { TypeBreakdownChart } from "@/components/charts/typeBreakdownChart";
import { ExerciseStats } from "@/components/dashboard/exerciseStats";
import { PageHeader } from "@/components/shared/pageHeader";

const ExercisePage = () => (
  <main className="min-h-screen bg-background">
    <PageHeader backHref="/" />
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <h2 className="text-lg font-bold text-terminal">&gt; exercise</h2>
      <ExerciseStats />
      <ActivityHeatmap />
      <TypeBreakdownChart />
    </div>
  </main>
);

export default ExercisePage;
