import Joi from 'joi';
import { processJoiValidationErrors } from '../utils/utils';
import { CustomError } from '../utils/CustomError';
import { IPageableQuery } from '../domain/IResponse';

const collectionSchema = Joi.object().keys({
    page: Joi.number().min(1),
    size: Joi.number().min(1).max(100),
    sort: Joi.string().min(2).max(32),
    sortBy: Joi.string().min(2).max(32),
    filter: Joi.string().min(2).max(32),
    filterBy: Joi.string().min(2).max(32),
});

// eslint-disable-next-line import/prefer-default-export
export const validatePaginatedRequest = async (pagination: IPageableQuery): Promise<void> => {
    const validationErrors = processJoiValidationErrors(collectionSchema.validate(pagination));

    if (validationErrors.length > 0) {
        throw new CustomError(400, validationErrors, 'Pagination parameters are bad');
    }
};
