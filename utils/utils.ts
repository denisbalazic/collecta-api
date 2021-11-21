import { ValidationResult } from 'joi';
import { IError } from '../domain/IResponse';

// eslint-disable-next-line import/prefer-default-export
export const mapJoiValidationErrors = ({ error }: ValidationResult): IError[] => {
  if (error) {
    return error.details.map((err) => ({
      type: 'validation',
      field: err.context?.label,
      message: err.message,
    }));
  }
  return [];
};
