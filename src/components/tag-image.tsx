"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { isRecipe } from "@/util";
import { Image } from "./image";
import { Tag } from "@/types/tag";

type TagImageProps = Omit<Tag, "recipes">;

export const TagImage: React.FC<TagImageProps> = ({ value, _id }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/tags/${_id}`);
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const { data: recipes } = await res.json();

        if (!Array.isArray(recipes)) throw new Error("Invalid recipe data");

        const images = recipes
          .slice(0, 4)
          .filter((r: unknown): r is { src: string } => isRecipe(r))
          .map((r) => r.src);

        if (images.length === 0) throw new Error("No valid images");

        const response = await axios.post<{ dataUrl: string }>("/api/collage", {
          images,
          options: {
            size: { width: 120, height: 120 },
            spacing: 8,
          },
        });

        setDataUrl(response.data.dataUrl);
      } catch (err) {
        setError("Failed to create collage");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (_id) {
      fetchRecipes();
    }
  }, [_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center w-full gap-5">
      <Image
        src={dataUrl ?? "/images/culinary-fallback.png"}
        alt={value}
        width={100}
        height={100}
        className="w-full golden-circle min-w-20 max-w-40"
      />
      <h5 className="uppercase">{value}</h5>
    </div>
  );
};
