import React from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAppSelector } from "../features/hooks";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../lib/formatCurrency";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import {
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "../services/queries/cart";
import { useCheckoutMutation } from "../services/queries/orders";
import { toast } from "sonner";

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

const DELIVERY_ADDRESS = "Jl. Sudirman No. 25, Jakarta Pusat, 10220";

const SERVICE_FEE = 1000;
const DELIVERY_FEE = 10000;

const paymentMethods = [
  {
    id: "bni",
    label: "Bank Negara Indonesia",
    logo: "/checkout/bni.png",
  },
  {
    id: "bri",
    label: "Bank Rakyat Indonesia",
    logo: "/checkout/bri.png",
  },
  {
    id: "bca",
    label: "Bank Central Asia",
    logo: "/checkout/bca.png",
  },
  {
    id: "mandiri",
    label: "Mandiri",
    logo: "/checkout/mandiri.png",
  },
];

const CheckoutPage: React.FC = () => {
  const cart = useAppSelector((state) => state.cart);
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const updateCartMutation = useUpdateCartItemMutation();
  const deleteCartMutation = useDeleteCartItemMutation();
  const checkoutMutation = useCheckoutMutation();

  const [pendingItemId, setPendingItemId] = React.useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<string>("bni");

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

  const totalItems = React.useMemo(
    () => cart.items.reduce((acc, it) => acc + it.qty, 0),
    [cart.items]
  );

  const subtotal = React.useMemo(
    () => cart.items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [cart.items]
  );

  const phoneNumber = auth.user?.phone ?? "-";

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

  const handleBuy = () => {
    if (!cart.items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const pm = paymentMethods.find((p) => p.id === selectedPayment);
    if (!pm) {
      toast.error("Please select a payment method.");
      return;
    }

    checkoutMutation.mutate(
      {
        paymentMethod: pm.label,
        deliveryAddress: DELIVERY_ADDRESS,
        notes: "",
      },
      {
        onSuccess: (data) => {
          toast.success("Order placed successfully");
          navigate("/checkout/success", {
            state: { transaction: data.data.transaction },
          });
        },
        onError: (error) => {
          const msg =
            (error as any)?.response?.data?.message ?? "Failed to place order";
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar variant="solid" />

      <main className="mx-auto mt-24 mb-16 flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row">
        <div className="flex-1 space-y-4">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex flex-row">
              <div className="mt-1 h-6 w-6 self-center">
                <img
                  src="/checkout/location.png"
                  alt="Location"
                  className="h-full w-full object-contain"
                />
              </div>
              &nbsp;
              <h2 className="text-base font-semibold text-slate-900 self-center">
                Delivery Address
              </h2>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex-1 text-sm text-slate-700">
                <p>{DELIVERY_ADDRESS}</p>
                <p className="mt-2">{phoneNumber}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 rounded-full border-slate-300 px-5 text-xs font-medium"
              onClick={() => navigate("/profile")}
            >
              Change
            </Button>
          </section>

          <section className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.restaurantId}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
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
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-slate-300 px-4 text-xs font-medium"
                    onClick={() => navigate(`/resto/${group.restaurantId}`)}
                  >
                    Add item
                  </Button>
                </div>

                <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
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
              </div>
            ))}
          </section>
        </div>

        <aside className="mt-4 w-full space-y-4 md:mt-0 md:w-80">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Payment Method
            </h2>
            <RadioGroup
              className="mt-4 space-y-2"
              value={selectedPayment}
              onValueChange={setSelectedPayment}
            >
              {paymentMethods.map((pm) => (
                <Label
                  key={pm.id}
                  htmlFor={pm.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-10 overflow-hidden rounded bg-slate-100">
                      <img
                        src={pm.logo}
                        alt={pm.label}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span>{pm.label}</span>
                  </div>
                  <RadioGroupItem id={pm.id} value={pm.id} />
                </Label>
              ))}
            </RadioGroup>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Payment Summary
            </h2>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>{`Price (${totalItems} items)`}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>{formatCurrency(SERVICE_FEE)}</span>
              </div>
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3 text-xs font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>
                  {formatCurrency(subtotal + DELIVERY_FEE + SERVICE_FEE)}
                </span>
              </div>
            </div>
            <Button
              className="mt-4 w-full rounded-full bg-red-600 text-sm font-medium hover:bg-red-700"
              onClick={handleBuy}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Buy"
              )}
            </Button>
          </section>
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
