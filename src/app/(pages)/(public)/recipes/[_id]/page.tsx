// // import clsx from "clsx";
// // import {
// //   ArrowRight,
// //   ChevronRight,
// //   Clock,
// //   Ham,
// //   Heart,
// //   MessageSquare,
// // } from "lucide-react";
// import { Metadata, ResolvingMetadata } from "next";
// // import { Clock, Microwave } from "lucide-react";
// import Link from "next/link";
// // import { Suspense } from "react";

import { API } from "@/api/main";
import { Recipe } from "@/types/recipe";
import { Suspense } from "react";
import { ClientSide } from "./client";
import { Metadata, ResolvingMetadata } from "next";
import {
  Button,
  RecipeDisplayBlock,
  SectionHeader,
  Image,
  Tag,
} from "@/components";
import clsx from "clsx";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Ham,
  Heart,
  ArrowRight,
  MessageSquare,
  Microwave,
} from "lucide-react";

// import {
//   Button,
//   Image,
//   RecipeDisplayBlock,
//   SectionHeader,
//   Tag,
// } from "@/components";
// import { Recipe } from "@/types/recipe";
// import { fetchRecipes, isRecipe } from "@/util";

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
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
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
      <section className="flex gap-10 w-full aspect-section-md px-20">
        <div className="flex-1">
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
                  "bg-black p-5 rounded-lg flex w-full h-25 gap-5"
                  // "hover:bg-gray transition-all"
                )}
              >
                <div className="w-15 aspect-square">
                  <Image
                    src={recipe.user.avatar}
                    alt={recipe.user.firstName}
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
                  <Button
                    icon={
                      <ChevronRight
                        size={32}
                        className="stroke-black font-bold outline-black"
                      />
                    }
                    className="bg-foreground"
                  />
                </div>
              </Link>
            </div>
          </div>
          <p className="font-medium text-gray flex-grow line-clamp-10 h-max min-h-60">
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
              <Button icon={<Heart />} className="bg-black text-white">
                Favorite
              </Button>
              <Button> See Reviews</Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Tag icon={<Clock size={16} />}>
              {`${recipe.cookingDuration} mins`}
            </Tag>

            {recipe.cookingMethod.map((method, idx) => (
              <Tag
                icon={<Microwave size={16} />}
                key={idx}
                title={`Cooking method: ${method}`}
              >
                {method}
              </Tag>
            ))}
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
      <section className="flex w-full bg-black outline-yellow outline-1 aspect-section-md gap-15 p-20">
        <div className="w-[30%] min-w-48 aspect-square">
          <Image
            src={recipe.user.avatar}
            alt={`${recipe.user.firstName} ${recipe.user.lastName}`}
            fill
            className="golden-circle w-full bg-gray-dark"
          />
        </div>
        <div className="w-full flex flex-col justify-between">
          <article className="w-full flex flex-col gap-5">
            <h3>
              About {recipe.user.firstName} {recipe.user.lastName}
            </h3>
            <p className="text-gray">It&apos;s all over 🥺 </p>
          </article>
          <div className="w-max flex gap-5">
            <Button
              as="link"
              href={`/users/${recipe.user._id}`}
              icon={<ArrowRight className="order-1 stroke-black" />}
              className="bg-foreground outline-0 text-black"
            >
              See more
            </Button>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-15">
        {/* Top Row: Image + Info */}

        {/* Bottom Row: Ingredients + Instructions */}

        <RecipeDisplayBlock
          title={"view similar"}
          description={"View recipes with the same ingredients"}
          params={[
            ...recipe.ingredients.map((ingredient) => ingredient.value),
            ...recipe.tags.map((tag) => tag.value),
          ]}
          exclude={[recipe._id]}
        />
        <div className="w-full flex flex-col gap-5">
          <SectionHeader
            icon={<MessageSquare size={32} className="stroke-3" />}
            title="Leave a review"
          />
          <div>
            <form></form>
          </div>
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
      </Suspense>{" "}
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
