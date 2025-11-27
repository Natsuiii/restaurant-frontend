import React from "react";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";
import RestaurantCard from "../components/RestaurantCard";
import { useRestaurantsInfiniteQuery } from "../services/queries/restaurant";
import { toast } from "sonner";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "All Restaurant",
    logo: "/menu/all.png",
    href: "/restaurants",
  },
  {
    name: "Nearby",
    logo: "/menu/nearby.png",
    href: "/",
  },
  {
    name: "Discount",
    logo: "/menu/discount.png",
    href: "/",
  },
  {
    name: "Best Seller",
    logo: "/menu/best.png",
    href: "/",
  },
  {
    name: "Delivery",
    logo: "/menu/delivery.png",
    href: "/",
  },
  {
    name: "Lunch",
    logo: "/menu/lunch.png",
    href: "/",
  },
];

const HomePage: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRestaurantsInfiniteQuery(12);

  React.useEffect(() => {
    if (isError) {
      const msg =
        (error as any)?.response?.data?.message ??
        "Failed to load restaurants. Please try again.";
      toast.error(msg);
    }
  }, [isError, error]);

  const restaurants =
    data?.pages.flatMap((page) => page.data.restaurants) ?? [];
    
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="relative">
          <div className="h-[700px] w-full">
            <div className="absolute inset-0">
              <img
                src="/burger-hero.png"
                alt="Burger hero"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-16">
              <h1 className="text-center text-3xl font-semibold text-white md:text-4xl">
                Explore Culinary Experiences
              </h1>
              <p className="mt-3 max-w-xl text-center text-sm text-slate-100 md:text-base">
                Search and refine your choice to discover the perfect
                restaurant.
              </p>

              <div className="mt-6 w-full max-w-xl">
                <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-lg">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search restaurants, food and drink"
                    className="ml-3 flex-1 border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
            <div className="grid grid-cols-3 gap-4 rounded-3xl bg-white px-3 py-4 shadow-sm md:grid-cols-6">
              {categories.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`flex flex-col items-center rounded-2xl bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md `}
                  onClick={() => navigate(item.href, { replace: true })}
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 shadow-sm overflow-hidden">
                    <img
                      src={item.logo}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-center text-xs font-medium text-slate-700">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recommended
                </h2>
                <button
                  type="button"
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                  onClick={() => navigate("/restaurants", { replace: true })}
                >
                  See All
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading && (
                  <>
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-32 rounded-2xl bg-slate-100 animate-pulse"
                      />
                    ))}
                  </>
                )}

                {!isLoading &&
                  restaurants.map((resto) => (
                    <RestaurantCard key={resto.id} restaurant={resto} />
                  ))}

                {!isLoading && !isError && restaurants.length === 0 && (
                  <p className="col-span-full text-center text-sm text-slate-500">
                    No restaurants found.
                  </p>
                )}
              </div>

              {hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 text-sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "Show More"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
