"use client";
import { useEffect, useState, useRef, ComponentProps } from "react";
import { useFormContext } from "../../hook";
import { X, Check } from "lucide-react";
import { FieldValues, Path } from "react-hook-form";
import clsx from "clsx";
import { Button } from "@/components";
import { errorStyles, normalStyles } from "../styles";

interface TagInputProps<T extends FieldValues> extends ComponentProps<"input"> {
  name: Path<T>;
  maxTags?: number;
  suggestions?: string[];
  allowCustomTags?: boolean;
  validateTag?: (tag: string) => boolean | string;
  onTagsChange?: (tags: string[]) => void;
}

export function TagInput<T extends FieldValues>({
  name,
  maxTags,
  suggestions = [],
  allowCustomTags = true,
  validateTag = () => true,
  onTagsChange,
  className,
  ...props
}: TagInputProps<T>) {
  const {
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();

  const [inputVal, setInputVal] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with form values (runs once)
  useEffect(() => {
    const initialValue = getValues(name);
    if (Array.isArray(initialValue)) {
      setTags(initialValue.filter(Boolean));
    }
  }, [name]);

  const processTag = (tag: string) => tag.trim().slice(0, 32);

  const validateSingleTag = (tag: string) => {
    const result = validateTag(tag);
    if (typeof result === "string") return { valid: false, message: result };
    return { valid: result, message: "Invalid tag" };
  };

  const addTags = (newTags: string[]) => {
    const processedTags = newTags.map(processTag).filter((t) => t.length > 0);
    const validTags = processedTags
      .filter((tag) => validateSingleTag(tag).valid)
      .filter((tag) => !tags.includes(tag));

    if (maxTags && tags.length + validTags.length > maxTags) {
      return;
    }

    if (validTags.length > 0) {
      const newTagList = [...tags, ...validTags];
      setTags(newTagList);
      setValue(name, newTagList as any, { shouldValidate: true });
      onTagsChange?.(newTagList);
      setInputVal("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue(name, newTags as any, { shouldValidate: true });
    onTagsChange?.(newTags);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputVal) {
      e.preventDefault();
      addTags([inputVal]);
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const disabled = props.disabled || isSubmitting;
  const error = errors[name];

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative">
        <div
          className={clsx(
            "flex flex-wrap gap-2 items-center px-3 py-2 rounded-lg border",
            error ? errorStyles : normalStyles,
            "ring-0 focus-within:ring-0",
            className
          )}
        >
          {tags.map((tag, i) => (
            <button
              type="button"
              key={`${tag}-${i}`}
              onClick={() => removeTag(i)}
              className="text-black hover:text-gray-dark px-2.5 py-1 rounded-lg inline-flex items-center gap-1 bg-gray-light "
              disabled={disabled}
            >
              {tag} <X className="h-2.5 w-2.5" />
            </button>
          ))}

          <input
            {...props}
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-15 ring-0 valid:ring-0 valid:border-none invalid:border-none valid:outline-none invalid:outline-none invalid:ring-0 focus-visible:ring-0 focus-within:ring-0 bg-transparent outline-none"
            placeholder={
              maxTags && tags.length >= maxTags
                ? "Maximum tags reached"
                : props.placeholder || "Add tags..."
            }
            disabled={disabled || (maxTags ? tags.length >= maxTags : false)}
          />

          {!error && tags.length > 0 && (
            <Check className="h-5 w-5 text-success" />
          )}
        </div>
      </div>

      {error && <p className="text-sm text-error">{String(error.message)}</p>}
    </div>
  );
}
