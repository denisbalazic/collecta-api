import { ValidationResult } from 'joi';
import { CustomError } from './CustomError';
import { IResponseError } from '../domain/IResponse';

// eslint-disable-next-line import/prefer-default-export
export const processJoiValidationErrors = ({ error }: ValidationResult): IResponseError[] => {
    if (error && error.details.length > 0) {
        return error.details.map((err) => ({
            field: err.context?.label,
            message: err.message,
        }));
    }
    return [];
};
