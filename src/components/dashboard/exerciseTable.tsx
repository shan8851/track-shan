"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EFFORT_COLORS, EXERCISE_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatDuration } from "@/lib/formatters";
import type { ExerciseEntry } from "@/types/exercise";

type ExerciseTableProps = {
  entries: ExerciseEntry[];
  onEdit: (entry: ExerciseEntry) => void;
  onDelete: (entry: ExerciseEntry) => void;
};

export const ExerciseTable = ({
  entries,
  onEdit,
  onDelete,
}: ExerciseTableProps) => {
  if (entries.length === 0) {
    return (
      <div className="border border-border p-8 text-center text-muted-foreground">
        No exercise entries yet. Add your first session above.
      </div>
    );
  }

  const typeLabel = (entry: ExerciseEntry): string =>
    entry.exerciseType === "other" && entry.customLabel
      ? entry.customLabel
      : EXERCISE_TYPE_LABELS[entry.exerciseType] ?? entry.exerciseType;

  return (
    <div className="border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Effort</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-sm">
                {formatDate(entry.date)}
              </TableCell>
              <TableCell>{typeLabel(entry)}</TableCell>
              <TableCell className="text-terminal font-bold">
                {formatDuration(entry.durationMinutes)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={EFFORT_COLORS[entry.effortLevel]}
                >
                  {entry.effortLevel}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(entry)}
                    className="h-7 w-7 p-0"
                    aria-label={`Edit exercise entry ${entry.id}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(entry)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    aria-label={`Delete exercise entry ${entry.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
