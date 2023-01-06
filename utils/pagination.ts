import { Model } from 'mongoose';
import { FilterOperator, IFilter, IPageableQuery, IPageableResponse } from '../domain/response';
import { validatePaginatedRequest } from '../validations/paginationValidations';

export const parseFilters = (filters: string | undefined): IFilter[] => {
    const parsedFilters: IFilter[] = [];
    if (filters) {
        const filterArray = filters.split(';');
        filterArray.forEach((filter) => {
            const filterSplit = filter.split(':');
            const filterObject: IFilter = {
                property: filterSplit[0],
                value: filterSplit[1],
                operator: filterSplit[2] as FilterOperator,
            };
            parsedFilters.push(filterObject);
        });
    }
    return parsedFilters;
};

const mapFilters = (filters: IFilter[] | undefined): any => {
    const mappedFilters: any = {};
    if (filters && filters.length > 0) {
        filters.forEach((filter) => {
            mappedFilters[filter.property] = filter.value;
        });
    }
    return mappedFilters;
};

// eslint-disable-next-line import/prefer-default-export
export const getPaginatedResult = async <T>(
    model: Model<T>,
    pageableQuery: IPageableQuery
): Promise<IPageableResponse<T>> => {
    await validatePaginatedRequest<T>(pageableQuery, model);
    const page = pageableQuery.page ? parseInt(pageableQuery.page, 10) : 1;
    const size = pageableQuery.size ? parseInt(pageableQuery.size, 10) : 10;
    const sortObj = pageableQuery.sortBy ? { [pageableQuery.sortBy]: pageableQuery.sort || 1 } : {};

    const foundCollections: T[] = await model
        .find(mapFilters(pageableQuery.filters))
        .sort(sortObj)
        .skip((page - 1) * size)
        .limit(size)
        .exec();
    const numberOfElements = await model.find(mapFilters(pageableQuery.filters)).count();
    return {
        data: foundCollections,
        pagination: {
            page,
            size,
            numberOfElements,
        },
    };
};
