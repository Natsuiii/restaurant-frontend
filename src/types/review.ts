export interface ReviewUserDTO {
  id: number;
  name: string;
}

export interface ReviewRestaurantDTO {
  id: number;
  name: string;
}

export interface ReviewDTO {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: ReviewUserDTO;
  restaurant: ReviewRestaurantDTO;
}

export interface CreateReviewRequest {
  transactionId: string;
  restaurantId: number;
  star: number;
  comment: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: {
    review: ReviewDTO;
  };
}
