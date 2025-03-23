import { Footer, Navbar } from "@/components";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="body">
      <Navbar
        links={[
          { href: "/", label: "Browse" },
          { href: "/about", label: "All Recipes" },
        ]}
        actions={[
          { href: "/signup", children: "Sign up", variant: "primary" },
          { href: "/login", children: "Login", variant: "secondary" },
        ]}
      />
      <main className="main">
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
