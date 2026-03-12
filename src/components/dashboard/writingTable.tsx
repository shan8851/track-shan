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
import { WRITING_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/formatters";
import type { WritingEntry } from "@/types/writing";

type WritingTableProps = {
  entries: WritingEntry[];
  onEdit: (entry: WritingEntry) => void;
  onDelete: (entry: WritingEntry) => void;
};

const statusBadgeClassName = (published: boolean): string =>
  published ?
    "border-signal-green/35 bg-signal-green/15 text-signal-green" :
    "text-muted-foreground";

export const WritingTable = ({
  entries,
  onEdit,
  onDelete,
}: WritingTableProps) => {
  if (entries.length === 0) {
    return (
      <div className="border border-border p-8 text-center text-muted-foreground">
        No writing entries yet. Add your first entry above.
      </div>
    );
  }

  return (
    <div className="border border-border max-h-80 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-sm">
                {formatDate(entry.date)}
              </TableCell>
              <TableCell>
                {WRITING_TYPE_LABELS[entry.writingType] ?? entry.writingType}
              </TableCell>
              <TableCell className="max-w-[20rem]">
                <p className="truncate font-medium">{entry.title}</p>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusBadgeClassName(entry.published)}
                >
                  {entry.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-terminal hover:underline underline-offset-4"
                  >
                    Open
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(entry)}
                    className="h-7 w-7 p-0"
                    aria-label={`Edit writing entry ${entry.id}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(entry)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    aria-label={`Delete writing entry ${entry.id}`}
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
