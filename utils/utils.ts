import { ValidationResult } from 'joi';
import { IResponseError } from '../domain/IResponse';
import { ICollection } from '../domain/ICollection';

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

export const removeTimeStamp = (collection: ICollection): ICollection => {
    const { createdAt, updatedAt, __v, ...truncatedObj } = collection;
    return truncatedObj;
};
