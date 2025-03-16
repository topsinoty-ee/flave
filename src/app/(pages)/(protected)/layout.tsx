import { Footer, Navbar } from "@/components";
import { ProtectedRoute } from "@/context/auth/components/protected-route";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="body bg-foreground">
      <Navbar
        links={[
          { href: "/", label: "Browse" },
          { href: "/about", label: "All Recipes" },
        ]}
      />
      <main className="main">
        <div>
          <ProtectedRoute>{children}</ProtectedRoute>
        </div>
      </main>
      <Footer />
    </div>
  );
}
