import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { TransactionDTO } from "../types/orders";
import dayjs from "dayjs";
import { Button } from "../components/ui/button";

interface LocationState {
  transaction?: TransactionDTO;
}

const CheckoutSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  const transaction = state?.transaction;

  React.useEffect(() => {
    if (!transaction) {
      navigate("/", { replace: true });
    }
  }, [transaction, navigate]);

  if (!transaction) {
    return null;
  }

  const totalItems = transaction.restaurants.reduce(
    (acc, resto) => acc + resto.items.reduce((a, it) => a + it.quantity, 0),
    0
  );

  const formattedDate = dayjs(transaction.createdAt).format(
    "DD MMMM YYYY, HH:mm"
  );

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="mb-4 flex flex-row items-center gap-2">
        <div className="h-8 w-8">
          <img
            src="/logo.png"
            alt="Foody"
            className="h-full w-full object-contain"
          />
        </div>
        <span className="text-lg font-semibold text-slate-900">Foody</span>
      </div>
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
            <span className="text-xl text-white">✓</span>
          </div>
          <h1 className="mt-2 text-base font-semibold text-slate-900">
            Payment Success
          </h1>
          <p className="text-xs text-slate-500">
            Your payment has been successfully processed.
          </p>
        </div>

        <div className="mt-4 border-t border-slate-200 pt-4 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Date</span>
            <span className="font-medium text-slate-900">{formattedDate}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Payment Method</span>
            <span className="font-medium text-slate-900">
              {transaction.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">
              {`Price (${totalItems} items)`}
            </span>
            <span className="font-medium text-slate-900">
              Rp{transaction.pricing.subtotal.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Delivery Fee</span>
            <span className="font-medium text-slate-900">
              Rp{transaction.pricing.deliveryFee.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Service Fee</span>
            <span className="font-medium text-slate-900">
              Rp{transaction.pricing.serviceFee.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="mt-2 border-t border-dashed border-slate-200 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Total</span>
              <span className="font-semibold text-slate-900">
                Rp
                {transaction.pricing.totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        <Button
          className="mt-5 w-full rounded-full bg-red-600 text-sm font-medium hover:bg-red-700"
          onClick={() => navigate("/orders")}
        >
          See My Orders
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
