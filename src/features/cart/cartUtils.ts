// src/features/cart/cartUtils.ts
import type { CartGroupDTO, CartItemDTO } from "../../types/cart";
import type { CartItem } from "./cartSlice";

// Dipakai untuk POST/PUT /cart yang memang punya field `restaurant`
export function mapCartItemDTO(dto: CartItemDTO): CartItem {
  return {
    id: dto.id,
    restaurantId: dto.restaurant.id,
    restaurantName: dto.restaurant.name,
    restaurantLogo: dto.restaurant.logo,
    menuId: dto.menu.id,
    name: dto.menu.foodName,
    price: dto.menu.price,
    qty: dto.quantity,
    image: dto.menu.image,
  };
}

export function mapCartGroupsToItems(groups: CartGroupDTO[]): CartItem[] {
  const items: CartItem[] = [];

  groups.forEach((group) => {
    const resto = group.restaurant;

    group.items.forEach((it) => {
      items.push({
        id: it.id,
        restaurantId: resto.id,
        restaurantName: resto.name,
        restaurantLogo: resto.logo,
        menuId: it.menu.id,
        name: it.menu.foodName,
        price: it.menu.price,
        qty: it.quantity,
        image: it.menu.image,
      });
    });
  });

  return items;
}
