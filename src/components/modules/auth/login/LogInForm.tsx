"use client";

import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {logInUser} from "@/services/AuthService";
import {zodResolver} from "@hookform/resolvers/zod";
// // @ts-expect-error The package does not include TypeScript declarations.
// import ReCAPTCHA from "react-google-recaptcha";

import {
  Eye,
  EyeOff,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  TrendingDown,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";
import {logInSchema} from "./logInValidation";
import {useUser} from "@/context/UserContext";

// Your schema + the "keep me signed in" checkbox (kept here so the schema file stays untouched)
const formSchema = logInSchema.extend({
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof formSchema>;

const perks = [
  {icon: Zap, text: "Fast checkout"},
  {icon: Truck, text: "Order tracking"},
  {icon: ShieldCheck, text: "Secure payments"},
];

const LoginForm = () => {
  const router = useRouter();
  const {refreshUser} = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched", // validate when a field is left, then live as the user types
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // const handelRecaptcha=(value: string | null) => {
  //   console.log("Captcha value:", value);
  // }

  const onSubmit = async (data: LoginFormValues) => {
    // `remember` is UI-only for now; don't send it to the API
    const {remember, ...payload} = data;
    try {
      const res = await logInUser(payload);
      await refreshUser(); //

      if (res?.success) {
        toast.success(res?.message || "Logged in successfully");
        router.push("/");
        router.refresh();
      } else {
        toast.error(res?.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    // On desktop the page is exactly one screen tall, so the browser has no page scrollbar
    <div className="grid min-h-dvh w-full lg:h-dvh lg:grid-cols-2 lg:overflow-hidden">
      {/* LEFT: brand panel (desktop only) */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[oklch(0.7_0.2_52)] via-[oklch(0.62_0.22_38)] to-[oklch(0.48_0.19_30)] text-white lg:flex lg:flex-col lg:justify-between lg:p-8 xl:p-12">
        {/* Decorations */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-black/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top: logo */}
        <Link
          href="/"
          className="relative flex items-center gap-3 text-xl font-bold"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-lg">
            <ShoppingBag className="h-5 w-5" />
          </span>
          YourStore
        </Link>

        {/* Middle: headline + floating cards */}
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight xl:text-4xl 2xl:text-5xl">
            Welcome back,
            <br />
            your deals are waiting.
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/90 xl:text-base">
            Sign in to pick up where you left off: your cart, wishlist and
            orders are right where you left them.
          </p>

          <div className="relative mt-8 h-56 max-w-md xl:h-64">
            {/* Cart */}
            <div className="animate-fade-in-up absolute left-0 top-0 w-64 -rotate-3 rounded-2xl border border-white/25 bg-white/15 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
                  <ShoppingCart className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Your cart is waiting</p>
                  <p className="text-xs text-white/85">3 items saved for you</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
                <div className="h-full w-full rounded-full bg-white" />
              </div>
              <p className="mt-1.5 text-xs text-white/85">
                Free shipping unlocked
              </p>
            </div>

            {/* Order shipped */}
            <div
              className="animate-fade-in-up absolute right-0 top-16 w-60 rotate-3 rounded-2xl border border-white/25 bg-white/15 p-4 shadow-xl backdrop-blur-md xl:top-20"
              style={{animationDelay: "150ms"}}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
                  <PackageCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Order shipped</p>
                  <p className="text-xs text-white/85">Arriving tomorrow</p>
                </div>
              </div>
            </div>

            {/* Price drop */}
            <div
              className="animate-fade-in-up absolute bottom-0 left-8 w-64 rotate-1 rounded-2xl border border-white/25 bg-white/15 p-4 shadow-xl backdrop-blur-md"
              style={{animationDelay: "300ms"}}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
                  <TrendingDown className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Price drop</p>
                  <p className="text-xs text-white/85">
                    Wishlist item now 25% off
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: perks (hidden on short screens so nothing gets cut off) */}
        <ul className="relative grid grid-cols-3 gap-4 border-t border-white/25 pt-5 [@media(max-height:720px)]:hidden">
          {perks.map(({icon: Icon, text}) => (
            <li
              key={text}
              className="flex flex-col items-start gap-2 text-sm font-medium"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Icon className="h-4 w-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT: login form
          `m-auto` on the inner box keeps it centered, and if a window is very short
          the panel scrolls inside itself (scrollbar hidden), never the whole page. */}
      <div className="no-scrollbar flex px-4 py-10 sm:px-8 lg:h-dvh lg:overflow-y-auto lg:px-12">
        <div className="m-auto w-full max-w-md">
          {/* Brand header (shown on mobile/tablet, where the left panel is hidden) */}
          <div className="mb-8 text-center lg:text-left">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-primary lg:hidden"
            >
              YourStore
            </Link>
            <h1 className="mt-6 text-2xl font-semibold sm:text-3xl lg:mt-0">
              Sign in
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Enter your email and password to access your account.
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      className="h-11"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="login-password">Password</FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        className="h-11 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="remember"
                control={form.control}
                render={({field}) => (
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    Keep me signed in
                  </label>
                )}
              />
            </FieldGroup>
           
            <Button
              type="submit"
              className="h-11 w-full text-base"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full text-base"
            >
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
                />
              </svg>
              Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              New to YourStore?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
