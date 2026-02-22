"use client";

import { WeightLineChart } from "@/components/charts/weightLineChart";
import { WeightStats } from "@/components/dashboard/weightStats";
import { PageHeader } from "@/components/shared/pageHeader";
import { StatCard } from "@/components/shared/statCard";
import { useWeightChart } from "@/hooks/useWeight";
import { HEIGHT_CM } from "@/lib/constants";
import { computeBmi, bmiCategory } from "@/lib/chartUtils";

const BmiStatCard = () => {
  const { data: chartData } = useWeightChart();

  const latestWeight = chartData?.length
    ? chartData[chartData.length - 1]?.weightKg ?? null
    : null;

  const bmi = latestWeight !== null ? computeBmi(latestWeight, HEIGHT_CM) : null;
  const category = bmi !== null ? bmiCategory(bmi) : null;

  return (
    <StatCard
      label="BMI"
      value={bmi !== null ? `${bmi}` : null}
      unit={category ?? ""}
    />
  );
};

const WeightPage = () => (
  <main className="min-h-screen bg-background">
    <PageHeader backHref="/" />
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <h2 className="text-lg font-bold text-terminal">&gt; weight</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="col-span-2 md:col-span-4">
          <WeightStats />
        </div>
        <BmiStatCard />
      </div>
      <WeightLineChart />
    </div>
  </main>
);

export default WeightPage;
