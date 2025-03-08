import { Footer, Navbar } from "@/components";

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
        <div>{children}</div>
      </main>
      {Footer}
    </div>
  );
}
