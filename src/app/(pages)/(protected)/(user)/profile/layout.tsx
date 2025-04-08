export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="p-20 flex flex-col gap-10">{children}</div>;
}
