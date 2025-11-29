import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../api/axios";

export interface ProfileDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileDTO;
}

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  currentPassword?: string;
  newPassword?: string;
}

export type UpdateProfileResponse = ProfileResponse;

const PROFILE_QUERY_KEY = ["profile"];

export function useProfileQuery() {
  return useQuery<ProfileResponse, AxiosError>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<ProfileResponse>("/auth/profile");
      return data;
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, AxiosError, UpdateProfileRequest>({
    mutationFn: async (body) => {
      const { data } = await api.put<UpdateProfileResponse>(
        "/auth/profile",
        body
      );
      return data;
    },
    onSuccess: () => {
      // refresh data profile setelah update
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}
