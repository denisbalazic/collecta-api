import { IResponseError } from '../domain/IResponse';

// eslint-disable-next-line import/prefer-default-export
export class CustomError extends Error {
  private type: string;

  private errors: IResponseError[];

  constructor(type: string, errors: IResponseError[], message: string) {
    super();
    this.type = type;
    this.errors = errors;
    this.message = message;
  }
}
