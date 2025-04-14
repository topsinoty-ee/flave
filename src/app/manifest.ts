import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flave",
    short_name: "Flave",
    description: "A recipe search engine",
    start_url: "/browse",
    lang: "en",
    dir: "auto",
    icons: [
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#f5c518",
    background_color: "#ffffff",
    display: "standalone",
    orientation: "portrait-secondary",
  };
}
