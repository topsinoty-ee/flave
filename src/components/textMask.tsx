"use client";

import clsx from "clsx";
import React, { useState, useEffect, ReactNode } from "react";

type TextMaskProps = {
  children: ReactNode;
  backgroundImage?: string;
  fallbackColor?: string;
  fontSize?: string | number;
  fontFamily?: string;
  className?: string;
  style?: React.CSSProperties;
  svgWidth?: number | string;
  svgHeight?: number | string;
};

export const TextMask = ({
  children,
  backgroundImage = "/yellow-pattern-bg.png",
  fallbackColor = "#fffffff0",
  fontSize = "70px",
  fontFamily = "Arial",
  className,
  style,
  svgWidth = "100%",
  svgHeight = 100,
}: TextMaskProps) => {
  const [isTextClipSupported, setIsTextClipSupported] = useState(true);

  useEffect(() => {
    setIsTextClipSupported(
      CSS.supports("background-clip", "text") ||
        CSS.supports("-webkit-background-clip", "text"),
    );
  }, []);

  if (isTextClipSupported) {
    return (
      <div
        className={clsx("w-max select-none", className)}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          fontFamily,
          fontWeight: "black",
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  // SVG Fallback for unsupported browsers
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={className}
      style={style}
    >
      <defs>
        <pattern
          id="patternMask"
          patternUnits="userSpaceOnUse"
          width="100%"
          height="100%"
        >
          <image
            href={backgroundImage}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={fallbackColor}
        style={{ fontWeight: "bold" }}
      >
        {children}
      </text>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill="url(#patternMask)"
        style={{ fontWeight: "bold" }}
      >
        {children}
      </text>
    </svg>
  );
};
