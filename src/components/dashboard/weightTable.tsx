"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatWeight } from "@/lib/formatters";
import type { WeightEntry } from "@/types/weight";

type WeightTableProps = {
  entries: WeightEntry[];
  onEdit: (entry: WeightEntry) => void;
  onDelete: (entry: WeightEntry) => void;
};

export const WeightTable = ({ entries, onEdit, onDelete }: WeightTableProps) => {
  if (entries.length === 0) {
    return (
      <div className="border border-border p-8 text-center text-muted-foreground">
        No weight entries yet. Add your first entry above.
      </div>
    );
  }

  return (
    <div className="border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-sm">
                {formatDate(entry.date)}
              </TableCell>
              <TableCell className="text-terminal font-bold">
                {formatWeight(entry.weightKg)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(entry)}
                    className="h-7 w-7 p-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(entry)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
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
