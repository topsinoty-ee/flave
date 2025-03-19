import clsx from "clsx";
import { Loader2 } from "lucide-react";

import { Button, ButtonProps } from "@/components/";

import { useForm } from "../hook";

type SubmitButtonProps = ButtonProps & { loading?: boolean };
export const SubmitButton = (props: SubmitButtonProps) => {
  const { isPending } = useForm();
  const {
    formState: { isSubmitting },
  } = useForm();
  const { children, className, loading = false, ...rest } = props;
  return (
    <Button
      type="submit"
      disabled={isPending || isSubmitting}
      aria-disabled={isPending || isSubmitting}
      className={clsx(className)}
      {...rest}
    >
      {isPending || loading ? (
        <Loader2
          className={clsx(
            "animate-spin pointer-events-none cursor-not-allowed",
          )}
        />
      ) : (
        children
      )}
    </Button>
  );
};
