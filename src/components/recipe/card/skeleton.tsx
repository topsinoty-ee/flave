export const RecipeCardSkeleton = () => (
  <div className="relative w-full overflow-hidden transition-all rounded-md shadow-md cursor-pointer min-w-72 max-w-80 bg-background group hover:shadow-lg flex flex-col gap-2.5">
    <div className="w-full aspect-section-lg rounded-lg bg-gray" />
    <div className="w-full h-5 rounded-lg bg-gray" />
    <div className="w-full h-1 rounded-lg bg-gray" />
  </div>
);
