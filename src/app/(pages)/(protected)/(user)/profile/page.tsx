// import { getCurrentUser } from "@/context/auth/actions";
// import { Button, Image } from "@/components";
// import ProfileNavigation from "./_components/navigation";
// import { ReviewsList } from "@/components/review-list";
// import clsx from "clsx";
// import { Edit, Eye } from "lucide-react";

export default async function ProfilePage(
  {
    // searchParams,
  }: {
    searchParams: Promise<{ tab?: "reviews" }>;
  }
) {
  // const { data: user } = await getCurrentUser();
  // const { tab: activeTab } = await searchParams;
  // const fallback = "/images/user-fallback.png";
  // return (
  //   <>
  //     <section className="aspect-section-md gap-10 flex">
  //       <div className="relative group aspect-square rounded-lg ">
  //         <div className="w-full aspect-square relative bg-white p-5 rounded-lg">
  //           <Image
  //             src={user.avatar} // Fallback image || "/default-avatar.png"
  //             alt={`${user.firstName} ${user.lastName || ""}`.trim()}
  //             fill
  //             sizes="(max-width: 384px) 40vw, (max-width: 600px) 25vw, 33vw" // Responsive sizing
  //             decoding="async"
  //             className="object-cover absolute"
  //             fallbackSrc={fallback}
  //             placeholder={user.avatar ? "blur" : "empty"} // Blur placeholder if available
  //             aria-label={`Profile picture of ${user.firstName}`} // Additional accessibility
  //             quality={85} // Optimize image quality
  //             priority
  //           />
  //         </div>
  //         <div className="absolute top-0 opacity-0 transition-all duration-300 group-hover:opacity-100 gap-2.5 group-hover:bg-black/25 w-full h-full rounded-lg flex justify-center items-center">
  //           {[
  //             {
  //               icon: <Eye />,
  //               href: user.avatar || fallback,
  //             },
  //             {
  //               icon: <Edit />,
  //               href: "/profile/edit",
  //             },
  //           ].map((button, idx) => (
  //             <Button
  //               className="bg-black opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all delay-100 duration-300"
  //               key={idx}
  //               icon={button.icon}
  //               as="link"
  //               href={button.href}
  //               shallow={true} // For client-side navigation
  //               passHref={true}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //       <div className="w-full rounded-lg min-w-[70%] bg-black p-5 flex flex-col justify-between">
  //         <div className="h-full min-h-[30%] flex flex-col gap-2.5">
  //           <h2>
  //             {user.firstName} {user.lastName}
  //           </h2>
  //           <div className="flex gap-2.5">
  //             <span>{user.recipes.length} recipes</span>
  //             <span>rating: 4.5 ★ </span>
  //           </div>
  //         </div>
  //         <div className="flex flex-col gap-2.5">
  //           <h3>Bio</h3>
  //           <div className="h-full">
  //             <p className="text-base">
  //               {user?.description ||
  //                 "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //     <section className="aspect-section-md bg-black p-10 rounded-lg">
  //       {/* <RecipeDisplayBlock
  //         title="My Recipes"
  //         emptyState={
  //           <div className="w-full flex flex-col gap-5 justify-center items-center">
  //             <div className="flex flex-col gap-2.5 justify-center items-center">
  //               <span>¯\_(ツ)_/¯</span>
  //               <h6>No recipes yet</h6>
  //             </div>
  //             <Button className="bg-black text-white" icon={<Plus />}>
  //               new
  //             </Button>
  //           </div>
  //         }
  //         gridLayout="grid-cols-2 lg:grid-cols-3"
  //         params={["all"]}
  //       /> */}
  //     </section>
  //     <section className="aspect-section-lg flex gap-10">
  //       <ProfileNavigation
  //         counts={{
  //           reviews: user.recipes.length,
  //           drafts: user.recipes.length, // get drafts
  //           favorites: user.favouritedRecipes.length,
  //         }}
  //         activeTab={activeTab}
  //       />
  //       <div
  //         className={clsx("w-full h-full rounded-lg", {
  //           "bg-white": user.recipes.length === 0,
  //         })}
  //       >
  //         {activeTab === "reviews" && (
  //           <ReviewsList reviews={user.recipes} userid={user._id} /> //user.reviews
  //         )}
  //       </div>
  //     </section>
  //   </>
  // );
}
