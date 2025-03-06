export default async function UserPage({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const { _id } = await params;
  return (
    <div>
      <h1>User id: {_id}</h1>
    </div>
  );
}
