/**
 * @file A reusable textarea component with error handling
 * @module TextareaField
 */

import clsx from "clsx";
import { FC } from "react";

/**
 * Props for the TextareaField component
 * @typedef {object} TextareaFieldProps
 * @extends React.TextareaHTMLAttributes<HTMLTextAreaElement>
 *
 * @property {string} name - The name attribute for the textarea
 * @property {string} label - The label displayed as placeholder
 * @property {string} [error] - Error message to display
 */
interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  error?: string;
}

/**
 * Reusable textarea component with error handling
 * @type {FC<TextareaFieldProps>}
 */
export const TextareaField: FC<TextareaFieldProps> = ({
  name,
  label,
  error,
  className,
  ...rest
}) => (
  <div className="flex flex-col gap-1">
    <textarea
      id={name}
      name={name}
      placeholder={label}
      className={clsx(
        "w-full outline-none py-2 px-3 border rounded-md min-h-[100px]",
        {
          "border-gray-300 focus:border-brand-accent-green": !error,
          "border-error": error,
        },
        className
      )}
      {...rest}
    />
    {error && <span className="text-error text-sm">{error}</span>}
  </div>
);
