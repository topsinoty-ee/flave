import { API } from "@/api/main";
import { Recipe } from "@/types/recipe";
import { Suspense } from "react";
import { ClientSide, Review } from "./_components";
import { Metadata, ResolvingMetadata } from "next";
import {
  Button,
  RecipeDisplayBlock,
  SectionHeader,
  Image,
  Tag,
  DisplayResource,
} from "@/components";
import clsx from "clsx";
import Link from "next/link";
import { Clock, Ham, Heart, Loader2, MessageSquare } from "lucide-react";
import { Creator } from "./_components/creator";

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ _id: string }>;
  },
  parent: ResolvingMetadata,
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
  console.log(recipe);
  const [start, end] = getDurationBucket(recipe.cookingDuration);

  const cookingDuration = `${start}-${end} mins`;

  return (
    <>
      <section className="flex gap-10 w-full aspect-section px-20">
        <div className="flex-1 bg-gray bg-blend-multiply rounded-lg hover:bg-gray-dark delay-750 ease-in duration-500 transition-all">
          <Image
            src={recipe.src}
            alt={recipe.alt || recipe.title}
            width={400}
            height={500}
            className="w-full h-full flex justify-center items-center image-flex"
            priority
          />
        </div>

        <article className="flex-1 flex flex-col gap-5 rounded-lg bg-secondary">
          <div className="flex flex-col gap-5">
            <h2>{recipe.title}</h2>
            <div className="flex flex-col w-full gap-5">
              <div className="flex flex-wrap gap-2.5">
                {recipe.tags.map(({ _id, value }) => (
                  <Link
                    key={_id}
                    href={`/search?tags=${value.toLowerCase()}`}
                    className="no-underline"
                  >
                    <Tag>{value}</Tag>
                  </Link>
                ))}
              </div>
              <Link
                href={`/users/${recipe.user._id}`}
                className={clsx(
                  "bg-black p-5 rounded-lg flex w-full h-25 gap-5",
                )}
              >
                <div className="w-15 aspect-square">
                  <Image
                    src={recipe.user.avatar}
                    alt={recipe.user.firstName}
                    fallbackSrc="/images/user-fallback.png"
                    fill
                    className="golden-circle w-15 bg-background"
                  />
                </div>

                <div className="w-full h-full bg- flex justify-between">
                  <div className="w-full flex justify-between">
                    <div className="flex flex-col justify-center gap-5">
                      <h5>
                        {recipe.user.firstName} {recipe.user.lastName}
                      </h5>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <p className="font-medium text-gray-dark flex-grow line-clamp-10 h-max min-h-10">
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
              <Button icon={<Heart />} className="bg-black text-white h-full">
                Favorite
              </Button>
              <Button className="h-full"> See Reviews</Button>
            </div>
          </div>
        </article>
      </section>
      <section className="flex gap-10 px-20">
        <div className="flex flex-col bg-gray-light gap-5 w-[70%] rounded-lg backdrop-blur-xs h-max p-10 min-h-80">
          <h3 className="text-3xl font-semibold uppercase">Ingredients</h3>
          <ul className="list-none gap-1 flex flex-col">
            {recipe.ingredients.map(({ value, quantity }, idx) => (
              <li key={idx}>{`${value} - ${quantity}`}</li>
            ))}
          </ul>
        </div>

        <div className="w-full rounded-lg shadow-lg p-10 min-h-96 h-max flex flex-col gap-5">
          <h3 className="text-3xl font-semibold uppercase">
            Instructions ({recipe.instructions.length})
          </h3>
          <ol className="list-none flex flex-col gap-2.5">
            {recipe.instructions.map((instruction, idx) => (
              <li key={idx} className="flex gap-2.5">
                <span className="w-5 text-white text-sm flex justify-center items-center aspect-square rounded-full bg-black">
                  {idx + 1}
                </span>
                {instruction}
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
      <section className="w-full flex flex-col gap-10 px-20">
        <SectionHeader
          icon={<MessageSquare size={32} className="stroke-3" />}
          title="Leave a review"
        />
        <div>
          <DisplayResource Component={Review} data={recipe.reviews} />
        </div>
      </section>
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
      })),
    );
    return recipes.map((recipe) => ({
      _id: String(recipe._id),
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}
