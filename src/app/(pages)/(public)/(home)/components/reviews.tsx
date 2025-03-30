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
        userName: "JohnDoe",
      },
      {
        content:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Luctus aliquam elit natoque risus et finibus tristique. Rutrum curae habitant tincidunt mus maximus sollicitudin. ",
        avatar: "https://placehold.co/",
        userName: "JohnDoe",
      },
      {
        content:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Luctus aliquam elit natoque risus et finibus tristique. Rutrum curae habitant tincidunt mus maximus sollicitudin. ",
        avatar: "https://placehold.co/",
        userName: "JohnDoe",
      },
      {
        content:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Luctus aliquam elit natoque risus et finibus tristique. Rutrum curae habitant tincidunt mus maximus sollicitudin. ",
        avatar: "https://placehold.co/",
        userName: "JohnDoe",
      },
    ]}
    title="Customer reviews"
  />
);
