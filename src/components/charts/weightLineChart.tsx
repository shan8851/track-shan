"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceArea, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TimeRangeSelector } from "@/components/charts/timeRangeSelector";
import { useWeightChart } from "@/hooks/useWeight";
import { WEIGHT_GOAL_MAX, WEIGHT_GOAL_MIN, WEIGHT_TIME_RANGES } from "@/lib/constants";
import type { TimeRangeLabel } from "@/lib/constants";
import { computeMovingAverage, filterByTimeRange } from "@/lib/chartUtils";
import { formatDate } from "@/lib/formatters";

import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  weightKg: { label: "Weight", color: "var(--chart-1)" },
  ma7d: { label: "7d MA", color: "var(--chart-2)" },
  ma30d: { label: "30d MA", color: "var(--chart-4)" },
} satisfies ChartConfig;

export const WeightLineChart = () => {
  const { data: rawData, isLoading } = useWeightChart();
  const [selectedRange, setSelectedRange] = useState<TimeRangeLabel>("90d");

  const { chartData, yDomain } = useMemo(() => {
    if (!rawData?.length) return { chartData: [], yDomain: [0, 100] as [number, number] };

    const rangeDays = WEIGHT_TIME_RANGES.find(
      (r) => r.label === selectedRange,
    )?.days ?? null;

    const ma7 = computeMovingAverage(rawData, 7);
    const ma30 = computeMovingAverage(rawData, 30);

    const enriched = rawData.map((point, index) => ({
      date: point.date,
      weightKg: point.weightKg,
      ma7d: ma7[index],
      ma30d: ma30[index],
    }));

    const filtered = filterByTimeRange(enriched, rangeDays);

    const allValues = filtered.flatMap((d) =>
      [d.weightKg, d.ma7d, d.ma30d].filter((v): v is number => v !== null),
    );
    const minVal = Math.min(...allValues, WEIGHT_GOAL_MIN);
    const maxVal = Math.max(...allValues, WEIGHT_GOAL_MAX);
    const padding = (maxVal - minVal) * 0.1;

    return {
      chartData: filtered,
      yDomain: [
        Math.floor(minVal - padding),
        Math.ceil(maxVal + padding),
      ] as [number, number],
    };
  }, [rawData, selectedRange]);

  if (isLoading) {
    return (
      <div className="border border-border bg-card p-8 h-80 animate-pulse flex items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="border border-border bg-card p-8 h-80 flex items-center justify-center text-muted-foreground">
        No weight data to chart yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Weight Over Time
        </h3>
        <TimeRangeSelector selected={selectedRange} onSelect={setSelectedRange} />
      </div>
      <ChartContainer config={chartConfig} className="h-80 w-full border border-border bg-card p-4">
        <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => {
              const d = new Date(value + "T00:00:00");
              return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
            }}
            className="text-muted-foreground"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            tickFormatter={(value: number) => `${value}`}
            width={40}
          />
          <ReferenceArea
            y1={WEIGHT_GOAL_MIN}
            y2={WEIGHT_GOAL_MAX}
            fill="hsl(140, 70%, 50%)"
            fillOpacity={0.08}
            strokeOpacity={0}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value: string) => formatDate(value)}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="weightKg"
            stroke="var(--color-weightKg)"
            strokeWidth={2}
            dot={chartData.length < 60}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="ma7d"
            stroke="var(--color-ma7d)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="ma30d"
            stroke="var(--color-ma30d)"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ChartContainer>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-chart-1" /> Weight
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-chart-2 border-t border-dashed border-chart-2" /> 7d MA
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-chart-4 border-t border-dashed border-chart-4" /> 30d MA
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2 bg-terminal/10" /> Goal Range
        </span>
      </div>
    </div>
  );
};
