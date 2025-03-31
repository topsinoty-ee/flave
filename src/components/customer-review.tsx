import { User } from "@/types";
import { Image } from "./image";

type CustomerReviewCardProps = {
  content: string;
} & Pick<User, "avatar" | "username">;

export const CustomerReviewCard: React.FC<CustomerReviewCardProps> = ({
  username,
  avatar,
  content,
}) => (
  <div className="w-full rounded-lg shadow bg-white flex flex-col p-5 gap-5">
    <Image
      alt={username || "user"}
      fallbackSrc="/images/user-fallback.png"
      src={typeof avatar === "object" ? avatar.url : avatar}
      width={100}
      height={100}
      className="rounded-full golden-circle w-max"
    />
    <div className="flex flex-col gap-2.5 ">
      <h4 className="flex items-baseline lowercase">{`@${username}`}</h4>
      <p>{content}</p>
    </div>
  </div>
);
