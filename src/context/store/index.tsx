"use client";

import { AuthProvider } from "../auth";

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};
