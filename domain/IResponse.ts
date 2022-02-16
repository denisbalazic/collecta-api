export interface IResponseError {
    field?: string;
    message?: string;
}

export interface IResponse {
    data: any;
    errors?: IResponseError[];
}
