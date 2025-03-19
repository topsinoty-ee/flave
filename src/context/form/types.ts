export type ActionStateFor<InputType> = {
  fieldErrors?: Partial<Record<keyof InputType, string>>;
  error?: string | null;
  data?: Partial<InputType>;
  success?: boolean;
  message?: string;
};

export type FormContextConfig = {
  isPending: boolean;
  state: ActionStateFor<unknown> | null;
};
