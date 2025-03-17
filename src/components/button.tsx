import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

export const Variant = {
  primary: "bg-highlight text-text",
  secondary: "bg-accent text-text",
  outline: "bg-muted text-background border-border border",
  danger: "bg-error",
  disabled: "bg-muted text-text cursor-not-allowed pointer-events-none",
  none: "border border-border",
} as const;

export const Shape = {
  rounded: "rounded-full",
  soft: "rounded-md",
  sharp: "rounded-sm",
  square: "rounded-none",
  button: "rounded-lg",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: "button" | "link";
  href?: string;
  disabled?: boolean;
  variant?: keyof typeof Variant;
  shape?: keyof typeof Shape;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

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
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all outline-1 outline outline-offset-0 w-max no-underline";

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
    return (
      <Link href={href} className={buttonClasses}>
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
