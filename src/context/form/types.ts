export type ActionStateFor<InputType, ResultData = Partial<InputType>> = {
  fieldErrors?: Partial<Record<keyof InputType, string[]>>;
  error?: string | null;
  data?: ResultData;
  success?: boolean;
  message?: string;
};

export type FormContextConfig = {
  isPending: boolean;
  state: ActionStateFor<unknown, unknown> | null;
};
