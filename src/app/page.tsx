"use client";

import { CheckinSection } from "@/components/dashboard/checkinSection";
import { ExerciseSection } from "@/components/dashboard/exerciseSection";
import { WeeklyPulse } from "@/components/dashboard/weeklyPulse";
import { WeightSection } from "@/components/dashboard/weightSection";
import { WritingSection } from "@/components/dashboard/writingSection";

const HomePage = () => (
  <main className="min-h-screen bg-background">
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
      <WeeklyPulse />
      <CheckinSection />
      <WeightSection />
      <ExerciseSection />
      <WritingSection />
    </div>
  </main>
);

export default HomePage;
