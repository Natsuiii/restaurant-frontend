import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../api/axios";
import type { RestaurantDetailResponse, RestaurantsResponse } from "../../types/restaurant";

export function useRestaurantsInfiniteQuery(limit = 12) {
  return useInfiniteQuery<RestaurantsResponse, AxiosError>({
    queryKey: ["restaurants", limit],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<RestaurantsResponse>("/resto", {
        params: {
          page: pageParam,
          limit,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) return page + 1;
      return undefined;
    },
  });
}

export function useRestaurantDetailQuery(
  id: string | number | undefined,
  limitMenu: number,
  limitReview: number
) {
  return useQuery<RestaurantDetailResponse, AxiosError>({
    queryKey: ["restaurant-detail", id, limitMenu, limitReview],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<RestaurantDetailResponse>(
        `/resto/${id}`,
        {
          params: {
            limitMenu,
            limitReview,
          },
        }
      );
      return data;
    },
  });
}

export interface RestoFilterParams {
  range: number | null;
  priceMin: number | null;
  priceMax: number | null;
  rating: number | null;
}

export function useFilteredRestaurantsQuery(filters: RestoFilterParams) {
  return useQuery<RestaurantsResponse, AxiosError>({
    queryKey: ["restaurants-filtered", filters],
    queryFn: async () => {
      const params: Record<string, number> = {};

      if (filters.range !== null) params.range = filters.range;
      if (filters.priceMin !== null) params.priceMin = filters.priceMin;
      if (filters.priceMax !== null) params.priceMax = filters.priceMax;
      if (filters.rating !== null) params.rating = filters.rating;

      const { data } = await api.get<RestaurantsResponse>("/resto", {
        params,
      });

      return data;
    },
  });
}
