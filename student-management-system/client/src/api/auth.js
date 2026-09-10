import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "./client";

export function useSetupStatus() {
  return useQuery({
    queryKey: ["setup-status"],
    queryFn: async () => {
      const { data } = await apiClient.get("/auth/setup-status");
      return data;
    },
    retry: false,
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post("/auth/signup", payload);
      return data;
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post("/auth/login", payload);
      return data;
    },
  });
}

export function useInviteAdmin() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post("/auth/invite", payload);
      return data.admin;
    },
  });
}

export async function fetchCurrentAdmin() {
  const { data } = await apiClient.get("/auth/me");
  return data.admin;
}
