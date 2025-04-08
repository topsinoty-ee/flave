import { User } from "@/types";
import { Recipe } from "@/types/recipe";

export const mockdata: {
  status: string;
  data: {
    user: Partial<User>;
    recipes: Partial<Recipe>[];
  };
} = {
  status: "success",
  data: {
    user: {
      _id: "67df8caa9f446116169c6f2e",
      firstName: "Imogen",
      lastName: "Moon",
      username: "imogenuser",
      email: "imogenmoon1@gmail.com",
      role: "User",
      src: {
        url: "https://res.cloudinary.com/dg3pjcyms/image/upload/v1743513656/zg7nxugkgjgeyyj1hp4y.jpg",
      },
      favouritedRecipes: [
        "67b1ae9c2b5f762bb3736b57",
        "67b0c2482e7f110d0616cc89",
      ],
      savedDrafts: [],
    },
    recipes: [
      {
        _id: "67ebc4c00ead31fa26151823",
        title: "user assign test",
        description:
          "A classic Italian pasta dish with rich, meaty tomato sauce.",
        portions: 4,
        cookingDuration: 45,
        cookingMethod: ["Oven"],
        ingredients: [
          { value: "Shrimp", quantity: 400, _id: "67ebc4c00ead31fa26151824" },
        ],
        instructions: [
          "Boil water in a large pot and cook spaghetti until al dente.",
          "Heat olive oil in a pan and sauté onions, garlic, carrot, and celery until soft.",
          "Add ground beef to the pan and cook until browned.",
          "Stir in tomato paste, canned tomatoes, and red wine. Cook for 5 minutes.",
          "Add beef broth, salt, pepper, oregano, and simmer for 25 minutes.",
          "Once pasta is ready, drain and combine with the sauce.",
          "Serve with fresh basil and grated Parmesan cheese on top.",
        ],
        tags: [{ _id: "67bb5ffeacd49db74d48e387", value: "Shrimp" }],
        user: {
          _id: "679dc7c28e196cad620bbb45",
          firstName: "Imogen",
          lastName: "Moon",
          src: {
            url: "https://res.cloudinary.com/dg3pjcyms/image/upload/v1743513656/zg7nxugkgjgeyyj1hp4y.jpg",
          },
        },
        ratingsAmount: 0,
        draft: false,
        reviews: [],
      },
    ],
  },
};
