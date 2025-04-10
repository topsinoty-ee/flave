import { DisplayResource } from "@/components";
import { CustomerReviewCard } from "@/components/customer-review";

export const ReviewsList = () => (
  <DisplayResource
    Component={CustomerReviewCard}
    className="pb-40"
    data={[
      {
        content:
          "I love how easy it is to find something to cook with just the ingredients I already have. It's helped me save money and reduce food waste—two things I've always struggled with.",
        src: "/TESTIMONIAL-Liis-kasemagi.jpg",
        name: "Liis Kasemägi",
      },
      {
        content:
          "Honestly, I didn't expect to like it this much. The design is fun, the site is fast, and uploading my own recipes was surprisingly simple. I've already shared it with my whole family.",
        src: "/TESTIMONIAL-Kirill-andrejev.jpg",
        name: "Kirill Andrejev",
      },
      {
        content:
          "I used to have five different tabs open just to find one decent recipe. Now I just type in what I have, and Flave does the rest. Super helpful during busy weeks.",
        src: "/TESTIMONIAL-Anneli-saarniit.jpg",
        name: " Anneli Saarniit",
      },
      {
        content:
          "I'm not someone who usually leaves reviews… but Flave really impressed me. The ingredient search actually works, and I've started using up food I would've otherwise thrown out. It just makes cooking less of a chore.",
        src: "/TESTIMONIAL-Emily-shaw.jpg",
        name: "Emily Shaw",
      },
    ]}
    title="Customer reviews"
  />
);
