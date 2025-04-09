import { Button } from "@/components";
import { Upload, X, File as FileIcon, Image } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { FieldValues, Path, useFormContext, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

function FileUploadContent<T extends FieldValues>({
  onChange,
  value,
  accept,
  maxSize,
  errors,
  name,
}: {
  onChange: (file: File | null) => void;
  value: File | null;
  accept: string;
  maxSize: number;
  errors: any;
  name: Path<T>;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept.split(",").reduce(
      (acc, type) => {
        const trimmed = type.trim();
        if (trimmed) acc[trimmed] = [];
        return acc;
      },
      {} as Record<string, []>
    ),
    maxSize,
    multiple: false,
    onDrop: (acceptedFiles) => onChange(acceptedFiles[0] || null),
  });

  useEffect(() => {
    if (value && value.type.startsWith("image/")) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setPreviewUrl(null);
    return undefined;
  }, [value]);

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors ${
        errors[name]
          ? "border-error bg-error-light"
          : isDragActive
            ? "border-yellow bg-yellow-light"
            : "border-gray-light hover:border-gray hover:bg-gray-light"
      }`}
    >
      <input {...getInputProps({ id: name })} />
      <div className="flex flex-col items-center gap-2.5">
        <Upload className="h-10 w-10 text-gray" />
        {value ? (
          <div className="mt-2.5 flex items-center gap-2.5">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-12 w-12 object-cover rounded"
              />
            ) : value.type.startsWith("image/") ? (
              <Image className="h-5 w-5 text-black" />
            ) : (
              <FileIcon className="h-5 w-5 text-black" />
            )}
            <span className="text-sm text-gray">{value.name}</span>
            <Button
              type="button"
              onClick={handleClear}
              className="text-error hover:text-error-dark"
              variant="ghost"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray">
              {isDragActive
                ? "Drop file here"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-gray">
              Max size: {maxSize / 1024 / 1024}MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function FileUpload<T extends FieldValues>({
  name,
  label,
  accept = "image/*",
  maxSize = 5,
}: {
  name: Path<T>;
  label?: string;
  accept?: string;
  maxSize?: number;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-dark"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FileUploadContent<T>
            {...field}
            accept={accept}
            maxSize={maxSize * 1024 * 1024}
            errors={errors}
            name={name}
          />
        )}
      />
      {errors[name] && (
        <p className="text-sm text-error flex items-center gap-1">
          <X className="h-5 w-5" />
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
}
