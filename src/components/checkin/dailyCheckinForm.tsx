"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CHECKIN_QUALITY_LABELS,
  CHECKIN_QUALITY_VALUES,
  MOOD_OPTIONS,
} from "@/lib/constants";
import { todayDateString } from "@/lib/formatters";
import { useCheckinEntries, useDeleteCheckinByDate, useUpsertCheckin } from "@/hooks/useCheckin";
import type { CheckinQuality, MoodValue } from "@/types/checkin";

type QualitySelectorProps = {
  label: string;
  value: CheckinQuality;
  onChange: (value: CheckinQuality) => void;
};

const QualitySelector = ({ label, value, onChange }: QualitySelectorProps) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="grid grid-cols-3 gap-2">
      {CHECKIN_QUALITY_VALUES.map((option) => (
        <Button
          key={option}
          type="button"
          variant={value === option ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option)}
        >
          {CHECKIN_QUALITY_LABELS[option] ?? option}
        </Button>
      ))}
    </div>
  </div>
);

export const DailyCheckinForm = () => {
  const [date, setDate] = useState(todayDateString());
  const [moodDraft, setMoodDraft] = useState<MoodValue | null>(null);
  const [sleepQualityDraft, setSleepQualityDraft] = useState<CheckinQuality | null>(null);
  const [productivityDraft, setProductivityDraft] = useState<CheckinQuality | null>(null);
  const [energyLevelDraft, setEnergyLevelDraft] = useState<CheckinQuality | null>(null);

  const { data: entries, isLoading } = useCheckinEntries();
  const upsertMutation = useUpsertCheckin();
  const deleteMutation = useDeleteCheckinByDate();

  const selectedEntry = useMemo(
    () => entries?.find((entry) => entry.date === date) ?? null,
    [date, entries],
  );

  const mood = moodDraft ?? selectedEntry?.mood ?? 3;
  const sleepQuality = sleepQualityDraft ?? selectedEntry?.sleepQuality ?? "ok";
  const productivity = productivityDraft ?? selectedEntry?.productivity ?? "ok";
  const energyLevel = energyLevelDraft ?? selectedEntry?.energyLevel ?? "ok";

  const isPending = upsertMutation.isPending || deleteMutation.isPending;

  const handleSave = async () => {
    try {
      await upsertMutation.mutateAsync({
        date,
        mood,
        sleepQuality,
        productivity,
        energyLevel,
      });
    } catch {
      // handled by TanStack Query
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(date);
      setMoodDraft(null);
      setSleepQualityDraft(null);
      setProductivityDraft(null);
      setEnergyLevelDraft(null);
    } catch {
      // handled by TanStack Query
    }
  };

  return (
    <div className="border border-border bg-card p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="checkin-date">Date</Label>
        <Input
          id="checkin-date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setMoodDraft(null);
            setSleepQualityDraft(null);
            setProductivityDraft(null);
            setEnergyLevelDraft(null);
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Mood</Label>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={mood === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setMoodDraft(option.value)}
              className="h-12"
              aria-label={`Mood ${option.value} ${option.label}`}
            >
              <span className="text-lg">{option.emoji}</span>
            </Button>
          ))}
        </div>
      </div>

      <QualitySelector
        label="Sleep"
        value={sleepQuality}
        onChange={setSleepQualityDraft}
      />

      <QualitySelector
        label="Productivity"
        value={productivity}
        onChange={setProductivityDraft}
      />

      <QualitySelector
        label="Energy"
        value={energyLevel}
        onChange={setEnergyLevelDraft}
      />

      <div className="flex justify-between items-center gap-2">
        <p className="text-xs text-muted-foreground">
          {isLoading
            ? "Loading daily check-ins..."
            : selectedEntry
              ? "Entry exists for this date."
              : "No entry for this date yet."}
        </p>
        <div className="flex gap-2">
          {selectedEntry && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete
            </Button>
          )}
          <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : selectedEntry ? "Update Day" : "Save Day"}
          </Button>
        </div>
      </div>
    </div>
  );
};
