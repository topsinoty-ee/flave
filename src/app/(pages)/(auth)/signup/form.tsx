"use client";

import { Lock, Mail, User } from "lucide-react";
import { Suspense } from "react";
import { z } from "zod";

import { useAuth } from "@/context";
import { createAction, FormProvider } from "@/context/form";
import { FormHeader, FormInput, SubmitButton } from "@/context/form/components";
import Link from "next/link";

const SignupSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name must be a string",
    })
    .min(1, "First name cannot be empty")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[A-Za-z]+$/, "First name can only contain letters"),

  lastName: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name must be a string",
    })
    .min(1, "Last name cannot be empty")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[A-Za-z]+$/, "Last name can only contain letters"),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .refine(
      async (email) => {
        const isEmailTaken = await checkIfEmailExists(email);
        return !isEmailTaken;
      },
      {
        message: "Email is already registered",
      },
    ),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password cannot exceed 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .refine(
      (password) => !password.includes(" "),
      "Password cannot contain spaces",
    ),
});

async function checkIfEmailExists(email: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(email === "existing@example.com");
    }, 1000);
  });
}

export const SignupForm = ({ redirectPath = "/recipes/browse" }) => {
  const { signup, signupError, authLoading } = useAuth();

  const signupAction = createAction(SignupSchema, async (formData) => {
    try {
      const { firstName, lastName, email, password } = formData;
      const success = await signup(
        { firstName, lastName, email, password },
        redirectPath,
      );

      if (!success) {
        return {
          success: false,
          message: signupError || "Something went wrong",
        };
      }

      return {
        success: true,
        message: "Signup successful!",
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
      schema={SignupSchema}
      action={signupAction}
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
        <FormHeader title="Signup" description="Welcome back" />
        <div className="flex flex-col gap-5">
          <FormInput
            name="firstName"
            type="text"
            placeholder="John"
            icon={User}
            aria-required="true"
          />
          <FormInput
            name="lastName"
            type="text"
            placeholder="Doe"
            icon={User}
            aria-required="true"
          />
          <FormInput
            name="email"
            type="email"
            placeholder="john@doe.com"
            icon={Mail}
            aria-required="true"
          />
          <FormInput
            name="password"
            type="password"
            placeholder="*********"
            icon={Lock}
            aria-required="true"
          />
        </div>
        <div className="flex gap-5 items-center">
          <SubmitButton
            loading={authLoading.signup}
            className="bg-black text-white w-full py-2.5 rounded-md transition-colors"
          >
            Signup
          </SubmitButton>
          <Link href="/login">Login instead</Link>
        </div>
      </Suspense>
    </FormProvider>
  );
};
