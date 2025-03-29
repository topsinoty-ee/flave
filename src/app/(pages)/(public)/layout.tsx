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
          { href: "/recipes/browse", label: "Browse" },
          { href: "/recipes", label: "All Recipes" },
          { href: "/recipes/create", label: "Create recipe" },
        ]}
        actions={[
          { href: "/signup", children: "Sign up", variant: "primary" },
          { href: "/login", children: "Login", variant: "secondary" },
        ]}
      />
      <main className="main mt-25">
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
