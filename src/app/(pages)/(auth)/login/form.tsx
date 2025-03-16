"use client";

import { z } from "zod";
import { lazy, Suspense } from "react";
import { FormInput, SubmitButton, ServerError } from "@/components/form";
import { FormProvider } from "@/context/form";
import { Lock, Mail } from "lucide-react";
import { createFormAction } from "@/components/form/utils/createFormAction";
import { useAuth } from "@/hooks/useAuth";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LazyFormHeader = lazy(() => import("@/components/form/header"));

export const LoginForm = ({ redirectPath = "/recipes/browse" }) => {
  const { login, loginError, authLoading } = useAuth();

  const loginAction = createFormAction(async (formData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return {
        errors: {
          email: email ? undefined : "Email is required",
          password: password ? undefined : "Password is required",
        },
        message: "Please fill in all required fields",
      };
    }

    const success = await login({ email, password }, redirectPath);
    if (success) {
      return { message: "Login successful" };
    } else {
      return {
        errors: {},
        message: `${
          loginError || "Login Failed"
        }. Please check your credentials.`,
      };
    }
  });

  return (
    <FormProvider
      schema={LoginSchema}
      action={loginAction}
      className="w-max min-w-[50%] flex flex-col gap-5 p-5 bg-white shadow-lg rounded-lg"
    >
      <Suspense
        fallback={
          <div
            role="status"
            aria-label="Loading header"
            className="h-30 transition-all bg-gray-light animate-pulse rounded"
          />
        }
      >
        <LazyFormHeader title="Login" description="Welcome back" />
        <div className="flex flex-col gap-5">
          <FormInput
            name="email"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            aria-required="true"
          />
          <FormInput
            name="password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
            aria-required="true"
          />
        </div>
        <ServerError />
        <SubmitButton
          loading={authLoading.login}
          className="bg-black text-white w-full py-2.5 rounded-md transition-colors"
        >
          Login
        </SubmitButton>
      </Suspense>
    </FormProvider>
  );
};
