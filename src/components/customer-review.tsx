import { Image } from "./image";

type CustomerReviewCardProps = {
  content: string;
  name: string;
  src: string;
};

export const CustomerReviewCard: React.FC<CustomerReviewCardProps> = ({
  name,
  src,
  content,
}) => (
  <div className="w-full rounded-lg shadow bg-white flex flex-col p-5 gap-5">
    <Image
      alt={name || "user"}
      fallbackSrc="/images/user-fallback.png"
      src={src}
      width={100}
      height={100}
      className="rounded-full golden-circle w-max"
    />
    <div className="flex flex-col gap-2.5 ">
      <h5 className="flex items-baseline">{`${name}`}</h5>
      <p>{content}</p>
    </div>
  </div>
);
