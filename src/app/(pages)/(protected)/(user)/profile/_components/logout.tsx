"use client";

import { Button } from "@/components";
import { logout } from "@/context/auth/actions";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();
  function handleLogout() {
    const wantsToLogout = confirm(
      "This will clear your sessions and logout you out. Dou you confirm?",
    );
    if (wantsToLogout) logout();
    router.push("/");
  }

  return (
    <Button variant="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
};
