"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateExercise, useUpdateExercise } from "@/hooks/useExercise";
import {
  EFFORT_LEVELS,
  EXERCISE_TYPE_LABELS,
  EXERCISE_TYPES,
} from "@/lib/constants";
import { todayDateString } from "@/lib/formatters";
import type { ExerciseEntry } from "@/types/exercise";

type ExerciseFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEntry?: ExerciseEntry | null;
};

const ExerciseForm = ({
  editEntry,
  onClose,
}: {
  editEntry?: ExerciseEntry | null;
  onClose: () => void;
}) => {
  const isEditing = !!editEntry;
  const [date, setDate] = useState(editEntry?.date ?? todayDateString());
  const [exerciseType, setExerciseType] = useState<string>(
    editEntry?.exerciseType ?? "football"
  );
  const [customLabel, setCustomLabel] = useState(
    editEntry?.customLabel ?? ""
  );
  const [durationMinutes, setDurationMinutes] = useState(
    editEntry ? String(editEntry.durationMinutes) : ""
  );
  const [effortLevel, setEffortLevel] = useState<string>(
    editEntry?.effortLevel ?? "medium"
  );

  const createMutation = useCreateExercise();
  const updateMutation = useUpdateExercise();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      date,
      exerciseType: exerciseType as "football" | "strength_training" | "other",
      customLabel: exerciseType === "other" ? customLabel : null,
      durationMinutes: parseInt(durationMinutes, 10),
      effortLevel: effortLevel as "low" | "medium" | "high",
    };

    try {
      if (isEditing && editEntry) {
        await updateMutation.mutateAsync({ id: editEntry.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // handled by TanStack Query
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "> Edit Exercise Entry" : "> New Exercise Entry"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="exercise-date">Date</Label>
          <Input
            id="exercise-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={exerciseType} onValueChange={setExerciseType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXERCISE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {EXERCISE_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {exerciseType === "other" && (
          <div className="space-y-2">
            <Label htmlFor="exercise-label">Custom Label</Label>
            <Input
              id="exercise-label"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="e.g., Swimming, Cycling..."
              required
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="exercise-duration">Duration (minutes)</Label>
          <Input
            id="exercise-duration"
            type="number"
            min="1"
            max="1440"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="60"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Effort Level</Label>
          <Select value={effortLevel} onValueChange={setEffortLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EFFORT_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
};

export const ExerciseFormModal = ({
  open,
  onOpenChange,
  editEntry,
}: ExerciseFormModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      {open && (
        <ExerciseForm
          editEntry={editEntry}
          onClose={() => onOpenChange(false)}
        />
      )}
    </DialogContent>
  </Dialog>
);
