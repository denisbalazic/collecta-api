import { ValidationResult } from 'joi';
import { CustomError } from './CustomError';

// eslint-disable-next-line import/prefer-default-export
export const processJoiValidationErrors = ({ error }: ValidationResult): void => {
  if (error && error.details.length > 0) {
    const validationErrors = error.details.map((err) => ({
      type: 'validation',
      field: err.context?.label,
      message: err.message,
    }));
    throw new CustomError('validations', validationErrors, '');
  }
};
