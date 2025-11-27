export interface PriceRange {
  min: number;
  max: number;
}

export interface Restaurant {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  reviewCount: number;
  menuCount: number;
  priceRange: PriceRange;
  distance: number;
}

export interface RestaurantsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RestaurantFilters {
  range: number | null;
  priceMin: number | null;
  priceMax: number | null;
  rating: number | null;
}

export interface RestaurantsData {
  restaurants: Restaurant[];
  pagination: RestaurantsPagination;
  filters: RestaurantFilters;
}

export interface RestaurantsResponse {
  success: boolean;
  data: RestaurantsData;
}

export interface Coordinates {
  lat: number;
  long: number;
}

export interface RestaurantMenu {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface RestaurantReviewUser {
  id: number;
  name: string;
}

export interface RestaurantReview {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: RestaurantReviewUser;
}

export interface RestaurantDetail {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  coordinates: Coordinates;
  logo: string;
  images: string[];
  totalMenus: number;
  totalReviews: number;
  menus: RestaurantMenu[];
  reviews: RestaurantReview[];
}

export interface RestaurantDetailResponse {
  success: boolean;
  message: string;
  data: RestaurantDetail;
}
