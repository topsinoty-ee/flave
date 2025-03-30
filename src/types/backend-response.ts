export type BackendResponse<
  RequestedDataType extends Extension,
  Extension = object,
> = {
  status: string;
  data: RequestedDataType;
};

export interface AuthResponse<RequestedDataType extends object>
  extends BackendResponse<RequestedDataType> {
  token: string;
}
