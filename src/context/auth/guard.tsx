"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hook";
import { User } from "@/types";

type AuthGuardProps = {
  children: React.ReactNode;
  redirectUrl?: string;
  requireRoles?: User["role"][];
  GuardComponent?: React.ComponentType<{
    children: React.ReactNode;
    className?: string;
  }>;
  className?: string;
};

export const AuthGuard = ({
  children,
  redirectUrl = "/login",
  requireRoles = [],
  GuardComponent,
  className,
}: AuthGuardProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const hasRequiredRole =
      requireRoles.length === 0 ||
      (user?.role && requireRoles.some((role) => user.role.includes(role)));

    if (!isAuthenticated || !hasRequiredRole) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, user, requireRoles, redirectUrl, router]);

  if (isLoading || !isAuthenticated) {
    return GuardComponent ? (
      <GuardComponent className={className}>
        <div>Loading auth check...</div>
      </GuardComponent>
    ) : (
      <div>Loading auth check...</div>
    );
  }

  const hasRequiredRole =
    requireRoles.length === 0 ||
    (user?.role && requireRoles.some((role) => user.role.includes(role)));

  if (!hasRequiredRole) {
    return GuardComponent ? (
      <GuardComponent className={className}>
        <div>Unauthorized</div>
      </GuardComponent>
    ) : (
      <div>Unauthorized</div>
    );
  }

  return <>{children}</>;
};
