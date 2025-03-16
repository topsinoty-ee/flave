export type BackendResponse<RequestedDataType extends object> = {
  status: string;
  data: RequestedDataType;
};

export interface AuthResponse<RequestedDataType extends object>
  extends BackendResponse<RequestedDataType> {
  token: string;
}
