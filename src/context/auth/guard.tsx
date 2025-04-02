"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hook";
import { User } from "@/types";

type AuthGuardProps = {
  children: React.ReactNode;
  redirectUrl?: string;
  requireRoles?: User["role"][];
};

export const AuthGuard = ({
  children,
  redirectUrl = "/login",
  requireRoles = [],
}: AuthGuardProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const hasRequiredRole = requireRoles.every((role) =>
      user?.role?.includes(role)
    );

    if (!isAuthenticated || !hasRequiredRole) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, user, requireRoles, redirectUrl]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading auth check...</div>;
  }

  return <>{children}</>;
};
