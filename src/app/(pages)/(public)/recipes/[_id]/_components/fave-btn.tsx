"use client";
import { Button } from "@/components";
import { useAuth } from "@/context/auth";
import { Heart } from "lucide-react";

export const FavButton = ({ _id }: { _id: string }) => {
  const {
    actions: { addToFaves, getCurrentUser },
    isAuthenticated,
  } = useAuth();

  getCurrentUser && getCurrentUser("favourites");

  async function handleClick() {}
  return (
    <Button
      onClick={handleClick}
      icon={<Heart className="text-white stroke-white" />}
      className="bg-black text-white h-full"
    >
      Favorite
    </Button>
  );
};
