import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useRestaurantDetailQuery } from "../services/queries/restaurant";
import { toast } from "sonner";
import { Share2, ShoppingBag, Star } from "lucide-react";
import MenuCard from "../components/MenuCard";
import ReviewCard from "../components/ReviewCard";
import { Button } from "../components/ui/button";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addToCart, updateQty } from "../features/cart/cartSlice";
import { formatCurrency } from "../lib/formatCurrency";

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [limitMenu, setLimitMenu] = React.useState(8);
  const [limitReview, setLimitReview] = React.useState(6);

  const { data, isLoading, isError, error } = useRestaurantDetailQuery(
    id,
    limitMenu,
    limitReview
  );

  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  React.useEffect(() => {
    if (isError) {
      const msg =
        (error as any)?.response?.data?.message ??
        "Failed to load restaurant detail.";
      toast.error(msg);
    }
  }, [isError, error]);

  const restaurant = data?.data;

  const cartItemsForThisResto = React.useMemo(() => {
    if (!restaurant) return [];
    return cart.items.filter((i) => i.restaurantId === restaurant.id);
  }, [cart.items, restaurant]);

  const getQty = (menuId: number): number => {
    if (!restaurant) return 0;
    const idKey = `${restaurant.id}-${menuId}`;
    const it = cartItemsForThisResto.find((i) => i.id === idKey);
    return it?.qty ?? 0;
  };

  const handleAdd = (menu: any) => {
    if (!restaurant) return;
    const idKey = `${restaurant.id}-${menu.id}`;
    dispatch(
      addToCart({
        id: idKey,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        menuId: menu.id,
        name: menu.foodName,
        price: menu.price,
        qty: 1,
        image: menu.image,
      })
    );
  };

  const handleUpdateQty = (menuId: number, nextQty: number) => {
    if (!restaurant) return;
    const idKey = `${restaurant.id}-${menuId}`;
    dispatch(updateQty({ id: idKey, qty: nextQty }));
  };

  const totalItems = cartItemsForThisResto.reduce(
    (sum, it) => sum + it.qty,
    0
  );
  const totalPrice = cartItemsForThisResto.reduce(
    (sum, it) => sum + it.qty * it.price,
    0
  );

  const [activeType, setActiveType] = React.useState<string>("all");

  React.useEffect(() => {
    setActiveType("all");
  }, [restaurant?.id]);

  const menuTypes: string[] = React.useMemo(() => {
    if (!restaurant) return [];
    const set = new Set<string>();
    restaurant.menus.forEach((m) => set.add(m.type));
    return Array.from(set);
  }, [restaurant]);

  const filteredMenus = React.useMemo(() => {
    if (!restaurant) return [];
    if (activeType === "all") return restaurant.menus;
    return restaurant.menus.filter((m) => m.type === activeType);
  }, [restaurant, activeType]);

  const hasMoreMenus =
    restaurant && restaurant.totalMenus > restaurant.menus.length;

  const hasMoreReviews =
    restaurant && restaurant.totalReviews > restaurant.reviews.length;

  const ratingValue =
    restaurant?.averageRating ?? restaurant?.star ?? 0;

  if (isLoading || !restaurant) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar variant="solid" />
        <main className="mx-auto mt-24 w-full max-w-5xl px-4 pb-16">
          <p className="text-sm text-slate-500">Loading restaurant...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar variant="solid" />

      <main className="mx-auto mt-24 w-full max-w-5xl px-4 pb-24">
        <section>
          <div className="grid gap-4 md:grid-cols-[2fr,1.3fr]">
            <div className="h-64 rounded-3xl bg-slate-200 overflow-hidden md:h-80">
              {restaurant.images[0] && (
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-32 rounded-3xl bg-slate-200 overflow-hidden md:h-40">
                {restaurant.images[1] && (
                  <img
                    src={restaurant.images[1]}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="h-32 rounded-3xl bg-slate-200 overflow-hidden md:h-40">
                {restaurant.images[2] && (
                  <img
                    src={restaurant.images[2]}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                {restaurant.logo && (
                  <img
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {restaurant.name}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {ratingValue.toFixed(1)}
                  </span>
                  <span className="text-slate-400">
                    ({restaurant.totalReviews} reviews)
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {restaurant.place}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="rounded-full border-slate-300 px-4 text-xs font-medium"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
          </div>

          <div className="mt-4 border-b border-slate-200 pb-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveType("all")}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                  activeType === "all"
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                All Menu
              </button>
              {menuTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize ${
                    activeType === type
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredMenus.map((menu) => {
              const qty = getQty(menu.id);
              return (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  quantity={qty}
                  onAdd={() => handleAdd(menu)}
                  onIncrement={() => handleUpdateQty(menu.id, qty + 1)}
                  onDecrement={() => handleUpdateQty(menu.id, qty - 1)}
                />
              );
            })}

            {filteredMenus.length === 0 && (
              <p className="col-span-full text-sm text-slate-500">
                No menu items found.
              </p>
            )}
          </div>

          {hasMoreMenus && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                className="rounded-full px-8 text-sm"
                onClick={() => setLimitMenu((prev) => prev + 4)}
              >
                Show More
              </Button>
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-800">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {ratingValue.toFixed(2)}
              </span>
              <span className="text-slate-500">
                ({restaurant.totalReviews} Users)
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {restaurant.reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}

            {restaurant.reviews.length === 0 && (
              <p className="col-span-full text-sm text-slate-500">
                No reviews yet.
              </p>
            )}
          </div>

          {hasMoreReviews && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                className="rounded-full px-8 text-sm"
                onClick={() => setLimitReview((prev) => prev + 4)}
              >
                Show More
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
            </div>
            <Button className="rounded-full bg-red-600 px-8 text-sm font-medium hover:bg-red-700 text-white">
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
