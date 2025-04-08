import { Footer } from "@/components";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen body bg-foreground">
      <div>{children}</div>
    </div>
  );
}
