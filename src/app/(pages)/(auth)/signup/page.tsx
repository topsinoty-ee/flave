import { Suspense } from "react";

import { SignupForm } from "./form";

function FormSkeleton() {
  return (
    <div className="w-max min-w-[50%] flex flex-col gap-5 p-5 bg-white shadow-md rounded-lg space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    continue: string | `/${string}`;
  }>;
}) {
  const params = await searchParams;
  const redirectPath =
    typeof params.continue === "string" && params.continue != ""
      ? params.continue
      : "profile";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<FormSkeleton />}>
        <SignupForm redirectPath={redirectPath} />
      </Suspense>
    </div>
  );
}
