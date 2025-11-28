export interface CartRestaurantDTO {
  id: number;
  name: string;
  logo: string;
}

export interface CartMenuDTO {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface CartItemDTO {
  id: number;
  restaurant: CartRestaurantDTO;
  menu: CartMenuDTO;
  quantity: number;
  itemTotal: number;
}

export interface CartGroupDTO {
  restaurant: CartRestaurantDTO;
  items: CartItemDTO[];
  subtotal: number;
}

export interface CartSummaryDTO {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
}

export interface CartGetResponse {
  success: boolean;
  data: {
    cart: CartGroupDTO[];
    summary: CartSummaryDTO;
  };
}

export interface CartAddRequest {
  restaurantId: number;
  menuId: number;
  quantity: number;
}

export interface CartAddResponse {
  success: boolean;
  message: string;
  data: {
    cartItem: CartItemDTO;
  };
}

export interface CartUpdateRequest {
  quantity: number;
}

export interface CartUpdateResponse {
  success: boolean;
  data: {
    cartItem: CartItemDTO;
  };
}

export interface CartClearResponse {
  success: boolean;
  message: string;
}

export interface CartRemoveResponse {
  success: boolean;
  message: string;
}
