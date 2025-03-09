import { Footer } from "@/components";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="body bg-foreground">
      <main className="main">
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
