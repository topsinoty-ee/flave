// src/utils/formDataHelpers.ts
type FormDataValue = string | Blob | File;

export function formDataToObject(formData: FormData): Record<string, any> {
  const object: Record<string, any> = {};

  formData.forEach((value, key) => {
    const keys = key.split(/[\[\].]+/).filter((k) => k !== "");
    let current = object;

    keys.forEach((k, i) => {
      const isArrayIndex = i > 0 && !isNaN(Number(k));
      const isLast = i === keys.length - 1;

      if (isLast) {
        if (isArrayIndex) {
          current[Number(k)] = value;
        } else {
          current[k] = value;
        }
      } else {
        const nextKey = keys[i + 1];
        const isNextArrayIndex = !isNaN(Number(nextKey));

        if (!current[k]) {
          current[k] = isNextArrayIndex ? [] : {};
        }
        current = current[k];
      }
    });
  });

  return object;
}

export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  const appendFormData = (data: any, path: string = "") => {
    if (data === null || data === undefined) return;

    if (data instanceof Blob || data instanceof File) {
      formData.append(path, data);
    } else if (Array.isArray(data)) {
      data.forEach((item, index) => {
        appendFormData(item, `${path}[${index}]`);
      });
    } else if (typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        appendFormData(value, path ? `${path}.${key}` : key);
      });
    } else {
      formData.append(path, data.toString());
    }
  };

  appendFormData(obj);
  return formData;
}

// Helper type for FormData conversion
export type FormDataLike = {
  entries: () => IterableIterator<[string, FormDataValue]>;
};
