import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../api/axios";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
} from "../../types/review";

export function useCreateReviewMutation() {
  return useMutation<CreateReviewResponse, AxiosError, CreateReviewRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<CreateReviewResponse>(
        "/review",
        body
      );
      return data;
    },
  });
}
