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
import { useCreateWriting, useUpdateWriting } from "@/hooks/useWriting";
import { WRITING_TYPE_LABELS, WRITING_TYPES } from "@/lib/constants";
import { todayDateString } from "@/lib/formatters";
import type { WritingEntry, WritingType } from "@/types/writing";

type WritingFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEntry?: WritingEntry | null;
};

const PUBLICATION_STATUS = {
  draft: "draft",
  published: "published",
} as const;

type PublicationStatus = keyof typeof PUBLICATION_STATUS;

const WritingForm = ({
  editEntry,
  onClose,
}: {
  editEntry?: WritingEntry | null;
  onClose: () => void;
}) => {
  const isEditing = !!editEntry;
  const [date, setDate] = useState(editEntry?.date ?? todayDateString());
  const [writingType, setWritingType] = useState<WritingType>(
    editEntry?.writingType ?? "blog_post"
  );
  const [title, setTitle] = useState(editEntry?.title ?? "");
  const [url, setUrl] = useState(editEntry?.url ?? "");
  const [publicationStatus, setPublicationStatus] =
    useState<PublicationStatus>(
      editEntry?.published ? PUBLICATION_STATUS.published : PUBLICATION_STATUS.draft
    );

  const createMutation = useCreateWriting();
  const updateMutation = useUpdateWriting();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      date,
      writingType,
      title,
      url: url.trim().length > 0 ? url.trim() : null,
      published: publicationStatus === PUBLICATION_STATUS.published,
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
          {isEditing ? "> Edit Writing Entry" : "> New Writing Entry"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="writing-date">Date</Label>
          <Input
            id="writing-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={writingType}
            onValueChange={(value) => setWritingType(value as WritingType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WRITING_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {WRITING_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="writing-title">Title</Label>
          <Input
            id="writing-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short description of the piece"
            maxLength={200}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="writing-url">URL</Label>
          <Input
            id="writing-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/published-piece"
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={publicationStatus}
            onValueChange={(value) => setPublicationStatus(value as PublicationStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PUBLICATION_STATUS.draft}>Draft</SelectItem>
              <SelectItem value={PUBLICATION_STATUS.published}>
                Published
              </SelectItem>
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

export const WritingFormModal = ({
  open,
  onOpenChange,
  editEntry,
}: WritingFormModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      {open && (
        <WritingForm
          editEntry={editEntry}
          onClose={() => onOpenChange(false)}
        />
      )}
    </DialogContent>
  </Dialog>
);
