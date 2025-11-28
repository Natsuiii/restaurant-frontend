import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../api/axios";
import type { CheckoutRequest, CheckoutResponse } from "../../types/orders";
import { clearCart } from "../../features/cart/cartSlice";
import { useAppDispatch } from "../../features/hooks";

const CART_QUERY_KEY = ["cart"];

export function useCheckoutMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, AxiosError, CheckoutRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<CheckoutResponse>(
        "/order/checkout",
        body
      );
      return data;
    },
    onSuccess: () => {
      dispatch(clearCart());
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
