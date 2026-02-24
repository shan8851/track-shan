"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CHECKIN_QUALITY_LABELS,
  CHECKIN_QUALITY_VALUES,
  MOOD_OPTIONS,
  STRESS_OPTIONS,
} from "@/lib/constants";
import { todayDateString } from "@/lib/formatters";
import {
  useCheckinEntries,
  useDeleteCheckinByDate,
  useUpsertCheckin,
} from "@/hooks/useCheckin";
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
  const [stressLevelDraft, setStressLevelDraft] = useState<MoodValue | null>(null);
  const [sleepHoursDraft, setSleepHoursDraft] = useState<string | null>(null);
  const [coffeeCupsDraft, setCoffeeCupsDraft] = useState<string | null>(null);
  const [lastCoffeeAtDraft, setLastCoffeeAtDraft] = useState<string | null>(null);
  const [hadLateMealDraft, setHadLateMealDraft] = useState<boolean | null>(null);
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
  const stressLevel = stressLevelDraft ?? selectedEntry?.stressLevel ?? 3;
  const sleepHoursInput =
    sleepHoursDraft ?? (selectedEntry ? `${selectedEntry.sleepHours}` : "7.5");
  const coffeeCupsInput =
    coffeeCupsDraft ?? (selectedEntry ? `${selectedEntry.coffeeCups}` : "0");
  const lastCoffeeAtInput =
    lastCoffeeAtDraft ?? (selectedEntry?.lastCoffeeAt ?? "");
  const hadLateMeal = hadLateMealDraft ?? selectedEntry?.hadLateMeal ?? false;
  const sleepQuality = sleepQualityDraft ?? selectedEntry?.sleepQuality ?? "ok";
  const productivity = productivityDraft ?? selectedEntry?.productivity ?? "ok";
  const energyLevel = energyLevelDraft ?? selectedEntry?.energyLevel ?? "ok";

  const parsedSleepHours = Number.parseFloat(sleepHoursInput);
  const parsedCoffeeCups = Number.parseInt(coffeeCupsInput, 10);

  const isSleepHoursValid =
    !Number.isNaN(parsedSleepHours) && parsedSleepHours >= 0 && parsedSleepHours <= 24;
  const isCoffeeCupsValid =
    !Number.isNaN(parsedCoffeeCups) &&
    parsedCoffeeCups >= 0 &&
    parsedCoffeeCups <= 20;
  const normalizedLastCoffeeAt =
    parsedCoffeeCups > 0 ? (lastCoffeeAtInput.trim() || null) : null;
  const isLastCoffeeAtValid =
    normalizedLastCoffeeAt === null ||
    /^([01]\d|2[0-3]):([0-5]\d)$/u.test(normalizedLastCoffeeAt);

  const isPending = upsertMutation.isPending || deleteMutation.isPending;
  const canSave =
    !isPending &&
    isSleepHoursValid &&
    isCoffeeCupsValid &&
    isLastCoffeeAtValid;

  const clearDrafts = () => {
    setMoodDraft(null);
    setStressLevelDraft(null);
    setSleepHoursDraft(null);
    setCoffeeCupsDraft(null);
    setLastCoffeeAtDraft(null);
    setHadLateMealDraft(null);
    setSleepQualityDraft(null);
    setProductivityDraft(null);
    setEnergyLevelDraft(null);
  };

  const handleSave = async () => {
    if (!isSleepHoursValid || !isCoffeeCupsValid || !isLastCoffeeAtValid) return;

    try {
      await upsertMutation.mutateAsync({
        date,
        mood,
        stressLevel,
        sleepHours: parsedSleepHours,
        coffeeCups: parsedCoffeeCups,
        lastCoffeeAt: normalizedLastCoffeeAt,
        hadLateMeal,
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
      clearDrafts();
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
            clearDrafts();
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

      <div className="space-y-2">
        <Label>Stress</Label>
        <div className="grid grid-cols-5 gap-2">
          {STRESS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={stressLevel === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStressLevelDraft(option.value)}
              className="h-12"
              aria-label={`Stress ${option.value} ${option.label}`}
            >
              <span className="text-lg">{option.emoji}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="sleep-hours">Sleep duration (hours)</Label>
          <Input
            id="sleep-hours"
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.25}
            value={sleepHoursInput}
            onChange={(event) => setSleepHoursDraft(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coffee-cups">Coffee (cups)</Label>
          <Input
            id="coffee-cups"
            type="number"
            inputMode="numeric"
            min={0}
            max={20}
            step={1}
            value={coffeeCupsInput}
            onChange={(event) => setCoffeeCupsDraft(event.target.value)}
          />
        </div>
      </div>

      {parsedCoffeeCups > 0 && (
        <div className="space-y-2">
          <Label htmlFor="last-coffee-at">Last coffee time</Label>
          <Input
            id="last-coffee-at"
            type="time"
            value={lastCoffeeAtInput}
            onChange={(event) => setLastCoffeeAtDraft(event.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Late meal</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={hadLateMeal ? "default" : "outline"}
            size="sm"
            onClick={() => setHadLateMealDraft(true)}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={!hadLateMeal ? "default" : "outline"}
            size="sm"
            onClick={() => setHadLateMealDraft(false)}
          >
            No
          </Button>
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
          <Button type="button" size="sm" onClick={handleSave} disabled={!canSave}>
            {isPending ? "Saving..." : selectedEntry ? "Update Day" : "Save Day"}
          </Button>
        </div>
      </div>
    </div>
  );
};
