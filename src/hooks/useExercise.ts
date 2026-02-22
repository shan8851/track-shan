"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";
import type { ExerciseChartEntry } from "@/types/charts";
import type {
  CreateExerciseInput,
  ExerciseEntry,
  ExerciseStats,
  UpdateExerciseInput,
} from "@/types/exercise";
import type { PaginatedResponse } from "@/types/weight";

const EXERCISE_KEYS = {
  all: ["exercise"] as const,
  list: (page: number, pageSize: number) => ["exercise", "list", page, pageSize] as const,
  stats: ["exercise", "stats"] as const,
  chart: ["exercise", "chart"] as const,
};

export const useExerciseList = (page: number, pageSize: number) =>
  useQuery({
    queryKey: EXERCISE_KEYS.list(page, pageSize),
    queryFn: () =>
      apiClient.get<PaginatedResponse<ExerciseEntry>>("/exercise", {
        page,
        pageSize,
      }),
  });

export const useExerciseStats = () =>
  useQuery({
    queryKey: EXERCISE_KEYS.stats,
    queryFn: () => apiClient.get<{ data: ExerciseStats }>("/exercise/stats"),
    select: (response) => response.data,
  });

export const useExerciseChart = () =>
  useQuery({
    queryKey: EXERCISE_KEYS.chart,
    queryFn: () => apiClient.get<{ data: ExerciseChartEntry[] }>("/exercise/chart"),
    select: (response) => response.data,
  });

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExerciseInput) =>
      apiClient.post<{ data: ExerciseEntry }>("/exercise", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all });
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateExerciseInput & { id: number }) =>
      apiClient.put<{ data: ExerciseEntry }>(`/exercise/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all });
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete<{ data: ExerciseEntry }>(`/exercise/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all });
    },
  });
};
