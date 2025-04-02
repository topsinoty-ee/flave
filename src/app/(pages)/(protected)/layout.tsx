import { Footer, Navbar } from "@/components";
import { AuthGuard } from "@/context";

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
          <AuthGuard redirectUrl="/login" requireRoles={["User"]}>
            {children}
          </AuthGuard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
