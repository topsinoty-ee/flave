import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, X } from "lucide-react";
import { ComponentProps } from "react";
import { FieldValues, Path } from "react-hook-form";
import { errorStyles, inputStyles, normalStyles } from "./styles";
import { useFormContext } from "../hook";

export function Dropdown<T extends FieldValues>({
  name,
  label,
  options,
  ...props
}: {
  name: Path<T>;
  label?: string;
  defaultOptionLabel?: string;
  options: (
    | string
    | {
        value: string;
        label: string;
        Icon?: React.ComponentType<{ className?: string }>;
      }
  )[];
} & ComponentProps<"select">) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<T>();
  const selectedValue = watch(name) || "";

  // Normalize options into a consistent object structure
  const normalizedOptions = options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option, Icon: undefined };
    }
    return option;
  });

  const selectedOption = normalizedOptions.find(
    (opt) => opt.value === selectedValue
  );

  return (
    <Listbox
      value={selectedValue}
      onChange={(value) => setValue(name, value as T[Path<T>])}
    >
      <div className="flex-col flex gap-1">
        {label && (
          <label className="block text-sm font-medium text-gray">{label}</label>
        )}
        <div className="relative">
          <ListboxButton
            className={`${inputStyles} text-left pr-10 ${
              errors[name] ? errorStyles : normalStyles
            }`}
          >
            <div className="flex items-center gap-2.5">
              {selectedOption?.Icon && (
                <div className="h-5 w-5 text-gray">
                  <selectedOption.Icon
                    className="h-5 w-5 text-gray"
                    aria-hidden="true"
                  />
                </div>
              )}
              {selectedOption?.label || props.defaultOptionLabel || "Select..."}
            </div>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {normalizedOptions.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ selected }) =>
                  `cursor-default select-none relative py-2.5 pl-3 pr-9 ${
                    selected ? "bg-gray-light text-gray-dark" : "text-black"
                  }`
                }
              >
                {({ selected }) => (
                  <div className="flex items-center gap-2">
                    {option.Icon && (
                      <div className="h-5 w-5 text-gray">
                        <option.Icon className="h-5 w-5" />
                      </div>
                    )}
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray">
                        <Check className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
        {errors[name] && (
          <p className="text-sm text-error flex items-center gap-1">
            <X className="h-5 w-5" />
            {errors[name]?.message?.toString()}
          </p>
        )}
      </div>
    </Listbox>
  );
}
