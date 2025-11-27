import React from "react";
import { Button } from "./ui/button";
import type { RestaurantMenu } from "../types/restaurant";
import { formatCurrency } from "../lib/formatCurrency";

interface MenuCardProps {
  menu: RestaurantMenu;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative h-36 w-full bg-slate-100">
        {menu.image && (
          <img
            src={menu.image}
            alt={menu.foodName}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-row justify-between p-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {menu.foodName}
          </p>
          <p className="mt-1 text-sm font-medium text-red-600">
            {formatCurrency(menu.price)}
          </p>
        </div>

        <div className="flex justify-end my-auto">
          {quantity <= 0 ? (
            <Button
              size="sm"
              className="rounded-full bg-red-600 px-4 text-xs font-medium hover:bg-red-700 text-white"
              onClick={onAdd}
            >
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7 rounded-full border-slate-300"
                onClick={onDecrement}
              >
                -
              </Button>
              <span className="text-sm font-medium text-slate-900">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7 rounded-full border-slate-300"
                onClick={onIncrement}
              >
                +
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
