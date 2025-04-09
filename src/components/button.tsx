"use client";

import clsx from "clsx";
import Link from "next/link";
import {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { LinkProps } from "next/link";
import { Loader2 } from "lucide-react";

export const Variant = {
  primary: "bg-black text-white hover:bg-gray-dark active:bg-gray",
  secondary:
    "bg-gray-light text-gray-dark hover:bg-gray-light active:bg-gray outline-none",
  outline:
    "bg-transparent border border-gray hover:bg-gray-light active:bg-gray-light",
  danger: "bg-error-dark text-white hover:bg-error active:bg-error-dark",
  success: "bg-success text-white hover:bg-success active:bg-success-dark",
  warning: "bg-warning text-white hover:bg-warning active:bg-warning-dark",
  ghost: "hover:bg-gray-light active:bg-gray",
  disabled: "bg-gray text-gray-dark cursor-not-allowed",
} as const;

export const Size = {
  sm: "text-sm py-1 px-2.5",
  md: "text-base py-2.5 px-5",
  lg: "text-xl py-2.5 px-10",
} as const;

export const Shape = {
  rounded: "rounded-full",
  soft: "rounded-md",
  sharp: "rounded-sm",
  square: "rounded-none",
  default: "rounded-2xl",
} as const;

type BaseButtonProps = {
  variant?: keyof typeof Variant;
  size?: keyof typeof Size;
  shape?: keyof typeof Shape;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export type ButtonAsButton = BaseButtonProps & {
  as?: "button";
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof BaseButtonProps | "onClick" | "type"
  > & {
    type?: "button" | "submit" | "reset";
  };

export type ButtonAsLink = BaseButtonProps & {
  as: "link";
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
} & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof BaseButtonProps | "onClick" | "href"
  > &
  Omit<LinkProps, keyof AnchorHTMLAttributes<HTMLAnchorElement> | "href">;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = (props: ButtonProps) => {
  const {
    as = "button",
    variant = "primary",
    size = "md",
    shape = "default",
    icon,
    iconPosition = "left",
    loading = false,
    disabled = false,
    fullWidth = false,
    children,
    className,
    ariaLabel,
    onClick,
    ...rest
  } = props;

  const isDisabled = disabled || loading;
  const isIconOnly = !children && !!icon;
  const showLoader = loading && !isIconOnly;

  const baseClasses = clsx(
    "inline-flex items-center justify-center gap-2.5 font-medium transition-all",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.98] transition-transform",
    Variant[variant],
    Size[size],
    Shape[shape],
    {
      "w-full": fullWidth,
      "opacity-50 cursor-not-allowed": isDisabled,
      "px-2.5 py-2.5": isIconOnly,
      "pointer-events-none": isDisabled,
    },
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className={clsx({ "animate-spin": loading })} aria-hidden="true">
          {loading ? <Loader2 className="animate-spin" /> : icon}
        </span>
      )}
      {children}
      {showLoader && <Loader2 className="ml-2.5 animate-spin" />}
      {icon && iconPosition === "right" && (
        <span aria-hidden="true">{icon}</span>
      )}
    </>
  );

  if (as === "link") {
    const { href, ...linkProps } = rest as ButtonAsLink;

    if (isDisabled) {
      return (
        <span
          className={baseClasses}
          aria-disabled="true"
          aria-label={ariaLabel}
          role="button"
        >
          {content}
        </span>
      );
    }

    return (
      <Link
        href={href}
        className={baseClasses}
        aria-label={ariaLabel}
        onClick={(e) => {
          if (!isDisabled) {
            (onClick as MouseEventHandler<HTMLAnchorElement>)?.(e);
          }
        }}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonAsButton;
  return (
    <button
      type={type}
      className={baseClasses}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      onClick={(e) => {
        if (!isDisabled) {
          (onClick as MouseEventHandler<HTMLButtonElement>)?.(e);
        }
      }}
      {...buttonProps}
    >
      {content}
    </button>
  );
};
