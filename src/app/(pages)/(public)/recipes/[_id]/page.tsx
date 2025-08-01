import { API } from "@/api";
import { Recipe } from "@/types/recipe";
import { Suspense } from "react";
import { ClientSide } from "./_components";
import { Metadata, ResolvingMetadata } from "next";
import {
  Button,
  RecipeDisplayBlock,
  Image,
  Tag,
  DisplayResource,
} from "@/components";
import clsx from "clsx";
import Link from "next/link";
import { Clock, Ham, Loader2 } from "lucide-react";
import { Creator } from "./_components/creator";

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ _id: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { _id } = await params;

  const recipe = await API.get<Recipe>("/recipes/" + _id);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: recipe.title,
    openGraph: {
      images: ["/logo.svg", ...previousImages],
    },
  };
}

const getDurationBucket = (duration: number): [number, number] => {
  let start: number;
  let end: number;

  if (duration <= 10) {
    start = Math.max(1, duration - 2);
    end = Math.ceil(duration / 5) * 5;
  } else if (duration <= 20) {
    start = duration - 5;
    end = Math.ceil(duration / 5) * 5;
  } else if (duration <= 45) {
    start = Math.floor(duration / 5) * 5;
    end = start + 5;
  } else if (duration <= 60) {
    start = duration - 10;
    end = Math.ceil(duration / 10) * 10;
  } else {
    start = Math.max(1, Math.floor((duration - 10) / 10) * 10);
    end = Math.ceil((duration + 10) / 10) * 10;
  }

  return [start, end];
};

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader2 className="animate-spin w-full h-full" />
    </div>
  );
}

const RecipeContent = async ({ _id }: { _id: string }) => {
  const recipe = await API.get<Recipe>("recipes/" + _id);
  const [start, end] = getDurationBucket(recipe.cookingDuration);

  const cookingDuration = `${start}-${end} mins`;
  return (
    <>
      <section className="flex gap-10 w-full aspect-section-lg p-20 -mt-10 recipe-details-man-decal-bg">
        <div className="flex-1 bg-gray/10 relative rounded-2xl hover:bg-gray-dark/10 delay-750 ease-in duration-500 transition-all">
          <Image
            src={typeof recipe.src === "object" ? recipe.src.url : recipe.src}
            alt={recipe.alt || recipe.title}
            fill
            className="w-full h-full flex justify-center items-center image-flex rounded-2xl"
            priority
            quality={100}
          />
        </div>

        <article className="flex-1 flex flex-col gap-5 rounded-2xl bg-secondary">
          <div className="flex flex-col gap-5">
            <h2>{recipe.title}</h2>
            <div className="flex flex-col w-full gap-5">
              <div className="flex flex-wrap gap-2.5">
                {recipe.tags.map(({ _id, value }) => (
                  <Link
                    key={_id}
                    href={`/recipes?tags=${value.toLowerCase()}`}
                    className="no-underline"
                  >
                    <Tag>{value}</Tag>
                  </Link>
                ))}
              </div>
              <Link
                href={`/users/${recipe.user._id}`}
                className={clsx("py-5 rounded-2xl flex w-full h-25 gap-5")}
              >
                <div className="w-15 aspect-square">
                  <Image
                    src={
                      typeof recipe.user.src === "object"
                        ? recipe.user.src.url
                        : recipe.user.src
                    }
                    alt={recipe.user.firstName}
                    fallbackSrc="/images/user-fallback.png"
                    fill
                    className="golden-circle w-15 bg-background"
                  />
                </div>

                <div className="w-full h-full flex justify-between">
                  <div className="w-full flex justify-between min-w-0">
                    <div className="flex flex-col justify-center items-start gap-1 min-w-0 overflow-hidden">
                      <h4 className="text-black truncate w-full">
                        {recipe.user.firstName && recipe.user.lastName
                          ? `${recipe.user.firstName} ${recipe.user.lastName}`.trim()
                          : `@${recipe.user.username}`}
                      </h4>

                      {recipe.user.firstName &&
                        recipe.user.lastName &&
                        recipe.user.username && (
                          <small className="text-gray-dark truncate w-full">
                            @{recipe.user.username}
                          </small>
                        )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <p className="font-medium text-gray-dark line-clamp-10 h-max min-h-10">
            {recipe.description}
          </p>
          <div className="flex flex-col gap-5">
            <div className="w-full flex gap-5 h-10 *:justify-center *:items-center">
              {[
                {
                  label: cookingDuration,
                  icon: <Clock className="stroke-2" />,
                  title: null,
                },
                {
                  label: `${recipe.portions} portions`,
                  icon: <Ham className="stroke-2" />,
                  title: null,
                },
                ...recipe.cookingMethod.map((method) => ({
                  label: method,
                  icon: null,
                  title: `Cooking method: ${method}`,
                })),
              ].map(({ label, icon, title }, idx, array) => (
                <div className="flex items-center gap-5" key={idx}>
                  <div
                    className={clsx(`flex gap-2.5 font-semibold items-center`)}
                  >
                    {icon && icon}
                    <span title={title ? title : undefined}>{label}</span>
                  </div>
                  {idx === array.length - 1 ? null : (
                    <span className="w-2 aspect-square bg-black rounded-full self-center" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-5 w-full justify-start items-center">
              <Button className="h-full"> See Reviews</Button>
            </div>
          </div>
        </article>
      </section>
      <section className="flex gap-10 px-20">
        <div className="flex flex-col bg-gray-light gap-5 w-[70%] rounded-2xl backdrop-blur-xs h-max p-10 min-h-80">
          <h3 className="text-3xl font-semibold uppercase">Ingredients</h3>
          <ul className="list-none gap-1 flex flex-col">
            {recipe.ingredients.map(
              ({ value, quantity, unitsOfMeasurement }, idx) => (
                <li
                  key={idx}
                >{`${value} - ${quantity}${unitsOfMeasurement}`}</li>
              )
            )}
          </ul>
        </div>

        <div className="w-full rounded-2xl shadow-lg p-10 min-h-96 h-max flex flex-col gap-5">
          <h3 className="text-3xl font-semibold uppercase">
            Instructions ({recipe.instructions.length})
          </h3>
          <ol className="flex flex-col gap-4 pl-0">
            {recipe.instructions.map((instruction, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <div className="flex-shrink-0 flex items-center justify-center aspect-square w-5 h-5 rounded-full bg-black text-white text-sm font-medium">
                  {idx + 1}
                </div>

                <p className="flex-1 leading-relaxed">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DisplayResource Component={Creator} data={recipe.user} />
      <RecipeDisplayBlock
        title={"view similar"}
        description={"View recipes with the same ingredients"}
        params={[
          ...recipe.ingredients.map((ingredient) => ingredient.value),
          ...recipe.tags.map((tag) => tag.value),
        ]}
        exclude={[recipe._id]}
      />
      {/* <section className="w-full flex flex-col gap-10 px-20">
        <SectionHeader
          icon={<MessageSquare size={32} className="stroke-3" />}
          title="Leave a review"
        />
        {/* <div>
          <DisplayResource Component={Review} data={recipe.reviews} />
        </div>*/}
    </>
  );
};

export default async function RecipePage({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const { _id } = await params;
  return (
    <ClientSide>
      <Suspense fallback={<LoadingFallback />}>
        <RecipeContent _id={_id} />
      </Suspense>
    </ClientSide>
  );
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const recipes = await API.get<Recipe[]>("/recipes");
    console.log(
      recipes.map((recipe) => ({
        _id: String(recipe._id),
      }))
    );
    return recipes.map((recipe) => ({
      _id: String(recipe._id),
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}
