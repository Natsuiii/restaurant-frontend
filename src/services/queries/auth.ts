import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../api/axios";
import type {
  AuthSuccessResponse,
  ErrorResponse,
  LoginPayload,
  RegisterPayload,
} from "../../types/auth";

export type AuthError = AxiosError<ErrorResponse>;

export function useLoginMutation() {
  return useMutation<AuthSuccessResponse, AuthError, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<AuthSuccessResponse>("/auth/login", payload);
      return data;
    },
  });
}

export function useRegisterMutation() {
  return useMutation<AuthSuccessResponse, AuthError, RegisterPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<AuthSuccessResponse>("/auth/register", payload);
      return data;
    },
  });
}
