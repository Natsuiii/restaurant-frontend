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