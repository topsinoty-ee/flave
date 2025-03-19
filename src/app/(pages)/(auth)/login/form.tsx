"use client";

import { Lock, Mail } from "lucide-react";
import { Suspense } from "react";
import { z } from "zod";

import { useAuth } from "@/context";
import { createAction, FormProvider } from "@/context/form";
import { FormHeader, FormInput, SubmitButton } from "@/context/form/components";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginForm = ({ redirectPath = "/recipes/browse" }) => {
  const { login, loginError, authLoading } = useAuth();

  const loginAction = createAction(LoginSchema, async (formData) => {
    try {
      const { email, password } = formData;
      const success = await login({ email, password }, redirectPath);

      if (!success) {
        return {
          success: false,
          message: loginError || "Invalid credentials",
        };
      }

      return {
        success: true,
        message: "Login successful!",
      };
    } catch (error) {
      if (error instanceof Error)
        return {
          success: false,
          message: `An unexpected error occurred: ${error.message}`,
        };
      else {
        return {
          success: false,
          message: `An unexpected error occurred: ${String(error)}`,
        };
      }
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
        <FormHeader title="Login" description="Welcome back" />
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
