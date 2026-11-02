"use client";

import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {registrationSchema} from "./registrationValidation";
import {registerUser} from "@/services/AuthService";
import { toast } from "sonner";

// Your schema + confirm password + terms (kept here so your schema file stays untouched)
const formSchema = registrationSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

const perks = [
  {icon: Truck, text: "Free shipping"},
  {icon: ShieldCheck, text: "Buyer protection"},
  {icon: Tag, text: "Member deals"},
];

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched", // validate when a field is left, then live as the user types
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });



  const onSubmit = async (data: RegisterFormValues) => {
    // Don't send `terms` or `confirmPassword` to your API
    const {terms, confirmPassword, ...payload} = data;
    try {
      const res = await registerUser(payload);
      console.log(res);
      if(res?.success){
        toast.success(res?.message )
      }else{
        toast.error(res?.message || "An error occurred while registering the user.")
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* LEFT: brand panel (desktop only) */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[oklch(0.7_0.2_52)] via-[oklch(0.62_0.22_38)] to-[oklch(0.48_0.19_30)] text-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
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
          <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
            Everything you love,
            <br />
            delivered to your door.
          </h2>
          <p className="mt-4 max-w-md text-base text-white/90 xl:text-lg">
            Create a free account and unlock member-only deals, fast checkout
            and easy order tracking.
          </p>

          <div className="relative mt-10 h-64 max-w-md xl:h-72">
            {/* Flash sale */}
            <div className="animate-fade-in-up absolute left-0 top-0 w-64 -rotate-3 rounded-2xl border border-white/25 bg-white/15 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
                  <Zap className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Flash sale</p>
                  <p className="text-xs text-white/85">Up to 70% off today</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
                <div className="h-full w-3/4 rounded-full bg-white" />
              </div>
              <p className="mt-1.5 text-xs text-white/85">75% claimed</p>
            </div>

            {/* Order delivered */}
            <div
              className="animate-fade-in-up absolute right-0 top-20 w-60 rotate-3 rounded-2xl border border-white/25 bg-white/15 p-4 shadow-xl backdrop-blur-md"
              style={{animationDelay: "150ms"}}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
                  <PackageCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Order delivered</p>
                  <p className="text-xs text-white/85">Arrived 1 day early</p>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div
              className="animate-fade-in-up absolute bottom-0 left-8 w-64 rotate-1 rounded-2xl border border-white/25 bg-white/15 p-4 shadow-xl backdrop-blur-md"
              style={{animationDelay: "300ms"}}
            >
              <div className="flex items-center gap-1 text-yellow-300">
                {Array.from({length: 5}).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-2 text-sm font-semibold text-white">
                  4.9 / 5
                </span>
              </div>
              <p className="mt-1.5 text-xs text-white/85">
                from 50,000+ happy shoppers
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: perks */}
        <ul className="relative grid grid-cols-3 gap-4 border-t border-white/25 pt-6">
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

      {/* RIGHT: registration form */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Brand header (shown on mobile/tablet, where the left panel is hidden) */}
          <div className="mb-8 text-center lg:text-left">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-primary lg:hidden"
            >
              YourStore
            </Link>
            <h1 className="mt-6 text-2xl font-semibold sm:text-3xl lg:mt-0">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Sign up to start shopping and track your orders.
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-name">Full name</FieldLabel>
                    <Input
                      {...field}
                      id="register-name"
                      placeholder="Your name"
                      autoComplete="name"
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
                name="email"
                control={form.control}
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="register-email"
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
                    <FieldLabel htmlFor="register-password">
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Re-check the match if the user already typed a confirmation
                          if (form.getValues("confirmPassword")) {
                            form.trigger("confirmPassword");
                          }
                        }}
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
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
                name="confirmPassword"
                control={form.control}
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-confirm-password">
                      Confirm password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                        className="h-11 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
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
                name="terms"
                control={form.control}
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                      />
                      <span>
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="font-medium text-foreground underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="font-medium text-foreground underline"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="h-11 w-full text-base"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Creating account..."
                : "Create account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
