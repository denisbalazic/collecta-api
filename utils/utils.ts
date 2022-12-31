import { ValidationResult } from 'joi';
import { IResponseError } from '../domain/response';
import { IWithTimeStamp } from '../domain/mongo';

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

export const removeTimeStamp = <T extends IWithTimeStamp>(collection: T): Omit<T, keyof IWithTimeStamp> => {
    const { createdAt, updatedAt, __v, ...truncatedObj } = collection;
    return truncatedObj;
};
