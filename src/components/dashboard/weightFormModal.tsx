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
import { useCreateWeight, useUpdateWeight } from "@/hooks/useWeight";
import { todayDateString } from "@/lib/formatters";
import type { WeightEntry } from "@/types/weight";

type WeightFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEntry?: WeightEntry | null;
};

const WeightForm = ({
  editEntry,
  onClose,
}: {
  editEntry?: WeightEntry | null;
  onClose: () => void;
}) => {
  const isEditing = !!editEntry;
  const [date, setDate] = useState(editEntry?.date ?? todayDateString());
  const [weightKg, setWeightKg] = useState(
    editEntry ? String(editEntry.weightKg) : ""
  );

  const createMutation = useCreateWeight();
  const updateMutation = useUpdateWeight();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { date, weightKg: parseFloat(weightKg) };

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
          {isEditing ? "> Edit Weight Entry" : "> New Weight Entry"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight-date">Date</Label>
          <Input
            id="weight-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight-kg">Weight (kg)</Label>
          <Input
            id="weight-kg"
            type="number"
            step="0.1"
            min="0"
            max="500"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="75.0"
            required
          />
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

export const WeightFormModal = ({
  open,
  onOpenChange,
  editEntry,
}: WeightFormModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      {open && (
        <WeightForm
          editEntry={editEntry}
          onClose={() => onOpenChange(false)}
        />
      )}
    </DialogContent>
  </Dialog>
);
