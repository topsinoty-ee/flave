import { ChevronDown, X } from "lucide-react";
import { ComponentProps } from "react";
import { FieldValues, Path } from "react-hook-form";
import { errorStyles, inputStyles, normalStyles } from "./styles";
import { useFormContext } from "../hook";

export function Select<T extends FieldValues>({
  name,
  label,
  options,
  ...props
}: {
  name: Path<T>;
  label?: string;
  options: { value: string; label: string }[];
} & ComponentProps<"select">) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-dark">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          {...register(name)}
          {...props}
          className={`${inputStyles} appearance-none pr-10 ${errors[name] ? errorStyles : normalStyles}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray">
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>
      {errors[name] && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="h-4 w-4" />
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
}
