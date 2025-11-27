// src/components/ReviewCard.tsx
import React from "react";
import { Star } from "lucide-react";
import dayjs from "dayjs";
import type { RestaurantReview } from "../types/restaurant";

interface ReviewCardProps {
  review: RestaurantReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = dayjs(review.createdAt).format("DD MMM YYYY, HH:mm");

  const rating = review.star as number;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-200" />
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {review.user.name}
          </p>
          <p className="text-xs text-slate-500">{formattedDate}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
        {[...Array(rating)].map((_, i) => (
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="mt-3 text-sm text-slate-700">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
