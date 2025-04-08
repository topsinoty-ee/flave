import {
  FieldValues,
  Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components";
import { handlePaste } from "../fn/handlePaste";

type DynamicFieldsProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  defaultValue: any;
  renderField: (
    index: number,
    handlePasteEvent?: (e: React.ClipboardEvent) => void
  ) => React.ReactNode;
  parser?: (line: string, index: number) => any;
};

export function DynamicFields<T extends FieldValues>({
  name,
  label,
  defaultValue,
  renderField,
  parser,
}: DynamicFieldsProps<T>) {
  const { control, setValue } = useFormContext<T>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  const handlePasteEvent = (
    e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    if (parser) {
      handlePaste<T>({
        event: e,
        currentIndex: index,
        append,
        setValue,
        parser,
        name,
      });
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-dark">
          {label}
        </label>
      )}
      <div className="flex flex-col gap-5">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2.5 group">
            <div className="flex-1">
              {renderField(index, (e) =>
                handlePasteEvent(
                  e as React.ClipboardEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >,
                  index
                )
              )}
            </div>
            <Button
              variant="ghost"
              type="button"
              onClick={() => remove(index)}
              className="mt-1 p-2.5 text-gray hover:text-error rounded-md hover:bg-error-light group-hover:bg-error-light group-hover:text-error"
              aria-label={`Remove item ${index + 1}`}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => append(defaultValue)}
          variant="ghost"
          className="flex items-center gap-1 text-sm text-yellow hover:text-yellow-dark rounded-md p-2.5 bg-yellow-light hover:bg-yellow-light/80"
          aria-label="Add new item"
        >
          <Plus className="h-5 w-5" />
          Add New
        </Button>
      </div>
    </div>
  );
}
