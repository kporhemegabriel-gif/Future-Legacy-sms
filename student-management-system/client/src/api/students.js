import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

const STUDENTS_KEY = "students";
const SUMMARY_KEY = "students-summary";

export function useStudents(params) {
  return useQuery({
    queryKey: [STUDENTS_KEY, params],
    queryFn: async () => {
      const { data } = await apiClient.get("/students", { params });
      return data;
    },
    keepPreviousData: true,
  });
}

export function useStudentSummary() {
  return useQuery({
    queryKey: [SUMMARY_KEY],
    queryFn: async () => {
      const { data } = await apiClient.get("/students/meta/summary");
      return data.data;
    },
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post("/students", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await apiClient.put(`/students/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, hard = false }) => {
      const { data } = await apiClient.delete(`/students/${id}`, {
        params: hard ? { hard: "true" } : {},
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
    },
  });
}
