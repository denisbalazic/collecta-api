export interface IResponseError {
    field?: string;
    message?: string;
}

export interface IResponse {
    data: any;
    errors?: IResponseError[];
}

export interface IPagination {
    page?: number;
    size?: number;
    numberOfElements?: number;
}

export interface IPageableQuery {
    page?: string;
    size?: string;
    sort?: string;
    sortBy?: string;
    filter?: string;
    filterBy?: string;
}

export interface IPageableResponse<T> {
    data: T[];
    pagination: IPagination;
    errors?: IResponseError[];
}
