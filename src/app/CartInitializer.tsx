import React from "react";
import { useCartQuery } from "../services/queries/cart";
import { useAppSelector } from "../features/hooks";

const CartInitializer: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(auth.token);

  useCartQuery(isLoggedIn);

  return null;
};

export default CartInitializer;
