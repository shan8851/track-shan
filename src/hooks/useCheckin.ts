"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";
import type {
  DailyCheckinEntry,
  UpsertDailyCheckinInput,
} from "@/types/checkin";

const CHECKIN_KEYS = {
  all: ["checkin"] as const,
  list: ["checkin", "list"] as const,
};

export const useCheckinEntries = () =>
  useQuery({
    queryKey: CHECKIN_KEYS.list,
    queryFn: () => apiClient.get<{ data: DailyCheckinEntry[] }>("/checkin"),
    select: (response) => response.data,
  });

export const useUpsertCheckin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertDailyCheckinInput) =>
      apiClient.put<{ data: DailyCheckinEntry }>("/checkin", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKIN_KEYS.all });
    },
  });
};

export const useDeleteCheckinByDate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (date: string) =>
      apiClient.delete<{ data: DailyCheckinEntry }>(`/checkin?date=${date}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKIN_KEYS.all });
    },
  });
};
