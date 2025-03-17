"use client";

import clsx from "clsx";
import NextImage from "next/image";
import { memo, useEffect, useState } from "react";

interface ImageProps {
  src?: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  errorComponent?: React.ReactNode;
  blurDataURL?: string;
  priority?: boolean;
  sizes?: string;
}

const DEFAULT_FALLBACK = "/images/culinary-fallback.png";

const ImageComponent: React.FC<ImageProps> = ({
  src,
  alt = "",
  fill = false,
  width = 500,
  height = 500,
  className = "",
  fallbackSrc = DEFAULT_FALLBACK,
  errorComponent,
  blurDataURL,
  priority = false,
  sizes,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setLoaded(false);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const isValidSrc = currentSrc && currentSrc.trim() !== "";
  const showFallback = !isValidSrc || hasError;

  const handleLoad = () => setLoaded(true);

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  if (showFallback && errorComponent) {
    return <>{errorComponent}</>;
  }

  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        fill ? "w-full h-full" : "inline-block",
        className,
      )}
      role="img"
      aria-label={alt || "Image content"}
    >
      {!loaded && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
        </div>
      )}

      <NextImage
        src={showFallback ? fallbackSrc : currentSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={clsx(
          "object-cover transition-opacity duration-300 ease-out",
          {
            "opacity-0": !loaded,
            "opacity-100": loaded,
          },
        )}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={showFallback ? undefined : blurDataURL}
        priority={priority}
        sizes={sizes}
        unoptimized={!showFallback ? priority : false}
      />
    </div>
  );
};

export const Image = memo(ImageComponent);
