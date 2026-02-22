"use client";

import { StatCard } from "@/components/shared/statCard";
import { formatTrend } from "@/lib/formatters";
import { useWeightStats } from "@/hooks/useWeight";

export const WeightStats = () => {
  const { data: stats, isLoading } = useWeightStats();

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
        label="Current"
        value={stats.current}
        unit="kg"
      />
      <StatCard
        label="All-time High"
        value={stats.allTimeHigh}
        unit="kg"
      />
      <StatCard
        label="All-time Low"
        value={stats.allTimeLow}
        unit="kg"
      />
      <StatCard
        label={`Trend ${formatTrend(stats.trend)}`}
        value={stats.avg30d !== null ? `${stats.avg30d}` : null}
        unit="kg avg (30d)"
      />
      <StatCard
        label="7d Change"
        value={stats.change7d !== null ? stats.change7d.toFixed(1) : null}
        unit="kg"
        delta={stats.change7d}
        positiveIsGood={false}
      />
      <StatCard
        label="30d Change"
        value={stats.change30d !== null ? stats.change30d.toFixed(1) : null}
        unit="kg"
        delta={stats.change30d}
        positiveIsGood={false}
      />
      <StatCard
        label="90d Change"
        value={stats.change90d !== null ? stats.change90d.toFixed(1) : null}
        unit="kg"
        delta={stats.change90d}
        positiveIsGood={false}
      />
      <StatCard
        label="90d Avg"
        value={stats.avg90d}
        unit="kg"
      />
    </div>
  );
};
