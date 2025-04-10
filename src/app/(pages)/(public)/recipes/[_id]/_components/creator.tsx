import { Button, Image } from "@/components";
import { User } from "@/types";
import { ArrowRight } from "lucide-react";

export const Creator: React.FC<Partial<User>> = ({
  src,
  firstName,
  lastName,
  description = "No bio provided",
  _id,
}) => {
  return (
    <section className="flex w-full bg-black outline-yellow outline-1 aspect-section-md rounded-2xl gap-15 p-20">
      <Image
        src={typeof src === "object" ? src.url : src}
        fallbackSrc="/images/user-fallback.png"
        alt={`${firstName} ${lastName}`}
        className="h-max max-h-[40vh] max-w-[30%] golden-circle bg-gray-dark aspect-square"
      />

      <div className="w-full flex flex-col justify-between">
        <article className="w-full flex flex-col gap-5">
          <h3>
            About {firstName} {lastName}
          </h3>
          <p className="text-gray">{description}</p>
        </article>

        <div className="w-max flex gap-10">
          <Button
            as="link"
            href={`/users/${_id}`}
            icon={<ArrowRight className="order-1 stroke-black" />}
            className="bg-white outline-0 text-black"
          >
            View profile
          </Button>
        </div>
      </div>
    </section>
  );
};
