import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Home";
import AuthPage from "../pages/Auth";
import RestaurantDetailPage from "../pages/Detail";
import { Toaster } from "sonner";
import { useAppSelector } from "../features/hooks";
import AllRestaurantsPage from "@/pages/AllRestaurant";

const App: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(auth.token);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resto/:id" element={<RestaurantDetailPage />} />
        <Route
          path="/auth"
          element={isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route path="/restaurants" element={<AllRestaurantsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;
