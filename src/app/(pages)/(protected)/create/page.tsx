import { validateSession } from "@/context/auth/actions";
import { CreateRecipeForm } from "./form";

export default async function CreateRecipePage() {
  const { sessionToken } = await validateSession({
    detailed: true,
  });
  return (
    <section className="p-20 flex flex-col gap-10">
      <CreateRecipeForm sessionToken={sessionToken || ""} />
    </section>
  );
}
