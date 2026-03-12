"use client";

import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { WritingFormModal } from "@/components/dashboard/writingFormModal";
import { WritingStats } from "@/components/dashboard/writingStats";
import { WritingTable } from "@/components/dashboard/writingTable";
import { DeleteConfirmDialog } from "@/components/shared/deleteConfirmDialog";
import { PaginationControls } from "@/components/shared/paginationControls";
import { Button } from "@/components/ui/button";
import { useDeleteWriting, useWritingList } from "@/hooks/useWriting";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { WritingEntry } from "@/types/writing";

export const WritingSection = () => {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<WritingEntry | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<WritingEntry | null>(null);

  const { data, isLoading } = useWritingList(page, DEFAULT_PAGE_SIZE);
  const deleteMutation = useDeleteWriting();

  const handleEdit = (entry: WritingEntry) => {
    setEditEntry(entry);
    setFormOpen(true);
  };

  const handleDelete = (entry: WritingEntry) => {
    setDeleteEntry(entry);
  };

  const confirmDelete = async () => {
    if (!deleteEntry) return;
    try {
      await deleteMutation.mutateAsync(deleteEntry.id);
      setDeleteEntry(null);
    } catch {
      // handled by TanStack Query
    }
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditEntry(null);
  };

  return (
    <section className="space-y-4" data-testid="writing-section">
      <div className="flex items-center justify-between">
        <Link href="/writing" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
          <h2 className="text-lg font-bold text-terminal">&gt; writing</h2>
          <ArrowRight className="h-4 w-4 text-terminal opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Entry
        </Button>
      </div>

      <WritingStats />

      {isLoading ? (
        <div className="border border-border p-8 text-center text-muted-foreground animate-pulse">
          Loading...
        </div>
      ) : (
        <>
          <WritingTable
            entries={data?.data ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {data?.pagination && (
            <PaginationControls
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <WritingFormModal
        open={formOpen}
        onOpenChange={handleFormClose}
        editEntry={editEntry}
      />

      <DeleteConfirmDialog
        open={!!deleteEntry}
        onOpenChange={(open) => !open && setDeleteEntry(null)}
        onConfirm={confirmDelete}
        title="Delete writing entry"
        description={`Delete "${deleteEntry?.title ?? ""}" from ${deleteEntry?.date ?? ""}?`}
      />
    </section>
  );
};
