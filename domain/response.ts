export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export enum FilterOperator {
    EQUALS = 'eq',
    NOT_EQUALS = 'ne',
    CONTAINS = 'ct',
    NOT_CONTAINS = 'nct',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUALS = 'gte',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUALS = 'lte',
}

export interface IFilter {
    property: string;
    value: string;
    operator: FilterOperator;
}

export interface IPageableQuery {
    page: string;
    size: string;
    sort?: SortDirection;
    sortBy?: string;
    filters?: IFilter[];
}

export interface IResponseError {
    field?: string;
    message?: string;
}

export interface IResponse<T> {
    data: T;
    errors?: IResponseError[];
}

export interface IPageableResponse<T> {
    data: T[];
    pagination: {
        page: number;
        size: number;
        numberOfElements: number;
    };
    errors?: IResponseError[];
}
