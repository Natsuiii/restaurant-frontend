import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import type { Restaurant } from "../types/restaurant";
import { Link } from "react-router-dom";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/resto/${restaurant.id}`} className="block">
      <Card className="border-none bg-white shadow-sm transition-shadow hover:shadow-md rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 shadow-sm overflow-hidden">
              {restaurant.logo ? (
                <img
                  src={restaurant.logo}
                  alt={`${restaurant.name} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-[10px] text-slate-400">Logo</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {restaurant.name}
              </p>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <p className="font-medium text-sm">
                  {restaurant.star.toFixed(1)}
                </p>
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">
                {restaurant.place} • {restaurant.distance} km
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
