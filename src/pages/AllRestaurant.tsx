import React from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RestaurantCard from "../components/RestaurantCard";
import { useFilteredRestaurantsQuery } from "../services/queries/restaurant";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setDistance,
  setPriceMin,
  setPriceMax,
  setRating,
} from "../features/filters/restoFiltersSlice";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { SlidersHorizontal, Star } from "lucide-react";
import type { DistanceOption } from "../features/filters/restoFiltersSlice";

const distanceOptions: {
  key: DistanceOption;
  label: string;
  range: number;
}[] = [
  { key: "nearby", label: "Nearby", range: 0 },
  { key: "1", label: "Within 1 km", range: 1 },
  { key: "3", label: "Within 3 km", range: 3 },
  { key: "5", label: "Within 5 km", range: 5 },
];

const ratingOptions = [5, 4, 3, 2, 1];

interface FilterPanelProps {
  distance: DistanceOption;
  priceMin: number | null;
  priceMax: number | null;
  rating: number | null;
  onChangeDistance: (d: DistanceOption) => void;
  onChangePriceMin: (v: number | null) => void;
  onChangePriceMax: (v: number | null) => void;
  onChangeRating: (v: number | null) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  distance,
  priceMin,
  priceMax,
  rating,
  onChangeDistance,
  onChangePriceMin,
  onChangePriceMax,
  onChangeRating,
}) => {
  const [priceMinStr, setPriceMinStr] = React.useState(
    priceMin !== null ? String(priceMin) : ""
  );
  const [priceMaxStr, setPriceMaxStr] = React.useState(
    priceMax !== null ? String(priceMax) : ""
  );

  React.useEffect(() => {
    setPriceMinStr(priceMin !== null ? String(priceMin) : "");
  }, [priceMin]);

  React.useEffect(() => {
    setPriceMaxStr(priceMax !== null ? String(priceMax) : "");
  }, [priceMax]);

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPriceMinStr(v);
    if (v === "") {
      onChangePriceMin(null);
    } else {
      const parsed = parseInt(v, 10);
      onChangePriceMin(Number.isNaN(parsed) ? null : parsed);
    }
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPriceMaxStr(v);
    if (v === "") {
      onChangePriceMax(null);
    } else {
      const parsed = parseInt(v, 10);
      onChangePriceMax(Number.isNaN(parsed) ? null : parsed);
    }
  };

  const handleDistanceClick = (key: DistanceOption) => {
    if (distance === key) onChangeDistance(null);
    else onChangeDistance(key);
  };

  const handleRatingClick = (value: number) => {
    if (rating === value) onChangeRating(null);
    else onChangeRating(value);
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.08em] text-slate-500">
        FILTER
      </p>

      <div className="mt-4 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold text-slate-800">Distance</p>
        <div className="mt-3 space-y-2">
          {distanceOptions.map((opt) => (
            <label
              key={opt.key ?? "all"}
              className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"
            >
              <Checkbox
                checked={distance === opt.key}
                onCheckedChange={() => handleDistanceClick(opt.key)}
                className="h-4 w-4"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold text-slate-800">Price</p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3">
            <span className="mr-2 text-xs font-semibold text-slate-400">
              Rp
            </span>
            <Input
              type="number"
              placeholder="Minimum Price"
              value={priceMinStr}
              onChange={handlePriceMinChange}
              className="h-8 border-0 p-0 text-xs shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3">
            <span className="mr-2 text-xs font-semibold text-slate-400">
              Rp
            </span>
            <Input
              type="number"
              placeholder="Maximum Price"
              value={priceMaxStr}
              onChange={handlePriceMaxChange}
              className="h-8 border-0 p-0 text-xs shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-800">Rating</p>
        <div className="mt-3 space-y-2">
          {ratingOptions.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"
            >
              <Checkbox
                checked={rating === opt}
                onCheckedChange={() => handleRatingClick(opt)}
                className="h-4 w-4"
              />
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{opt}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const AllRestaurantsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state) => state.restoFilters);

  const range = React.useMemo(() => {
    switch (filterState.distance) {
      case "nearby":
        return 0;
      case "1":
        return 1;
      case "3":
        return 3;
      case "5":
        return 5;
      default:
        return null;
    }
  }, [filterState.distance]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useFilteredRestaurantsQuery({
    range,
    priceMin: filterState.priceMin,
    priceMax: filterState.priceMax,
    rating: filterState.rating,
  });

  React.useEffect(() => {
    if (isError) {
      const msg =
        (error as any)?.response?.data?.message ??
        "Failed to load restaurants.";
      toast.error(msg);
    }
  }, [isError, error]);

  const restaurants = data?.data.restaurants ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar variant="solid" />

      <main className="mx-auto mt-24 w-full max-w-6xl px-4 pb-16">
        <h1 className="text-xl font-semibold text-slate-900">
          All Restaurant
        </h1>

        <div className="mt-4 flex justify-between md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex justify-between gap-2 rounded-full border-slate-300 bg-white px-4 py-2 text-xs font-medium w-full"
              >
                <span>FILTER</span>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] p-4">
              <p className="mb-4 text-xs font-semibold tracking-[0.08em] text-slate-500 bg-white">
                FILTER
              </p>
              <FilterPanel
                distance={filterState.distance}
                priceMin={filterState.priceMin}
                priceMax={filterState.priceMax}
                rating={filterState.rating}
                onChangeDistance={(d) => dispatch(setDistance(d))}
                onChangePriceMin={(v) => dispatch(setPriceMin(v))}
                onChangePriceMax={(v) => dispatch(setPriceMax(v))}
                onChangeRating={(v) => dispatch(setRating(v))}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="mt-4 flex gap-6">
          <div className="hidden w-64 md:block">
            <FilterPanel
              distance={filterState.distance}
              priceMin={filterState.priceMin}
              priceMax={filterState.priceMax}
              rating={filterState.rating}
              onChangeDistance={(d) => dispatch(setDistance(d))}
              onChangePriceMin={(v) => dispatch(setPriceMin(v))}
              onChangePriceMax={(v) => dispatch(setPriceMax(v))}
              onChangeRating={(v) => dispatch(setRating(v))}
            />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading &&
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-24 rounded-2xl bg-slate-100 animate-pulse"
                  />
                ))}

              {!isLoading &&
                restaurants.map((resto) => (
                  <RestaurantCard key={resto.id} restaurant={resto} />
                ))}

              {!isLoading && restaurants.length === 0 && (
                <p className="col-span-full text-sm text-slate-500">
                  No restaurants found.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllRestaurantsPage;
