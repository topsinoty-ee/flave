import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes, AnchorHTMLAttributes, MouseEvent } from "react";

export const Variant = {
  primary: "bg-black",
  secondary: "bg-gray outline-none",
  outline: "bg-muted border-border border",
  danger: "bg-error-dark",
  disabled: "bg-muted cursor-not-allowed pointer-events-none",
  none: "border border-border",
} as const;

export const Shape = {
  rounded: "rounded-full",
  soft: "rounded-md",
  sharp: "rounded-sm",
  square: "rounded-none",
  button: "rounded-lg",
} as const;

import { LinkProps } from "next/link";

type BaseButtonProps = {
  as?: "button" | "link";
  disabled?: boolean;
  variant?: keyof typeof Variant;
  shape?: keyof typeof Shape;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

// Extend to include Next.js LinkProps
export type ButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonHTMLAttributes<HTMLButtonElement> | keyof BaseButtonProps
  > &
  Omit<LinkProps, keyof AnchorHTMLAttributes<HTMLAnchorElement> | "href">;

export const Button = ({
  as = "button",
  href,
  onClick,
  disabled = false,
  variant = "primary",
  shape = "button",
  icon,
  children,
  className,
  type = "button",
  shallow,
  passHref,
  prefetch,
  replace,
  scroll,
  locale,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all outline-1 outline outline-offset-0 w-max no-underline shadow-sm";
  const variantClasses = Variant[variant];
  const shapeClasses = Shape[shape];
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";
  const iconOnlyClasses = !children ? "p-5 aspect-square" : "";
  const buttonClasses = clsx(
    baseClasses,
    variantClasses,
    shapeClasses,
    disabledClasses,
    iconOnlyClasses,
    className,
  );

  if (as === "link" && href) {
    // Create a type-safe handler for the Link component
    const handleAnchorClick = onClick
      ? (e: MouseEvent<HTMLAnchorElement>) => {
          // This cast is safe because we're only using common properties
          onClick(e as unknown as MouseEvent<HTMLButtonElement>);
        }
      : undefined;

    return (
      <Link
        href={href}
        className={buttonClasses}
        onClick={handleAnchorClick}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        locale={locale}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon && <span>{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
