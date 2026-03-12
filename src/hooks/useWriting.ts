"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";
import type { WritingChartEntry } from "@/types/charts";
import type { PaginatedResponse } from "@/types/weight";
import type {
  CreateWritingInput,
  UpdateWritingInput,
  WritingEntry,
  WritingStats,
} from "@/types/writing";

const WRITING_KEYS = {
  all: ["writing"] as const,
  list: (page: number, pageSize: number) => ["writing", "list", page, pageSize] as const,
  stats: ["writing", "stats"] as const,
  chart: ["writing", "chart"] as const,
};

export const useWritingList = (page: number, pageSize: number) =>
  useQuery({
    queryKey: WRITING_KEYS.list(page, pageSize),
    queryFn: () =>
      apiClient.get<PaginatedResponse<WritingEntry>>("/writing", {
        page,
        pageSize,
      }),
  });

export const useWritingStats = () =>
  useQuery({
    queryKey: WRITING_KEYS.stats,
    queryFn: () => apiClient.get<{ data: WritingStats }>("/writing/stats"),
    select: (response) => response.data,
  });

export const useWritingChart = () =>
  useQuery({
    queryKey: WRITING_KEYS.chart,
    queryFn: () => apiClient.get<{ data: WritingChartEntry[] }>("/writing/chart"),
    select: (response) => response.data,
  });

export const useCreateWriting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateWritingInput) =>
      apiClient.post<{ data: WritingEntry }>("/writing", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WRITING_KEYS.all });
    },
  });
};

export const useUpdateWriting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateWritingInput & { id: number }) =>
      apiClient.put<{ data: WritingEntry }>(`/writing/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WRITING_KEYS.all });
    },
  });
};

export const useDeleteWriting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete<{ data: WritingEntry }>(`/writing/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WRITING_KEYS.all });
    },
  });
};
