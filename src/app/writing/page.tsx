"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { WritingActivityHeatmap } from "@/components/charts/writingActivityHeatmap";
import { WritingTypeChart } from "@/components/charts/writingTypeChart";
import { WritingFormModal } from "@/components/dashboard/writingFormModal";
import { WritingStats } from "@/components/dashboard/writingStats";
import { WritingTable } from "@/components/dashboard/writingTable";
import { DeleteConfirmDialog } from "@/components/shared/deleteConfirmDialog";
import { PaginationControls } from "@/components/shared/paginationControls";
import { PageHeader } from "@/components/shared/pageHeader";
import { Button } from "@/components/ui/button";
import { useDeleteWriting, useWritingList } from "@/hooks/useWriting";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { WritingEntry } from "@/types/writing";

const WritingPage = () => {
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
    <main className="min-h-screen bg-background">
      <PageHeader backHref="/" title="> writing" />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            log output
          </span>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Entry
          </Button>
        </div>

        <WritingStats />
        <WritingActivityHeatmap />
        <WritingTypeChart />

        {isLoading ? (
          <div className="border border-border p-8 text-center text-muted-foreground animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
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
          </div>
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
      </div>
    </main>
  );
};

export default WritingPage;
