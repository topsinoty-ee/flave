import { FieldValues, UseFieldArrayAppend, Path } from "react-hook-form";

type PasteHandlerParams<T extends FieldValues> = {
  event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>;
  currentIndex: number;
  append: UseFieldArrayAppend<T, any>;
  setValue: (name: Path<T>, value: any) => void;
  parser: (line: string, index: number) => any;
  name: Path<T>;
};

export const handlePaste = <T extends FieldValues>({
  event,
  currentIndex,
  append,
  setValue,
  parser,
  name,
}: PasteHandlerParams<T>) => {
  const pastedText = event.clipboardData.getData("text/plain");
  const lines = pastedText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length > 0) {
    event.preventDefault();

    const [firstLine, ...remainingLines] = lines;

    // Update current field with first line
    const parsedFirst = parser(firstLine ?? "", 0);
    Object.entries(parsedFirst).forEach(([key, value]) => {
      setValue(`${name}.${currentIndex}.${key}` as Path<T>, value);
    });

    // Append new fields for remaining lines
    remainingLines.forEach((line, index) => {
      const parsed = parser(line, index + 1);
      append(parsed);
    });
  }
};

export const instructionParser = (line: string) => ({ value: line });

export const ingredientParser = (line: string) => {
  const match = line.match(/^(\d*\.?\d+)\s*([a-zA-Z⁄%]+)?\s*(.+)/) || [];
  return {
    quantity: match[1] || "",
    unitsOfMeasurement: match[2]?.trim() || "",
    value: match[3]?.trim() || "",
  };
};
