"use client";

import { AuthProvider } from "../auth/context";

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};
