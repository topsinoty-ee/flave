import { Footer, Navbar } from "@/components";
import { AuthGuard } from "@/context/auth";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="body min-h-screen mt-10 bg-foreground">
      <AuthGuard redirectUrl="/login" requireRoles={["User"]}>
        {children}
      </AuthGuard>
    </div>
  );
}
