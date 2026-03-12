"use client";

import { ActivityHeatmap } from "@/components/charts/activityHeatmap";
import { TypeBreakdownChart } from "@/components/charts/typeBreakdownChart";
import { ExerciseStats } from "@/components/dashboard/exerciseStats";
import { PageHeader } from "@/components/shared/pageHeader";

const ExercisePage = () => (
  <main className="min-h-screen bg-background">
    <PageHeader backHref="/" title="> exercise" />
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <ExerciseStats />
      <ActivityHeatmap />
      <TypeBreakdownChart />
    </div>
  </main>
);

export default ExercisePage;
