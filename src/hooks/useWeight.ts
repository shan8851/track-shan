"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";
import type { WeightChartPoint } from "@/types/charts";
import type {
  CreateWeightInput,
  PaginatedResponse,
  UpdateWeightInput,
  WeightEntry,
  WeightStats,
} from "@/types/weight";

const WEIGHT_KEYS = {
  all: ["weight"] as const,
  list: (page: number, pageSize: number) => ["weight", "list", page, pageSize] as const,
  stats: ["weight", "stats"] as const,
  chart: ["weight", "chart"] as const,
};

export const useWeightList = (page: number, pageSize: number) =>
  useQuery({
    queryKey: WEIGHT_KEYS.list(page, pageSize),
    queryFn: () =>
      apiClient.get<PaginatedResponse<WeightEntry>>("/weight", {
        page,
        pageSize,
      }),
  });

export const useWeightStats = () =>
  useQuery({
    queryKey: WEIGHT_KEYS.stats,
    queryFn: () => apiClient.get<{ data: WeightStats }>("/weight/stats"),
    select: (response) => response.data,
  });

export const useWeightChart = () =>
  useQuery({
    queryKey: WEIGHT_KEYS.chart,
    queryFn: () => apiClient.get<{ data: WeightChartPoint[] }>("/weight/chart"),
    select: (response) => response.data,
  });

export const useCreateWeight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateWeightInput) =>
      apiClient.post<{ data: WeightEntry }>("/weight", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEIGHT_KEYS.all });
    },
  });
};

export const useUpdateWeight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateWeightInput & { id: number }) =>
      apiClient.put<{ data: WeightEntry }>(`/weight/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEIGHT_KEYS.all });
    },
  });
};

export const useDeleteWeight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete<{ data: WeightEntry }>(`/weight/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEIGHT_KEYS.all });
    },
  });
};
