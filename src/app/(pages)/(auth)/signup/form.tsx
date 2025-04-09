"use client";

import { ApiError } from "@/api/error";
import { SectionHeader } from "@/components";
import { useAuth } from "@/context/auth";
import { FormProvider, Input, Submit } from "@/context/form";
import { createAction } from "@/context/form/fn";
import { Mail, Lock } from "lucide-react";
import { Suspense } from "react";
import z from "zod";

const SignupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export function ClientSignupForm({ redirectPath }: { redirectPath: string }) {
  const { signup, isLoading } = useAuth();

  const signupAction = createAction(SignupSchema, async (_, formData) => {
    try {
      await signup(formData, redirectPath);
      return {
        success: true,
        message: "Login successful!",
      };
    } catch (error) {
      if (ApiError.isApiError(error)) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: `${error}`,
      };
    }
  });

  return (
    <FormProvider
      schema={SignupSchema}
      action={signupAction}
      className="w-max min-w-[50%] flex flex-col gap-5 p-5 bg-white shadow-lg rounded-2xl"
    >
      <SectionHeader title="Signup" description="Create an account" />
      <div className="flex flex-col gap-5">
        <Input
          name="username"
          type="text"
          placeholder="Enter your username"
          icon={Mail}
          aria-required="true"
        />
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          aria-required="true"
        />
        <Input
          name="password"
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          aria-required="true"
        />
      </div>
      <div className="flex gap-5 items-center">
        <Submit
          isLoading={isLoading}
          loadingText="Signing you up..."
          className="bg-black text-white"
        >
          Signup
        </Submit>
        <a
          href="/signup"
          className="w-max whitespace-nowrap bg-gray-light text-gray-dark hover:bg-gray hover:text-black transition-colors duration-200 ease-in-out px-4 py-2 rounded-md"
        >
          Login
        </a>
      </div>
    </FormProvider>
  );
}

function FormSkeleton() {
  return (
    <div className="w-max min-w-[50%] flex flex-col gap-5 p-5 bg-white shadow-md rounded-2xl space-y-4"></div>
  );
}

export function ClientSignupWrapper({
  redirectPath,
}: {
  redirectPath: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<FormSkeleton />}>
        <ClientSignupForm redirectPath={redirectPath} />
      </Suspense>
    </div>
  );
}
