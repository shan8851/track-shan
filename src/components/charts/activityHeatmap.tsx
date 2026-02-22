"use client";

import { useMemo } from "react";

import { useExerciseChart } from "@/hooks/useExercise";
import {
  aggregateExerciseByDay,
  computeIntensityLevels,
  generateYearGrid,
  heatmapColor,
} from "@/lib/chartUtils";
import { formatDate, formatDuration } from "@/lib/formatters";

const CELL_SIZE = 13;
const CELL_GAP = 3;
const MONTH_LABEL_HEIGHT = 16;

export const ActivityHeatmap = () => {
  const { data: entries, isLoading } = useExerciseChart();

  const { grid, dayMap, intensityMap, totalCols } = useMemo(() => {
    const today = new Date();
    const yearGrid = generateYearGrid(today);
    const exerciseDayMap = aggregateExerciseByDay(entries ?? []);
    const exerciseIntensityMap = computeIntensityLevels(exerciseDayMap);
    const maxCol = yearGrid.reduce((max, d) => Math.max(max, d.col), 0);

    return {
      grid: yearGrid,
      dayMap: exerciseDayMap,
      intensityMap: exerciseIntensityMap,
      totalCols: maxCol + 1,
    };
  }, [entries]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;

    grid.forEach((day) => {
      if (day.row !== 0) return;
      const date = new Date(day.date + "T00:00:00");
      const month = date.getMonth();
      if (month !== lastMonth) {
        lastMonth = month;
        labels.push({
          label: date.toLocaleDateString("en-GB", { month: "short" }),
          col: day.col,
        });
      }
    });

    return labels;
  }, [grid]);

  if (isLoading) {
    return (
      <div className="border border-border bg-card p-8 h-40 animate-pulse flex items-center justify-center text-muted-foreground">
        Loading heatmap...
      </div>
    );
  }

  const svgWidth = totalCols * (CELL_SIZE + CELL_GAP) + CELL_GAP;
  const svgHeight = 7 * (CELL_SIZE + CELL_GAP) + CELL_GAP + MONTH_LABEL_HEIGHT;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Activity (365 days)
      </h3>
      <div className="border border-border bg-card p-4 overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="block">
          {monthLabels.map((m) => (
            <text
              key={`${m.label}-${m.col}`}
              x={m.col * (CELL_SIZE + CELL_GAP) + CELL_GAP}
              y={12}
              className="fill-muted-foreground"
              fontSize={10}
              fontFamily="var(--font-jetbrains)"
            >
              {m.label}
            </text>
          ))}
          {grid.map((day) => {
            const intensity = intensityMap.get(day.date) ?? 0;
            const minutes = dayMap.get(day.date) ?? 0;
            return (
              <rect
                key={day.date}
                x={day.col * (CELL_SIZE + CELL_GAP) + CELL_GAP}
                y={day.row * (CELL_SIZE + CELL_GAP) + CELL_GAP + MONTH_LABEL_HEIGHT}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={heatmapColor(intensity)}
                rx={0}
              >
                <title>
                  {formatDate(day.date)}: {minutes > 0 ? formatDuration(minutes) : "No activity"}
                </title>
              </rect>
            );
          })}
        </svg>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className="inline-block"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: heatmapColor(level),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};
