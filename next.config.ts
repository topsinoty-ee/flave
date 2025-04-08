import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  /* config options here */
  images: {
    // domains: ['example.com'], // Add your domain here
    // path: '/_next/image', // Change this to your preferred path
    // loader: 'cloudinary', // Change this to your preferred image service provider
    // cloudinary: {
    //   cloudName: 'your-cloud-name', // Replace with your cloudinary cloud name
    //   apiKey: 'your-api-key', // Replace with your cloudinary api key
    //   apiSecret: 'your-api-secret', // Replace with your cloudinary api secret
    // },
    // formats: ['image/avif', 'image/webp'], // Add your preferred image formats here
    // placeholder: {
    //   url: '/_next/image/placeholder', // Change this to your preferred placeholder image path
    //   fallback: 'blur',
    // },
    // blurDataURL: '/_next/image/blur', // Change this to your preferred blur data URL path
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.flave.ee",
        pathname: "/images",
      },
      {
        protocol: "https",
        hostname: "flave.ee",
      },
      {
        protocol: "https",
        hostname: "cdn.flave.ee",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
      // Add more remote patterns here if needed.
    ],
  },
};

export default nextConfig;
