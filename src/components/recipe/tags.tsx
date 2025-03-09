import clsx from "clsx";
import { FC, ReactNode } from "react";

interface TagProps {
  children?: string;
  icon?: ReactNode | ReactNode[];
  animate?: boolean;
  className?: string;
  title?: string;
}

export const Tag: FC<TagProps> = ({
  children,
  icon,
  animate = true,
  className,
  title,
}) => {
  const icons = (() => {
    if (Array.isArray(icon)) {
      return icon.filter(
        (node) => node !== null && node !== undefined && node !== false
      );
    }
    return icon ? [icon] : [];
  })();

  const hasIcons = icons.length > 0;

  return (
    <span
      title={title}
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg",
        "bg-black text-background whitespace-nowrap transition-colors",
        {
          "hover:text-gray-light": animate,
          "cursor-default": !animate,
        },
        className
      )}
    >
      {hasIcons &&
        icons.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center justify-center text-inherit"
          >
            {item}
          </span>
        ))}

      {children}
    </span>
  );
};
