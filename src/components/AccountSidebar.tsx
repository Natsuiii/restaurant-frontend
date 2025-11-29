import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { logout } from "../features/auth/authSlice";
import { clearCart } from "../features/cart/cartSlice";
import { cn } from "../lib/cn";
import { FileText, LogOut, MapPin } from "lucide-react";

const AccountSidebar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const userName = auth.user?.name ?? "Guest";

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/", { replace: true });
  };

  const isMyOrders = pathname.startsWith("/orders");
  console.log("Is My Orders", isMyOrders);
  const isDeliveryAddress = pathname.startsWith("/profile");

  return (
    <aside className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-sm h-fit hidden md:block">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
          {userName ? userName.charAt(0).toUpperCase() : ""}
        </div>
        <span className="hidden text-xs font-medium md:inline">{userName}</span>
      </div>

      <nav className="mt-4 space-y-1 text-sm">
        <Link
          to="/profile"
          className={cn(
            "flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-slate-50",
            isDeliveryAddress ? "text-red-600" : "text-slate-700"
          )}
        >
          <span className="inline-block h-4 w-4">
            <MapPin className="h-4 w-4" />
          </span>
          <span>Delivery Address</span>
        </Link>

        <Link
          to="/orders"
          className={cn(
            "flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-slate-50",
            isMyOrders ? "text-red-600" : "text-slate-700"
          )}
        >
          <span className="inline-block h-4 w-4">
            <FileText className="h-4 w-4" />
          </span>
          <span>My Orders</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
        >
          <span className="inline-block h-4 w-4">
            <LogOut className="h-4 w-4" />
          </span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
