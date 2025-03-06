export default async function RecipePage({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const { _id } = await params;
  return (
    <div>
      <h1>Recipe: {_id}</h1>
    </div>
  );
}
