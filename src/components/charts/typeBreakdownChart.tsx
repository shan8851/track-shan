"use client";

import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useExerciseChart } from "@/hooks/useExercise";
import { EXERCISE_TYPE_LABELS } from "@/lib/constants";
import { formatDuration } from "@/lib/formatters";

import type { ChartConfig } from "@/components/ui/chart";
import type { TypeBreakdownItem } from "@/types/charts";

const CHART_COLORS: Record<string, string> = {
  football: "var(--chart-1)",
  strength_training: "var(--chart-2)",
  other: "var(--chart-3)",
};

const chartConfig = {
  totalMinutes: { label: "Duration" },
  football: { label: "Football", color: "var(--chart-1)" },
  strength_training: { label: "Strength Training", color: "var(--chart-2)" },
  other: { label: "Other", color: "var(--chart-3)" },
} satisfies ChartConfig;

export const TypeBreakdownChart = () => {
  const { data: entries, isLoading } = useExerciseChart();

  const { breakdownData, totalDuration } = useMemo(() => {
    if (!entries?.length) return { breakdownData: [], totalDuration: 0 };

    const typeMap = new Map<string, number>();
    entries.forEach((entry) => {
      const existing = typeMap.get(entry.exerciseType) ?? 0;
      typeMap.set(entry.exerciseType, existing + entry.durationMinutes);
    });

    const data: TypeBreakdownItem[] = [...typeMap.entries()].map(([type, minutes]) => ({
      type,
      label: EXERCISE_TYPE_LABELS[type] ?? type,
      totalMinutes: minutes,
      fill: CHART_COLORS[type] ?? "var(--chart-3)",
    }));

    const total = data.reduce((sum, d) => sum + d.totalMinutes, 0);

    return { breakdownData: data, totalDuration: total };
  }, [entries]);

  if (isLoading) {
    return (
      <div className="border border-border bg-card p-8 h-64 animate-pulse flex items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  if (!breakdownData.length) {
    return (
      <div className="border border-border bg-card p-8 h-64 flex items-center justify-center text-muted-foreground">
        No exercise data to chart yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Type Breakdown
      </h3>
      <div className="border border-border bg-card p-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    typeof value === "number" ? formatDuration(value) : String(value)
                  }
                  nameKey="type"
                />
              }
            />
            <Pie
              data={breakdownData}
              dataKey="totalMinutes"
              nameKey="type"
              innerRadius={60}
              outerRadius={90}
              strokeWidth={2}
              stroke="var(--background)"
            >
              {breakdownData.map((entry) => (
                <Cell key={entry.type} fill={entry.fill} />
              ))}
              <Label
                content={() => (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-foreground font-bold text-lg"
                  >
                    {formatDuration(totalDuration)}
                  </text>
                )}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          {breakdownData.map((item) => (
            <span key={item.type} className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="inline-block w-2.5 h-2.5"
                style={{ backgroundColor: item.fill }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
