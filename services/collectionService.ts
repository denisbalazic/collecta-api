import { validateCollectionCreation, validateCollectionUpdate } from '../validations/collectionValidations';
import { ICollection, ICollectionModel } from '../domain/ICollection';
import Collection from '../models/collectionModel';
import { CustomError } from '../utils/CustomError';
import { IPageableQuery, IPageableResponse } from '../domain/IResponse';
import { getPaginatedResult } from '../utils/pagination';

export const findCollections = async (pageable: IPageableQuery): Promise<IPageableResponse<ICollection>> => {
    return getPaginatedResult(Collection, pageable);
};

export const createCollection = async (collection: ICollection): Promise<ICollection> => {
    await validateCollectionCreation(collection);
    const newCollection: ICollectionModel = new Collection(collection);
    return newCollection.save();
};

export const findCollection = async (id: string): Promise<ICollection> => {
    const foundCollection: ICollectionModel = await Collection.findOne({ _id: id });
    if (!foundCollection) throw new CustomError(404, [], 'Resource not found');
    return Collection.findOne({ _id: id });
};

export const updateCollection = async (collection: ICollection, id: string): Promise<ICollection> => {
    await validateCollectionUpdate(collection, id);
    const foundCollection: ICollectionModel = await Collection.findOne({ _id: id });
    if (!foundCollection) throw new CustomError(404, [], 'Resource not found');
    return foundCollection.set(collection).save();
};

export const deleteCollection = async (id: string): Promise<ICollection> => {
    const foundCollection = await Collection.findOne({ _id: id });
    if (!foundCollection) throw new CustomError(404, [], 'Resource not found');
    return foundCollection.deleteOne();
};
