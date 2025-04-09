import { Button, Image, SectionHeader } from "@/components";
import { Edit, Eye } from "lucide-react";
import { QuickLink } from "./_components/quick-link";
import { getCurrentUser } from "@/context/auth/actions";
import { LogoutButton } from "./_components/logout";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  console.log("profile:", user);
  if (!user) {
    return <h1 className="text-3xl">User not found</h1>;
  }
  const fallback = "/images/user-fallback.png";

  const src = typeof user.src === "object" ? user.src.url : user.src;
  return (
    <>
      <section className="aspect-section-md gap-10 flex">
        <div className="relative group aspect-square rounded-lg ">
          <div className="w-full aspect-square relative bg-black overflow-clip rounded-lg">
            <Image
              src={src ? src : fallback} // Fallback image || "/default-avatar.png"
              alt={`${user.firstName} ${user.lastName || ""}`.trim()}
              fill
              sizes="(max-width: 384px) 40vw, (max-width: 600px) 25vw, 33vw" // Responsive sizing
              decoding="async"
              className="object-cover absolute"
              fallbackSrc={fallback}
              blurDataURL={fallback}
              placeholder={src ? "blur" : "empty"} // Blur placeholder if available
              aria-label={`Profile picture of ${user.firstName}`} // Additional accessibility
              quality={85} // Optimize image quality
              priority
            />
          </div>
          <div className="absolute top-0 opacity-0 transition-all duration-300 group-hover:opacity-100 gap-10 group-hover:bg-black/25 w-full h-full rounded-lg flex justify-center items-center">
            {[
              {
                icon: <Eye />,
                href: src || fallback,
              },
              {
                icon: <Edit />,
                href: "/profile/edit",
              },
            ].map((button, idx) => (
              <Button
                className="bg-black opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all delay-100 duration-300"
                key={idx}
                icon={button.icon}
                as="link"
                href={button.href}
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Security measure
                shallow={true} // For client-side navigation
                passHref={true}
              />
            ))}
          </div>
        </div>
        <div className="w-full rounded-lg max-w-full flex flex-col justify-between gap-10">
          <div className="bg-black p-10 h-full rounded-lg">
            <SectionHeader
              title={
                user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : `${user.username}`
              }
              description={user?.description || "It might all be over 🥺"}
            />
          </div>
          <div className="h-full flex gap-10">
            {[
              {
                name: "Favorites",
                endpoint: "/favorites",
                details: {
                  count: user.favouritedRecipes?.length || 0,
                  quantifier: "liked recipe",
                },
              },
              {
                name: "Drafts",
                endpoint: "/drafts",
                details: {
                  count: user.favouritedRecipes?.length || 0,
                  quantifier: "recipe draft",
                },
              },
            ].map((qLink, idx) => (
              <QuickLink {...qLink} key={idx} />
            ))}
          </div>
        </div>
      </section>
      <section className="flex gap-5">
        <Button>Edit Profile</Button>
        <LogoutButton />
      </section>
      <section className="bg-black flex justify-center items-center aspect-section-xs rounded-lg w-full">
        <h3>More features coming soon</h3>
      </section>
    </>
  );
}
