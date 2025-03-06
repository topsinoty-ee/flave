export default async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <h1>Search</h1>
      {searchParams && (
        <div>
          <h2>Search Params</h2>
          <pre>{JSON.stringify(searchParams, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
