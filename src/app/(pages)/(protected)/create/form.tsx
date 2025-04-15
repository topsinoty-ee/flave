"use client";

import { API } from "@/api";
import {
  createAction,
  DynamicFields,
  FileUpload,
  FormProvider,
  Input,
  Textarea,
  TagInput,
  Submit,
  Dropdown,
} from "@/context/form";
import { ingredientParser, instructionParser } from "@/context/form/fn";
import { z } from "zod";
import { ApiError } from "@/api/error";
import { createRecipe } from "./server";

const err = (message: string) => `${message}. Please check and try again.`;

const ingredientSchema = z.object({
  value: z
    .string()
    .min(1, err("Give this ingredient a name (e.g., 'Garlic' or 'Olive Oil')")),
  quantity: z.coerce
    .number()
    .positive(err("Quantity must be positive (e.g., 2, not 0 or -1)"))
    .refine(
      (val) => val < 1000,
      err("Whoa! That's too much. Use a smaller quantity")
    ),
  unitsOfMeasurement: z
    .string()
    .min(1, err("Add units (e.g., 'cups', 'grams', or 'tablespoons')")),
});

export const recipeSchema = z.object({
  src: z
    .instanceof(File)
    .refine((file) => file.size > 0, err("Please select an image to upload"))
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
      err("Image must be smaller than 5MB")
    )
    .refine(
      (file) => /^image\/(jpe?g|png|webp)$/i.test(file.type),
      err("Only JPG, PNG, or WebP images are allowed")
    ),
  title: z.coerce
    .string()
    .min(1, err("Give your recipe a tasty name!"))
    .max(100, err("Keep the title short and sweet (under 100 characters)")),
  description: z.coerce
    .string()
    .max(500, err("Description is too long (max 500 characters)"))
    .default(""),
  portions: z.coerce
    .number()
    .int(err("Use whole numbers (e.g., 4 servings, not 4.5)"))
    .positive(err("Portions must be at least 1"))
    .default(1),
  cookingDuration: z.coerce
    .number()
    .nonnegative(err("Cooking time cannot be negative"))
    .refine(
      (val) => val < 24 * 60,
      err("Duration exceeds 24 hours—double-check this!")
    )
    .default(0),
  cookingMethod: z.array(
    z
      .string()
      .min(1, err("Specify a cooking method (e.g., 'Bake' or 'Stir-fry')"))
  ),
  ingredients: z
    .array(ingredientSchema)
    .min(1, err("Your recipe needs at least one ingredient!"))
    .refine((ingredients) => {
      console.log(ingredients);
      return ingredients.length > 0;
    }),
  instructions: z
    .array(
      z
        .string()
        .min(1, err("Don't leave steps blank (e.g., 'Preheat oven to 350°F')"))
    )
    .min(1, err("Add at least one step to your instructions")),
  tags: z
    .array(z.string().min(1, err("Tags can't be empty (e.g., 'Vegetarian')")))
    .optional()
    .default([]),
  draft: z.coerce.boolean().default(false),
});

export const CreateRecipeForm = ({
  sessionToken,
}: {
  sessionToken: string;
}) => {
  const createRecipeAction = createAction(recipeSchema, async (_, formData) => {
    try {
      console.log("Form data:", formData);

      const formDataToSend = new FormData();

      // // Handle arrays properly
      const arraysToProcess = {
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        cookingMethod: formData.cookingMethod,
        tags: formData.tags,
      };

      Object.entries(arraysToProcess).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (key === "ingredients") {
              if (typeof item === "object" && "value" in item) {
                formDataToSend.append(
                  `${key}[${index}][value]`,
                  item.value.trim()
                );
              }
              if (typeof item === "object" && "quantity" in item) {
                formDataToSend.append(
                  `${key}[${index}][quantity]`,
                  String(item.quantity).trim()
                );
              }
              if (typeof item === "object" && "unitsOfMeasurement" in item) {
                formDataToSend.append(
                  `${key}[${index}][unitsOfMeasurement]`,
                  item.unitsOfMeasurement.trim()
                );
              }
            } else {
              formDataToSend.append(
                `${key}[${index}]`,
                typeof item === "object" ? JSON.stringify(item) : item.trim()
              );
            }
          });
        }
      });

      // Handle draft boolean
      formDataToSend.append("draft", formData.draft ? "true" : "false");

      // Handle file upload
      if (formData.src instanceof File) {
        formDataToSend.append("src", formData.src);
      }

      // Add simple fields
      const simpleFields = [
        "title",
        "description",
        "portions",
        "cookingDuration",
      ];
      simpleFields.forEach((field) => {
        formDataToSend.append(
          field,
          String(formData[field as keyof typeof formData])
        );
      });

      console.log("formData to send: ", formDataToSend);
      createRecipe(formDataToSend, sessionToken);
      return {
        success: true,
        message: "Recipe created successfully!",
      };
    } catch (error) {
      console.error("Recipe creation failed:", error);

      if (ApiError.isApiError(error)) {
        return {
          success: false,
          message: error.message,
          errors: error.cause,
        };
      }

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  });
  enum UnitsOfMeasurement {
    MG = "mg",
    G = "g",
    KG = "kg",
    ML = "ml",
    L = "l",
    CUP = "cup",
    TBSP = "tbsp",
    TSP = "tsp",
    OZ = "oz",
    LB = "lb",
    PINT = "pint",
    QT = "qt",
    GAL = "gal",
    PN = "pinch",
    PC = "piece",
    SLICE = "slice",
    STALK = "stalk",
    CLOVES = "cloves",
    BUNCH = "bunch",
    CUBE = "cube",
    BOTTLE = "bottle",
    CAN = "can",
    JAR = "jar",
    BOWL = "bowl",
    STICK = "stick",
    TABLE = "table",
  }
  enum CookingMethod {
    FryingPan = "Frying Pan",
    Oven = "Oven",
    Microwave = "Microwave",
    AirFryer = "Air Fryer",
    Blender = "Blender",
    Boil = "Boil",
    None = "None",
  }

  return (
    <FormProvider
      schema={recipeSchema}
      action={createRecipeAction}
      className="w-full bg-background min-h-screen grid grid-cols-7 gap-5 shadow-lg rounded-2xl p-10"
    >
      <div className="col-span-2 col-start-1 flex flex-col gap-5">
        <FileUpload
          name="src"
          accept="image/jpeg,image/png,image/webp"
          maxSize={5}
          label="Upload recipe Image"
        />
        <Input name="title" type="text" placeholder="Recipe Title" />
        <Textarea
          name="description"
          placeholder="Recipe Description"
          rows={6}
        />
        <Input name="portions" type="number" placeholder="Portions" min={1} />
        <Input
          name="cookingDuration"
          type="number"
          placeholder="Cooking Duration (in minutes)"
          min={0}
        />
        <TagInput
          suggestions={Object.values(CookingMethod)}
          name="cookingMethod"
          placeholder="Cooking Method (e.g., Baking, Frying)"
          maxTags={3}
          allowCustomTags={false}
        />
        {/* <TagInput
          name="tags"
          maxTags={10}
          allowCustomTags
          placeholder="Add tags..."
          validateTag={(tag) => tag.length > 0}
        /> */}
        {/* <div className="flex items-center gap-2">
          <Input
            name="draft"
            type="checkbox"
            id="draft-checkbox"
            className="w-4 h-4"
          />
          <label htmlFor="draft-checkbox" className="text-sm">
            Save as draft
          </label>
        </div> */}
        <Submit className="mt-4">Create Recipe</Submit>
      </div>
      <div className="col-span-5 col-start-3 flex flex-col gap-5">
        <DynamicFields
          name="ingredients"
          label="Ingredients"
          defaultValue={{ value: "", quantity: "", unitsOfMeasurement: "" }}
          parser={ingredientParser}
          renderField={(index, handlePaste) => (
            <div className="flex gap-2.5 w-full items-center">
              <Input
                name={`ingredients.${index}.quantity`}
                type="number"
                placeholder="Qty"
                onPaste={handlePaste}
                min={0}
                step="0.1"
              />
              <Dropdown
                defaultOptionLabel="Unit"
                options={Object.values(UnitsOfMeasurement)}
                name={`ingredients.${index}.unitsOfMeasurement`}
              />
              <Input
                name={`ingredients.${index}.value`}
                placeholder="Ingredient name"
                className="flex-1"
              />
            </div>
          )}
        />

        <DynamicFields
          name="instructions"
          label="Instructions"
          defaultValue=""
          parser={instructionParser}
          renderField={(index, handlePaste) => (
            <div className="flex gap-2.5 w-full items-center">
              <Textarea
                name={`instructions.${index}`}
                placeholder={`Step ${index + 1}`}
                className="flex-1"
                rows={2}
                onPaste={handlePaste}
              />
            </div>
          )}
        />
      </div>
    </FormProvider>
  );
};
