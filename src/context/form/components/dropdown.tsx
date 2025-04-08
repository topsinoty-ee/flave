import { Listbox } from "@headlessui/react";
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
  options: {
    value: string;
    label: string;
    Icon?: React.ComponentType<{ className?: string }>;
  }[];
} & ComponentProps<"select">) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<T>();
  const selectedValue = watch(name);

  return (
    <Listbox value={selectedValue} onChange={(value) => setValue(name, value)}>
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <Listbox.Button
            className={`${inputStyles} text-left pr-10 ${
              errors[name] ? errorStyles : normalStyles
            }`}
          >
            <div className="flex items-center gap-2">
              {options.find((opt) => opt.value === selectedValue)?.Icon && (
                <div className="h-5 w-5 text-gray-400">
                  <selectedValue.Icon
                    className="h-5 w-5 text-gray"
                    aria-hidden="true"
                  />
                </div>
              )}
              {options.find((opt) => opt.value === selectedValue)?.label ||
                "Select..."}
            </div>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-3 pr-9 ${
                    active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <div className="flex items-center gap-2">
                    {option.Icon && (
                      <div className="h-5 w-5 text-gray-400">
                        <option.Icon className="h-5 w-5" />
                      </div>
                    )}
                    <span
                      className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                    >
                      {option.label}
                    </span>
                    {selected && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <Check className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
        {errors[name] && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="h-4 w-4" />
            {errors[name]?.message?.toString()}
          </p>
        )}
      </div>
    </Listbox>
  );
}
