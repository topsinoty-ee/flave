import { Footer, Navbar } from "@/components";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="main mt-25 min-h-screen bg-white">
      <div>{children}</div>
    </main>
  );
}
