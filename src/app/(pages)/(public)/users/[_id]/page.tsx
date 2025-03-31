import { API } from "@/api/main";
import { knewave } from "@/app/layout";
import { Image } from "@/components";
import { User } from "@/types";
import clsx from "clsx";
import { RecipeDisplayBlock } from "./_components";

export default async function UserPage({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const { _id } = await params;
  const user = await API.get<User>(`/users/${_id}`);
  return (
    <>
      <section className="w-full bg-cover flex justify-end -mt-25 p-20 pt-45 gap-20 h-screen aspect-section-lg  bg-yellow user-hero-bg">
        <div className="w-full">
          <h1
            className={clsx("text-9xl", knewave.className)}
            title={"@" + user.username}
          >
            {`${user.firstName} ${user.lastName}`}
          </h1>
          <div className="border-black border-t-4 max-w-20 py-5" />
          <p
            className={clsx("text-lg", {
              "text-base": user.description && user.description?.length > 40,
            })}
          >
            {user.description ?? "No description available"}
          </p>
        </div>
        <div className="golden-circle bg-white self-center flex h-full max-h-[28.125rem] aspect-square place-content-center relative overflow-clip">
          <Image
            src={
              typeof user.avatar === "object" ? user.avatar.url : user.avatar
            }
            fallbackSrc="/images/user-fallback.png"
            width={450}
            height={450}
            fill
            alt={user.username ?? `${user.firstName} ${user.lastName}`}
          />
        </div>
      </section>
      <RecipeDisplayBlock recipes={user.recipes} />
    </>
  );
}
