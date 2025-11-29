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
  restaurantId: number;
  restaurantName: string;
  items: TransactionItemDTO[];
  subtotal: number;
}

export interface OrderSummaryDTO {
  id: number;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  pricing: TransactionPricing;
  restaurants: OrderRestaurantDTO[];
  createdAt: string;
  updatedAt: string;
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
