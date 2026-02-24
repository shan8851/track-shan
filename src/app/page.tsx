"use client";

import { ExerciseSection } from "@/components/dashboard/exerciseSection";
import { CheckinSection } from "@/components/dashboard/checkinSection";
import { WeightSection } from "@/components/dashboard/weightSection";
import { PageHeader } from "@/components/shared/pageHeader";

const HomePage = () => (
  <main className="min-h-screen bg-background">
    <PageHeader />
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
      <CheckinSection />
      <WeightSection />
      <ExerciseSection />
    </div>
  </main>
);

export default HomePage;
