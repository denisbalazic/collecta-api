import Joi from 'joi';
import { Model } from 'mongoose';
import { processJoiValidationErrors } from '../utils/utils';
import { CustomError } from '../utils/CustomError';
import { FilterOperator, IFilter, IPageableQuery, SortDirection } from '../domain/response';

const collectionSchema = Joi.object().keys({
    page: Joi.number().min(1).required(),
    size: Joi.number().min(1).max(100).required(),
    sort: Joi.string().valid(...Object.values(SortDirection)),
    sortBy: Joi.string().min(2).max(32),
    filters: Joi.array().items({
        property: Joi.string().min(2).max(24),
        value: Joi.string(),
        operator: Joi.string().valid(...Object.values(FilterOperator)),
    }),
});

const checkFiltersForCollection = async <T>(filters: IFilter[], model: Model<T>) => {
    const nonExistingFields: string[] = [];
    filters.forEach((filter) => {
        // check for model fields
        if (!model.schema.path(filter.property)) {
            nonExistingFields.push(filter.property);
        }
    });

    if (nonExistingFields.length > 0) {
        return {
            field: 'filters',
            message: `Filters for non existing fields found: ${nonExistingFields.join(', ')}`,
        };
    }
    return null;
};

// eslint-disable-next-line import/prefer-default-export
export const validatePaginatedRequest = async <T>(pagination: IPageableQuery, model: Model<T>): Promise<void> => {
    const validationErrors = processJoiValidationErrors(collectionSchema.validate(pagination));

    const filtersErr = pagination.filters && (await checkFiltersForCollection(pagination.filters, model));
    if (filtersErr) validationErrors.push(filtersErr);

    if (validationErrors.length > 0) {
        throw new CustomError(400, validationErrors, 'Pagination parameters are bad');
    }
};
