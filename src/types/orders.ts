export interface TransactionPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
}

export interface TransactionItemDTO {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
  itemTotal: number;
  image: string;
}

export interface TransactionRestaurantDTO {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: TransactionItemDTO[];
  subtotal: number;
}

export type TransactionStatus = "preparing" | "delivered" | "canceled";

export interface TransactionDTO {
  id: number;
  transactionId: string;
  paymentMethod: string;
  status: TransactionStatus;
  pricing: TransactionPricing;
  restaurants: TransactionRestaurantDTO[];
  createdAt: string;
}

export interface CheckoutRequest {
  paymentMethod: string;
  deliveryAddress: string;
  notes?: string;
  phone: string;
  restaurants: Restaurant[];
}

interface Restaurant {
  restaurantId: number;
  items: {
    menuId: number;
    quantity: number;
  }[];
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    transaction: TransactionDTO;
  };
}

export type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "done"
  | "cancelled";

export interface OrderRestaurantDTO {
  restaurant: {
    id: number;
    name: string;
    logo: string | null;
  };
  items: Array<{
    menuId: number;
    menuName: string;
    price: number;
    image: string | null;
    quantity: number;
    itemTotal: number;
  }>;
  subtotal: number;
}

export interface OrderSummaryDTO {
  id: number;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  updatedAt: string;
  restaurants: OrderRestaurantDTO[];
}

export interface MyOrdersResponse {
  success: boolean;
  data: {
    orders: OrderSummaryDTO[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filter: {
      status: string | null;
    };
  };
}
