/**
 * @file A customizable input field component with dynamic icon and password toggle functionality.
 * @module InputField
 */

import { FC } from "react";
import clsx from "clsx";
import {
  Mail,
  Lock,
  User,
  Pencil,
  FileText,
  Phone,
  Globe,
  Calendar,
  Eye,
  EyeOff,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components";

/**
 * Props for the InputField component
 * @typedef {object} InputFieldProps
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 *
 * @property {string} name - The name attribute for the input field
 * @property {string} label - The label displayed as placeholder
 * @property {string} [type] - The input type (determines icon displayed)
 * @property {string} [error] - Error message to display
 * @property {boolean} [showPassword] - For password fields, whether to show text
 * @property {() => void} [togglePassword] - Toggle function for password visibility
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
  error?: string;
  showPassword?: boolean;
  togglePassword?: () => void;
}

/**
 * Gets the appropriate Lucide icon based on input type
 * @param {string} [type] - The input type
 * @returns {LucideIcon | null} The matching icon component or null
 */
const getIcon = (type?: string): LucideIcon | null => {
  switch (type) {
    case "email":
      return Mail;
    case "password":
      return Lock;
    case "text":
      return Pencil;
    case "number":
      return FileText;
    case "phone":
      return Phone;
    case "url":
      return Globe;
    case "date":
      return Calendar;
    case "username":
      return User;
    default:
      return null;
  }
};

/**
 * Reusable input field component with dynamic icon and password toggle
 * @type {FC<InputFieldProps>}
 */
export const InputField: FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  error,
  showPassword,
  togglePassword,
  ...rest
}) => {
  const Icon = getIcon(type);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            size={16}
            className={clsx("transition-colors duration-300", {
              "text-gray-500 peer-focus:text-brand-accent-green": !error,
              "text-error": error,
            })}
          />
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={label}
          className={clsx("w-full outline-none py-2 px-3 border rounded-md", {
            "border-gray-300 focus:border-brand-accent-green": !error,
            "border-error": error,
            "pl-8": Icon,
          })}
          {...rest}
        />
        {type === "password" && togglePassword && (
          <Button
            onClick={togglePassword}
            className="ml-[-35px]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        )}
      </div>
      {error && <span className="text-error text-sm">{error}</span>}
    </div>
  );
};
