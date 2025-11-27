import React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "sonner";

import {
  useLoginMutation,
  useRegisterMutation,
} from "../services/queries/auth";
import type { ErrorResponse } from "../types/auth";
import type { AuthError } from "../services/queries/auth";

import { useAppDispatch } from "../features/hooks";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

function buildFieldErrorsFromApi(data: ErrorResponse): FieldErrors {
  const fieldErrors: FieldErrors = {};

  if (data.errors && data.errors.length > 0) {
    for (const err of data.errors) {
      const key = err.path as keyof FieldErrors;
      if (!fieldErrors[key]) {
        fieldErrors[key] = err.msg;
      }
    }
  }

  return fieldErrors;
}

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"login" | "register">(
    "login"
  );

  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [loginErrors, setLoginErrors] = React.useState<FieldErrors>({});

  const [regName, setRegName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPhone, setRegPhone] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");
  const [regConfirmPassword, setRegConfirmPassword] = React.useState("");
  const [showRegPassword, setShowRegPassword] = React.useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] =
    React.useState(false);
  const [regErrors, setRegErrors] = React.useState<FieldErrors>({});

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FieldErrors = {};

    if (!loginEmail) errors.email = "Email is required";
    if (!loginPassword) errors.password = "Password is required";

    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    loginMutation.mutate(
      { email: loginEmail, password: loginPassword },
      {
        onSuccess: (res) => {
          setLoginErrors({});
          const { user, token } = res.data;
          dispatch(setCredentials({ user, token }));
          toast.success("Login successful");
          navigate("/", { replace: true });
        },
        onError: (error: AuthError) => {
          const data = error.response?.data;
          if (data) {
            const fieldErrors = buildFieldErrorsFromApi(data);
            setLoginErrors(fieldErrors);

            if (data.message) {
              toast.error(data.message);
            }
          } else {
            setLoginErrors({});
            toast.error("Something went wrong. Please try again.");
          }
        },
      }
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FieldErrors = {};

    if (!regName) errors.name = "Name is required";
    if (!regEmail) errors.email = "Email is required";
    if (!regPhone) errors.phone = "Phone is required";
    if (!regPassword) errors.password = "Password is required";
    if (!regConfirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (regPassword !== regConfirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setRegErrors(errors);
    if (Object.keys(errors).length > 0) return;

    registerMutation.mutate(
      {
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      },
      {
        onSuccess: (res) => {
          setRegErrors({});
          const { user, token } = res.data;
          dispatch(setCredentials({ user, token }));
          toast.success("Register success");
          navigate("/", { replace: true });
        },
        onError: (error: AuthError) => {
          const data = error.response?.data;
          if (data) {
            const fieldErrors = buildFieldErrorsFromApi(data);
            setRegErrors(fieldErrors);

            if (data.message) {
              toast.error(data.message);
            }
          } else {
            setRegErrors({});
            toast.error("Something went wrong. Please try again.");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:block w-1/2">
        <div className="h-screen w-full bg-muted">
          <img
            src="/burger-auth.jpg"
            alt="Delicious burger"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8">
              <img
                src="/logo.png"
                alt="Foody logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Foody</span>
          </div>

          <h1 className="mt-8 text-3xl font-semibold text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Good to see you again! Let&apos;s eat
          </p>

          <div className="mt-8">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "login" | "register")}
            >
              <TabsList className="grid grid-cols-2 rounded-full bg-slate-100 p-1 h-10 w-full">
                <TabsTrigger
                  value="login"
                  className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Sign in
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <div className="space-y-1">
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      autoComplete="email"
                      className="h-12 rounded-xl bg-slate-50 border border-slate-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                    />
                    {loginErrors.email && (
                      <p className="text-sm text-red-500">
                        {loginErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        autoComplete="current-password"
                        className="h-12 rounded-xl bg-slate-50 border border-slate-200 pr-10 focus-visible:ring-red-500 focus-visible:border-red-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        aria-label={
                          showLoginPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-sm text-red-500">
                        {loginErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 flex items-center">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(Boolean(checked))
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-sm text-slate-600"
                    >
                      Remember Me
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="mt-4 w-full h-11 rounded-full bg-red-600 hover:bg-red-700 text-sm font-medium text-white"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  <div className="space-y-1">
                    <Input
                      id="reg-name"
                      placeholder="Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="h-12 rounded-xl bg-slate-50 border border-slate-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                    />
                    {regErrors.name && (
                      <p className="text-sm text-red-500">{regErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="Email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      autoComplete="email"
                      className="h-12 rounded-xl bg-slate-50 border border-slate-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                    />
                    {regErrors.email && (
                      <p className="text-sm text-red-500">{regErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Input
                      id="reg-phone"
                      placeholder="Number Phone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="h-12 rounded-xl bg-slate-50 border border-slate-200 focus-visible:ring-red-500 focus-visible:border-red-500"
                    />
                    {regErrors.phone && (
                      <p className="text-sm text-red-500">{regErrors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showRegPassword ? "text" : "password"}
                        placeholder="Password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="h-12 rounded-xl bg-slate-50 border border-slate-200 pr-10 focus-visible:ring-red-500 focus-visible:border-red-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        aria-label={
                          showRegPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showRegPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {regErrors.password && (
                      <p className="text-sm text-red-500">
                        {regErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        id="reg-confirm-password"
                        type={showRegConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="h-12 rounded-xl bg-slate-50 border border-slate-200 pr-10 focus-visible:ring-red-500 focus-visible:border-red-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                        onClick={() =>
                          setShowRegConfirmPassword((prev) => !prev)
                        }
                        aria-label={
                          showRegConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showRegConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {regErrors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {regErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="mt-4 w-full h-11 rounded-full bg-red-600 hover:bg-red-700 text-sm font-medium text-white"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Registering..." : "Register"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
