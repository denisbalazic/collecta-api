import { Model } from 'mongoose';
import { IPageableQuery, IPageableResponse } from '../domain/response';
import { validatePaginatedRequest } from '../validations/paginationValidations';
import { ICollection } from '../domain/collection';

// eslint-disable-next-line import/prefer-default-export
export const getPaginatedResult = async (
    model: Model<ICollection>,
    pageableQuery: IPageableQuery
): Promise<IPageableResponse<ICollection>> => {
    await validatePaginatedRequest(pageableQuery);
    const page = pageableQuery.page ? parseInt(pageableQuery.page, 10) : 1;
    const size = pageableQuery.size ? parseInt(pageableQuery.size, 10) : 10;
    const foundCollections = await model
        .find()
        .skip((page - 1) * size)
        .limit(size)
        .exec();
    const numberOfElements = await model.count();
    return {
        data: foundCollections,
        pagination: {
            page,
            size,
            numberOfElements,
        },
    };
};
