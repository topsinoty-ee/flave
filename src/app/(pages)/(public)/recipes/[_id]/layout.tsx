export default function RecipePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex gap-10 flex-col">{children}</div>;
}
