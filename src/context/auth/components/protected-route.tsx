// ProtectedRoute component
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "../hook";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const continueParam = encodeURIComponent(pathname);
      router.push(`/login?continue=${continueParam}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <>{children}</> : null;
};
