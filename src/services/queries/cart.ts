import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../api/axios";
import type {
  CartAddRequest,
  CartAddResponse,
  CartClearResponse,
  CartGetResponse,
  CartRemoveResponse,
  CartUpdateRequest,
  CartUpdateResponse,
} from "../../types/cart";
import {
  clearCart,
  removeCartItem,
  setCartItems,
  upsertCartItem,
} from "../../features/cart/cartSlice";
import { useAppDispatch } from "../../features/hooks";
import {
  mapCartGroupsToItems,
  mapCartItemDTO,
} from "../../features/cart/cartUtils";

const CART_QUERY_KEY = ["cart"];

// GET /cart
export function useCartQuery(enabled: boolean) {
  const dispatch = useAppDispatch();

  return useQuery<CartGetResponse, AxiosError>({
    queryKey: CART_QUERY_KEY,
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data } = await api.get<CartGetResponse>("/cart");
      const items = mapCartGroupsToItems(data.data.cart); 
      dispatch(setCartItems(items));                      
      return data;
    },
  });
}

// POST /cart
export function useAddCartItemMutation() {
  const dispatch = useAppDispatch();

  return useMutation<CartAddResponse, AxiosError, CartAddRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<CartAddResponse>("/cart", body);
      return data;
    },
    onSuccess: (data) => {
      const mapped = mapCartItemDTO(data.data.cartItem);
      dispatch(upsertCartItem(mapped));
    },
  });
}

// PUT /cart/{id}
export function useUpdateCartItemMutation() {
  const dispatch = useAppDispatch();

  return useMutation<
    CartUpdateResponse,
    AxiosError,
    { id: number; body: CartUpdateRequest }
  >({
    mutationFn: async ({ id, body }) => {
      const { data } = await api.put<CartUpdateResponse>(`/cart/${id}`, body);
      return data;
    },
    onSuccess: (data) => {
      const mapped = mapCartItemDTO(data.data.cartItem);
      dispatch(upsertCartItem(mapped));
    },
  });
}

// DELETE /cart/{id}
export function useDeleteCartItemMutation() {
  const dispatch = useAppDispatch();

  return useMutation<CartRemoveResponse, AxiosError, number>({
    mutationFn: async (id) => {
      const { data } = await api.delete<CartRemoveResponse>(`/cart/${id}`);
      return data;
    },
    onSuccess: (_data, id) => {
      dispatch(removeCartItem(id));
    },
  });
}

// DELETE /cart (clear all)
export function useClearCartMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<CartClearResponse, AxiosError>({
    mutationFn: async () => {
      const { data } = await api.delete<CartClearResponse>("/cart");
      return data;
    },
    onSuccess: () => {
      dispatch(clearCart());
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
