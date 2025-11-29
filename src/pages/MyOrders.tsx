import React from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Star, Search, X, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import { useMyOrdersQuery } from "../services/queries/orders";
import type { OrderStatus, OrderSummaryDTO } from "../types/orders";
import { formatCurrency } from "../lib/formatCurrency";
import { useCreateReviewMutation } from "@/services/queries/review";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const STATUS_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Status" },
  { value: "preparing", label: "Preparing" },
  { value: "on_the_way", label: "On the Way" },
  { value: "delivered", label: "Delivered" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Canceled" },
];

interface OrderRestaurantView {
  id: string;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  updatedAt: string;
  restaurantId: number;
  restaurantName: string;
  items: {
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
    itemTotal: number;
  }[];
  subtotal: number;
}

const MyOrdersPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<OrderStatus | "all">("all");

  const { data, isLoading } = useMyOrdersQuery({
    status: status === "all" ? undefined : status,
    page: 1,
    limit: 10,
  });

  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false);
  const [reviewTarget, setReviewTarget] =
    React.useState<OrderRestaurantView | null>(null);
  const [rating, setRating] = React.useState<number>(4);
  const [comment, setComment] = React.useState<string>("");

  const reviewMutation = useCreateReviewMutation();

  const rawOrders = data?.data.orders ?? [];

  const orderRestaurants: OrderRestaurantView[] = React.useMemo(() => {
    const list: OrderRestaurantView[] = [];

    rawOrders.forEach((order: OrderSummaryDTO) => {
      order.restaurants.forEach((resto) => {
        list.push({
          id: `${order.id}-${resto.restaurantId}`,
          transactionId: order.transactionId,
          status: order.status,
          paymentMethod: order.paymentMethod,
          updatedAt: order.updatedAt,
          restaurantId: resto.restaurantId,
          restaurantName: resto.restaurantName,
          items: resto.items,
          subtotal: resto.subtotal,
        });
      });
    });

    return list;
  }, [rawOrders]);

  const handleOpenReview = (order: OrderRestaurantView) => {
      setReviewTarget(order);
      setRating(0);
      setComment("");
      setReviewDialogOpen(true);
    };

    const handleSubmitReview = () => {
      if (!reviewTarget || rating <= 0) return;

      reviewMutation.mutate(
        {
          transactionId: reviewTarget.transactionId,
          restaurantId: reviewTarget.restaurantId,
          star: rating,
          comment: comment.trim(),
        },
        {
          onSuccess: (data) => {
            toast.success(data.message || "Review submitted");
            setReviewDialogOpen(false);
          },
          onError: (error: any) => {
            const msg =
              error?.response?.data?.message || "Failed to submit review";
            toast.error(msg);
          },
        }
      );
    };

  const filteredOrderRestaurants = React.useMemo(() => {
    if (!search.trim()) return orderRestaurants;

    const term = search.toLowerCase();
    return orderRestaurants.filter((or) => {
      const restaurantMatch = or.restaurantName.toLowerCase().includes(term);

      const menuMatch = or.items.some((i) =>
        i.menuName.toLowerCase().includes(term)
      );

      return restaurantMatch || menuMatch;
    });
  }, [orderRestaurants, search]);

  const renderOrderCard = (order: OrderRestaurantView) => {
    const updatedLabel = dayjs(order.updatedAt).format("DD MMM YYYY, HH:mm");

    

    return (
      <div key={order.id} className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
              <img
                src="/orders/restaurant.png"
                alt={order.restaurantName}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {order.restaurantName}
            </span>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-4">
          {order.items.map((item) => (
            <div
              key={item.menuId}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="h-11 w-11 overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src="/images/order-item-placeholder.png"
                    alt={item.menuName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    {item.menuName}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-slate-700">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-sm">
            <span className="text-slate-500">Total</span>
            <p className="text-sm font-semibold text-slate-900">
              {formatCurrency(order.subtotal)}
            </p>
          </div>

          <Button
            className="rounded-full bg-red-600 px-6 text-xs font-medium hover:bg-red-700"
            onClick={() => handleOpenReview(order)}
          >
            Give Review
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar variant="solid" />

      <main className="mx-auto mt-24 mb-16 flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row">
        <AccountSidebar />

        <section className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">My Orders</h1>

          <div className="mt-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search"
                className="h-9 rounded-full border-slate-200 pl-9 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Tabs
              defaultValue={status}
              onValueChange={(val) => setStatus(val as OrderStatus | "all")}
            >
              <TabsList className="flex flex-wrap gap-2 rounded-full bg-slate-50 p-1">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-full px-3 py-1 text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-5 space-y-4">
            {isLoading && (
              <p className="text-xs text-slate-500">Loading orders...</p>
            )}

            {!isLoading && filteredOrderRestaurants.length === 0 && (
              <p className="text-xs text-slate-500">No orders found.</p>
            )}

            {!isLoading &&
              filteredOrderRestaurants.map((order) => renderOrderCard(order))}
          </div>

          <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
            <DialogContent className="max-w-md rounded-3xl p-0">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <DialogTitle className="text-base font-semibold text-slate-900">
                  Give Review
                </DialogTitle>
                <button
                  type="button"
                  onClick={() => setReviewDialogOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                </button>
              </div>

              <div className="px-6 pb-6 pt-4">
                <p className="text-center text-xs font-medium text-slate-700">
                  Give Rating
                </p>

                <div className="mt-3 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className="h-6 w-6"
                        fill={star <= rating ? "#F97316" : "#E5E7EB"}
                        stroke={star <= rating ? "#F97316" : "#E5E7EB"}
                      />
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Please share your thoughts about our service!"
                    className="min-h-[140px] resize-none rounded-2xl border-slate-200 text-xs"
                  />
                </div>

                <Button
                  className="mt-5 w-full rounded-full bg-red-600 text-sm font-medium hover:bg-red-700"
                  onClick={handleSubmitReview}
                  disabled={reviewMutation.isPending || rating <= 0}
                >
                  {reviewMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrdersPage;
