import { IResponseError } from '../domain/IResponse';

// eslint-disable-next-line import/prefer-default-export
export class CustomError extends Error {
    public statusCode: number;

    public errors: IResponseError[];

    constructor(statusCode: number, errors: IResponseError[], message: string) {
        super();
        this.statusCode = statusCode;
        this.errors = errors;
        this.message = message;
        this.name = 'CustomError';
    }
}
