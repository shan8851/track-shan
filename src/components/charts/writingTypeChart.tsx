"use client";

import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useWritingChart } from "@/hooks/useWriting";
import { WRITING_TYPE_LABELS, WRITING_TYPES } from "@/lib/constants";

import type { ChartConfig } from "@/components/ui/chart";
import type { WritingTypeBreakdownItem } from "@/types/charts";

const CHART_COLORS = {
  blog_post: "var(--chart-1)",
  runbook_docs: "var(--chart-2)",
  tweet: "var(--chart-3)",
  other: "var(--chart-4)",
} as const;

const chartConfig = {
  totalEntries: { label: "Entries" },
  blog_post: { label: WRITING_TYPE_LABELS.blog_post, color: "var(--chart-1)" },
  runbook_docs: { label: WRITING_TYPE_LABELS.runbook_docs, color: "var(--chart-2)" },
  tweet: { label: WRITING_TYPE_LABELS.tweet, color: "var(--chart-3)" },
  other: { label: WRITING_TYPE_LABELS.other, color: "var(--chart-4)" },
} satisfies ChartConfig;

export const WritingTypeChart = () => {
  const { data: entries, isLoading } = useWritingChart();

  const { breakdownData, totalEntries } = useMemo(() => {
    if (!entries?.length) return { breakdownData: [], totalEntries: 0 };

    const typeMap = entries.reduce(
      (map, entry) => map.set(entry.writingType, (map.get(entry.writingType) ?? 0) + 1),
      new Map<(typeof WRITING_TYPES)[number], number>(),
    );

    const data: WritingTypeBreakdownItem[] = WRITING_TYPES
      .map((type) => ({
        type,
        label: WRITING_TYPE_LABELS[type],
        totalEntries: typeMap.get(type) ?? 0,
        fill: CHART_COLORS[type],
      }))
      .filter((item) => item.totalEntries > 0);

    return {
      breakdownData: data,
      totalEntries: data.reduce((sum, item) => sum + item.totalEntries, 0),
    };
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
        No writing data to chart yet.
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
              content={<ChartTooltipContent formatter={(value) => `${value} entries`} nameKey="type" />}
            />
            <Pie
              data={breakdownData}
              dataKey="totalEntries"
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
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
                    <tspan
                      x="50%"
                      className="fill-foreground text-lg font-bold"
                    >
                      {totalEntries}
                    </tspan>
                    <tspan
                      x="50%"
                      dy="1.25rem"
                      className="fill-muted-foreground text-[11px]"
                    >
                      entries
                    </tspan>
                  </text>
                )}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex justify-center gap-4 mt-2 text-xs flex-wrap">
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
