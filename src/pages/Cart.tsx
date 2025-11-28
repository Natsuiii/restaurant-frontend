import React from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAppSelector } from "../features/hooks";
import { formatCurrency } from "../lib/formatCurrency";
import { Button } from "../components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "../services/queries/cart";
import { useNavigate } from "react-router-dom";

interface CartGroup {
  restaurantId: number;
  restaurantName: string;
  restaurantLogo?: string;
  items: {
    id: number;
    name: string;
    price: number;
    qty: number;
    image?: string;
  }[];
  subtotal: number;
}

const CartPage: React.FC = () => {
  const cart = useAppSelector((state) => state.cart);

  const updateCartMutation = useUpdateCartItemMutation();
  const deleteCartMutation = useDeleteCartItemMutation();

  const [pendingItemId, setPendingItemId] = React.useState<number | null>(null);
  const navigate = useNavigate();

  const groups: CartGroup[] = React.useMemo(() => {
    const map = new Map<number, CartGroup>();

    for (const item of cart.items) {
      if (!map.has(item.restaurantId)) {
        map.set(item.restaurantId, {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          restaurantLogo: item.restaurantLogo,
          items: [],
          subtotal: 0,
        });
      }
      const group = map.get(item.restaurantId)!;
      group.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
      });
      group.subtotal += item.price * item.qty;
    }

    return Array.from(map.values());
  }, [cart.items]);

  const handleIncrement = (id: number, current: number) => {
    if (pendingItemId !== null) return;

    setPendingItemId(id);
    updateCartMutation.mutate(
      { id, body: { quantity: current + 1 } },
      {
        onSettled: () => setPendingItemId(null),
      }
    );
  };

  const handleDecrement = (id: number, current: number) => {
    if (pendingItemId !== null) return;

    setPendingItemId(id);
    if (current - 1 <= 0) {
      deleteCartMutation.mutate(id, {
        onSettled: () => setPendingItemId(null),
      });
    } else {
      updateCartMutation.mutate(
        { id, body: { quantity: current - 1 } },
        {
          onSettled: () => setPendingItemId(null),
        }
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar variant="solid" />

      <main className="mx-auto mt-24 w-full max-w-4xl px-4 pb-16">
        <h1 className="text-xl font-semibold text-slate-900">My Cart</h1>

        {groups.length === 0 && (
          <p className="mt-6 text-sm text-slate-500">
            Your cart is empty. Please add some menu items first.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {groups.map((group) => (
            <div
              key={group.restaurantId}
              className="rounded-3xl bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {group.restaurantLogo ? (
                      <img
                        src={group.restaurantLogo}
                        alt={group.restaurantName}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400">Logo</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {group.restaurantName}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-4">
                {group.items.map((item) => {
                  const isPending = pendingItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-700">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full border-slate-300"
                          onClick={() => handleDecrement(item.id, item.qty)}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "−"
                          )}
                        </Button>
                        <span className="text-sm font-medium text-slate-900">
                          {item.qty}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full border-slate-300"
                          onClick={() => handleIncrement(item.id, item.qty)}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "+"
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-row items-end border-t border-slate-100 pt-4">
                <div className="mr-auto text-sm">
                  <span className="text-slate-500">Total</span>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(group.subtotal)}
                  </p>
                </div>
                <Button
                  className="mt-3 w-full rounded-full bg-red-600 text-sm font-medium hover:bg-red-700 md:w-56"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
