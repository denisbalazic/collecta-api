export interface IResponseError {
  type: string;
  field?: string;
  message: string;
}

export interface IResponse {
  data: any;
  errors: IResponseError[];
}
