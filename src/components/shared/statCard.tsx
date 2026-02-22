"use client";

type StatCardProps = {
  label: string;
  value: string | number | null;
  delta?: number | null;
  unit?: string;
  positiveIsGood?: boolean;
};

export const StatCard = ({
  label,
  value,
  delta,
  unit = "",
  positiveIsGood = true,
}: StatCardProps) => {
  const deltaColor =
    delta === null || delta === undefined || delta === 0
      ? "text-muted-foreground"
      : (delta > 0) === positiveIsGood
        ? "text-emerald-400"
        : "text-red-400";

  const deltaSign = delta !== null && delta !== undefined && delta > 0 ? "+" : "";

  return (
    <div className="border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-bold text-terminal mt-1">
        {value !== null && value !== undefined ? `${value}${unit ? ` ${unit}` : ""}` : "—"}
      </p>
      {delta !== null && delta !== undefined && (
        <p className={`text-xs mt-1 ${deltaColor}`}>
          {deltaSign}
          {delta.toFixed(1)} {unit}
        </p>
      )}
    </div>
  );
};
