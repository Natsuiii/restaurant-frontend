import React from "react";
import {
  ShoppingCart,
  MapPin,
  FileText,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { logout } from "../features/auth/authSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  variant?: "auto" | "solid";
}

const Navbar: React.FC<NavbarProps> = ({ variant = "auto" }) => {
  const auth = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(auth.token);
  const userName = auth.user?.name ?? "";

  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    if (variant !== "auto") return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const isSolid = variant === "solid" || isScrolled;

  const wrapperClass = isSolid
    ? "bg-white text-slate-900 shadow-sm"
    : "bg-transparent text-white";

  const signInClasses = isSolid
    ? "border-slate-300 text-slate-900 hover:bg-slate-50"
    : "border-white text-white hover:bg-white/10";

  const signUpClasses = isSolid
    ? "bg-slate-900 text-white hover:bg-slate-800"
    : "bg-white text-slate-900 hover:bg-slate-100";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const totalCartItems = cart.items.reduce(
    (sum, it) => sum + it.qty,
    0
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${wrapperClass}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2 h-10 w-10 cursor-pointer" onClick={() => navigate("/", { replace: true })}>
          <img
            src="/logo.png"
            alt="Foody logo"
            className="h-full w-full object-cover"
          />
          <span className="hidden text-lg font-semibold tracking-tight md:inline">
            Foody
          </span>
        </div>

        {!isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className={`h-9 rounded-full border bg-transparent text-xs font-medium ${signInClasses}`}
            >
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button
              asChild
              className={`h-9 rounded-full px-5 text-xs font-medium ${signUpClasses}`}
            >
              <Link to="/auth">Sign up</Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-current hover:bg-white/20"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                  {totalCartItems}
                </span>
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                    {userName ? userName.charAt(0).toUpperCase() : ""}
                  </div>
                  <span className="hidden text-xs font-medium md:inline">
                    {userName}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-0 shadow-xl"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                      {userName || "Guest"}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator className="my-0" />

                <DropdownMenuLabel className="sr-only">
                  User menu
                </DropdownMenuLabel>

                <DropdownMenuItem className="cursor-pointer px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" />
                    <span>Delivery Address</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <span>My Orders</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer px-4 py-2.5 text-sm text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
