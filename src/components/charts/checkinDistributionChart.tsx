"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useCheckinEntries } from "@/hooks/useCheckin";
import {
  CHECKIN_METRIC_LABELS,
  CHECKIN_METRICS,
  CHECKIN_TIME_RANGES,
} from "@/lib/constants";
import { buildMetricDistribution, filterByDays } from "@/lib/checkinUtils";
import type { CheckinMetric } from "@/types/checkin";

import type { ChartConfig } from "@/components/ui/chart";
import type { CheckinTimeRangeLabel } from "@/lib/constants";

const chartConfig = {
  count: { label: "Days", color: "var(--chart-1)" },
} satisfies ChartConfig;

const metricColorMap: Record<CheckinMetric, string[]> = {
  mood: [
    "hsl(0, 75%, 55%)",
    "hsl(25, 80%, 52%)",
    "hsl(50, 80%, 50%)",
    "hsl(120, 55%, 45%)",
    "hsl(140, 70%, 50%)",
  ],
  sleepQuality: [
    "hsl(0, 70%, 55%)",
    "hsl(45, 80%, 52%)",
    "hsl(140, 70%, 50%)",
  ],
  productivity: [
    "hsl(0, 70%, 55%)",
    "hsl(45, 80%, 52%)",
    "hsl(140, 70%, 50%)",
  ],
  energyLevel: [
    "hsl(0, 70%, 55%)",
    "hsl(45, 80%, 52%)",
    "hsl(140, 70%, 50%)",
  ],
};

export const CheckinDistributionChart = () => {
  const { data: entries, isLoading } = useCheckinEntries();
  const [metric, setMetric] = useState<CheckinMetric>("mood");
  const [selectedRange, setSelectedRange] = useState<CheckinTimeRangeLabel>("30d");

  const data = useMemo(() => {
    const rangeDays = CHECKIN_TIME_RANGES.find(
      (range) => range.label === selectedRange,
    )?.days ?? 30;
    const filteredEntries = filterByDays(entries ?? [], rangeDays);
    const distribution = buildMetricDistribution(filteredEntries, metric);
    const colors = metricColorMap[metric];

    return distribution.map((bucket, index) => ({
      ...bucket,
      fill: colors[index] ?? "var(--chart-1)",
    }));
  }, [entries, metric, selectedRange]);

  if (isLoading) {
    return (
      <div className="border border-border bg-card p-8 h-72 animate-pulse flex items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Distribution
        </h3>
        <div className="flex gap-1 flex-wrap">
          {CHECKIN_TIME_RANGES.map((range) => (
            <Button
              key={range.label}
              type="button"
              size="xs"
              variant={selectedRange === range.label ? "default" : "outline"}
              onClick={() => setSelectedRange(range.label)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {CHECKIN_METRICS.map((checkinMetric) => (
          <Button
            key={checkinMetric}
            type="button"
            size="xs"
            variant={metric === checkinMetric ? "default" : "outline"}
            onClick={() => setMetric(checkinMetric)}
          >
            {CHECKIN_METRIC_LABELS[checkinMetric] ?? checkinMetric}
          </Button>
        ))}
      </div>

      <ChartContainer config={chartConfig} className="h-72 w-full border border-border bg-card p-4">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="label"
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
          />
          <YAxis allowDecimals={false} className="text-muted-foreground" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={2}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
