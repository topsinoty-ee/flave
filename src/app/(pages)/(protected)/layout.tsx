export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen h-full bg-amber-100 text-black">
      {children}
    </div>
  );
}
