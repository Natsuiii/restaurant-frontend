import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Home";
import AuthPage from "../pages/Auth";
import RestaurantDetailPage from "../pages/Detail";
import { Toaster } from "sonner";
import { useAppSelector } from "../features/hooks";
import AllRestaurantsPage from "@/pages/AllRestaurant";
import CartPage from "../pages/Cart";
import CheckoutPage from "../pages/Checkout";
import CheckoutSuccessPage from "../pages/CheckoutSuccess";

const App: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(auth.token);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resto/:id" element={<RestaurantDetailPage />} />
        <Route path="/restaurants" element={<AllRestaurantsPage />} />
        <Route
          path="/cart"
          element={isLoggedIn ? <CartPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/checkout"
          element={
            isLoggedIn ? <CheckoutPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/checkout/success"
          element={
            isLoggedIn ? (
              <CheckoutSuccessPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/auth"
          element={isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;
