"use client";

import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/shared/deleteConfirmDialog";
import { PaginationControls } from "@/components/shared/paginationControls";
import { WeightFormModal } from "@/components/dashboard/weightFormModal";
import { WeightStats } from "@/components/dashboard/weightStats";
import { WeightTable } from "@/components/dashboard/weightTable";
import { useDeleteWeight, useWeightList } from "@/hooks/useWeight";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { WeightEntry } from "@/types/weight";

export const WeightSection = () => {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<WeightEntry | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<WeightEntry | null>(null);

  const { data, isLoading } = useWeightList(page, DEFAULT_PAGE_SIZE);
  const deleteMutation = useDeleteWeight();

  const handleEdit = (entry: WeightEntry) => {
    setEditEntry(entry);
    setFormOpen(true);
  };

  const handleDelete = (entry: WeightEntry) => {
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
    <section className="space-y-4" data-testid="weight-section">
      <div className="flex items-center justify-between">
        <Link href="/weight" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
          <h2 className="text-lg font-bold text-terminal">&gt; weight</h2>
          <ArrowRight className="h-4 w-4 text-terminal opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Entry
        </Button>
      </div>

      <WeightStats />

      {isLoading ? (
        <div className="border border-border p-8 text-center text-muted-foreground animate-pulse">
          Loading...
        </div>
      ) : (
        <>
          <WeightTable
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

      <WeightFormModal
        open={formOpen}
        onOpenChange={handleFormClose}
        editEntry={editEntry}
      />

      <DeleteConfirmDialog
        open={!!deleteEntry}
        onOpenChange={(open) => !open && setDeleteEntry(null)}
        onConfirm={confirmDelete}
        title="Delete weight entry"
        description={`Delete the entry for ${deleteEntry?.date ?? ""}?`}
      />
    </section>
  );
};
