interface ReviewsListProps {
  userid: string;
  reviews: Array<string>;
}

export const ReviewsList = ({ userid, reviews }: ReviewsListProps) => {
  if (reviews.length === 0) {
    return (
      <div
        className="w-full h-full flex flex-col gap-2.5 items-center justify-center"
        aria-label="No reviews section"
      >
        <span aria-hidden="true">¯\_(ツ)_/¯</span>
        <h4 className="text-lg font-medium">No reviews yet</h4>
      </div>
    );
  }

  return (
    <section className="w-full h-full" aria-labelledby="reviews-heading">
      <h6
        id="reviews-heading"
        className="text-sm font-medium mb-4 text-gray-600 dark:text-gray-400"
      >
        User ID: <span className="font-mono">{userid}</span>
      </h6>
      <ul className="w-full h-full flex flex-col gap-2.5 list-none p-0 m-0">
        {reviews.map((review, index) => (
          <li
            key={`review-${index}-${userid}`}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <p className="text-gray-800 dark:text-gray-200">{review}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
