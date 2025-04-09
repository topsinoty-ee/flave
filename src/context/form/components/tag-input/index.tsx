"use client";
import { useState, useRef, useCallback, useMemo, ComponentProps } from "react";
import { useFormContext } from "../../hook";
import { X, Check, ChevronDown } from "lucide-react";
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
  suggestionClassName?: string;
}

export function TagInput<T extends FieldValues>({
  name,
  maxTags,
  suggestions = [],
  allowCustomTags = false,
  validateTag = () => true,
  onTagsChange,
  className,
  suggestionClassName,
  ...props
}: TagInputProps<T>) {
  const {
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const tags: string[] = watch(name) || [];

  const [inputVal, setInputVal] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const processTag = useCallback((tag: string) => tag.trim().slice(0, 32), []);

  const validateSingleTag = useCallback(
    (tag: string) => {
      const result = validateTag(tag);
      return typeof result === "string"
        ? { valid: false, message: result }
        : { valid: result, message: "Invalid tag" };
    },
    [validateTag]
  );

  const filteredSuggestions = useMemo(() => {
    const currentTags = new Set(tags);
    return suggestions.filter(
      (s) =>
        s.toLowerCase().includes(inputVal.toLowerCase()) && !currentTags.has(s)
    );
  }, [suggestions, inputVal, tags]);

  const addTags = useCallback(
    (newTags: string[]) => {
      const processedTags = newTags.map(processTag).filter((t) => t.length > 0);

      const validTags = processedTags
        .filter((tag) => {
          if (!allowCustomTags && !suggestions.includes(tag)) return false;
          return validateSingleTag(tag).valid;
        })
        .filter((tag) => !tags.includes(tag));

      if (maxTags && tags.length + validTags.length > maxTags) return;

      if (validTags.length > 0) {
        const newTagList = [...tags, ...validTags];
        setValue(name, newTagList as any, { shouldValidate: true });
        onTagsChange?.(newTagList);
        setInputVal("");
      }
    },
    [
      tags,
      maxTags,
      name,
      setValue,
      onTagsChange,
      processTag,
      validateSingleTag,
      allowCustomTags,
      suggestions,
    ]
  );

  const removeTag = useCallback(
    (index: number) => {
      const newTags = tags.filter((_, i) => i !== index);
      setValue(name, newTags as any, { shouldValidate: true });
      onTagsChange?.(newTags);
      inputRef.current?.focus();
    },
    [tags, name, setValue, onTagsChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredSuggestions.length > 0) {
            if (filteredSuggestions[highlightedIndex] !== undefined) {
              addTags([filteredSuggestions[highlightedIndex]]);
            }
            setIsSuggestionsOpen(false);
          } else if (inputVal) {
            addTags(inputVal.split(/,\s?/));
          }
          break;

        case "Backspace":
          if (!inputVal && tags.length > 0) {
            removeTag(tags.length - 1);
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            Math.min(prev + 1, filteredSuggestions.length - 1)
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, -1));
          break;

        case "Escape":
          setIsSuggestionsOpen(false);
          break;
      }
    },
    [inputVal, tags, addTags, removeTag, highlightedIndex, filteredSuggestions]
  );

  const disabled = props.disabled || isSubmitting;
  const error = errors[name];
  const showSuggestions = isSuggestionsOpen && filteredSuggestions.length > 0;
  const tagsLimitReached = !!maxTags && tags.length >= maxTags;

  return (
    <div className="flex flex-col gap-1 w-full" ref={containerRef}>
      <div className="relative">
        <div
          className={clsx(
            "flex flex-wrap gap-2 items-center p-2.5 rounded-2xl border",
            error ? errorStyles : normalStyles,
            className
          )}
        >
          {tags.map((tag, i) => (
            <button
              type="button"
              key={`${tag}-${i}`}
              onClick={() => removeTag(i)}
              className="text-sm hover:bg-gray-light px-2.5 py-1 rounded-md inline-flex items-center gap-1 bg-gray/50 transition-colors"
              disabled={disabled}
              aria-label={`Remove tag ${tag}`}
            >
              {tag}
              <X className="h-3.5 w-3.5 ml-1" />
            </button>
          ))}

          <input
            {...props}
            data-input-type="tag"
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsSuggestionsOpen(true)}
            onBlur={() => setTimeout(() => setIsSuggestionsOpen(false), 200)}
            className="flex-1 min-w-25 bg-transparent outline-none placeholder:text-gray"
            placeholder={
              tagsLimitReached
                ? "Maximum tags reached"
                : props.placeholder || "Add tags..."
            }
            disabled={disabled || tagsLimitReached}
            aria-autocomplete="list"
          />

          <div className="flex items-center gap-2.5 ml-2">
            {!error && !allowCustomTags && tags.length > 0 && (
              <Check className="h-5 w-5 text-success" />
            )}
            <ChevronDown
              className={clsx(
                "h-5 w-5 text-gray transition-transform",
                showSuggestions && "rotate-180"
              )}
            />
          </div>
        </div>

        {showSuggestions && (
          <div
            role="listbox"
            aria-label="Suggestions"
            className={clsx(
              "absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-light rounded-2xl shadow-lg",
              suggestionClassName
            )}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                role="option"
                key={suggestion}
                tabIndex={0}
                onClick={() => addTags([suggestion])}
                onMouseEnter={() => setHighlightedIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    addTags([suggestion]);
                  }
                }}
                className={clsx(
                  "w-full px-5 py-2.5 text-left hover:bg-gray-light",
                  highlightedIndex === index && "bg-gray-light",
                  "transition-colors"
                )}
                aria-selected={highlightedIndex === index}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error mt-1">{String(error.message)}</p>
      )}
    </div>
  );
}
