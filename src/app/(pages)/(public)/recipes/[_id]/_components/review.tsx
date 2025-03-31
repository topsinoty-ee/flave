import { Review as ReviewType } from "@/types/review";

export const Review: React.FC<ReviewType> = (review) => {
  return <pre>{JSON.stringify(review)}</pre>;
};
