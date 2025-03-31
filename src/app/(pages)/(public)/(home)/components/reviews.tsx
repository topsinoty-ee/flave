import { DisplayResource } from "@/components";
import { CustomerReviewCard } from "@/components/customer-review";

export const ReviewsList = () => (
  <DisplayResource
    Component={CustomerReviewCard}
    data={[
      {
        content:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Luctus aliquam elit natoque risus et finibus tristique. Rutrum curae habitant tincidunt mus maximus sollicitudin. ",
        avatar: "https://placehold.co/",
        username: "JohnDoe",
      },
      {
        content:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Luctus aliquam elit natoque risus et finibus tristique. Rutrum curae habitant tincidunt mus maximus sollicitudin. ",
        avatar: "https://placehold.co/",
        username: "JohnRoe",
      },
      {
        content:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Luctus aliquam elit natoque risus et finibus tristique. Rutrum curae habitant tincidunt mus maximus sollicitudin. ",
        avatar: "https://placehold.co/",
        username: "JohnBoe",
      },
      {
        content:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Luctus aliquam elit natoque risus et finibus tristique. Rutrum curae habitant tincidunt mus maximus sollicitudin. ",
        avatar: "https://placehold.co/",
        username: "JohnToe",
      },
    ]}
    title="Customer reviews"
  />
);
