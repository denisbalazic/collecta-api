import { validateCollectionCreation, validateCollectionUpdate } from '../validations/collectionValidations';
import { ICollection, ICollectionModel } from '../domain/ICollection';
import Collection from '../models/collectionModel';

export const findCollections = async (): Promise<ICollection[]> => {
    return Collection.find();
};

export const createCollection = async (collection: ICollection): Promise<ICollection> => {
    await validateCollectionCreation(collection);
    const newCollection: ICollectionModel = new Collection(collection);
    return newCollection.save();
};

export const findCollection = async (id: string): Promise<ICollection> => {
    return Collection.findOne({ _id: id });
};

export const updateCollection = async (collection: ICollection, collectionId: string): Promise<ICollection> => {
    await validateCollectionUpdate(collection, collectionId);
    const foundCollection: ICollectionModel = await Collection.findOne({ _id: collectionId });
    return foundCollection.set(collection).save();
};

export const deleteCollection = async (id: string): Promise<ICollection> => {
    const collection = await Collection.findOne({ _id: id });
    return collection.deleteOne();
};
