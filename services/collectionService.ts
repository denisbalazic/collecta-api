import { validateCollectionCreation, validateCollectionUpdate } from '../validations/collectionValidations';
import { ICollection } from '../domain/ICollection';
import Collection from '../models/collectionModel';

export const findCollections = async () => {
    return Collection.find();
};

export const createCollection = async (collection: ICollection) => {
    await validateCollectionCreation(collection);
    const newCollection = new Collection(collection);
    return newCollection.save();
};

export const findCollection = async (id: string) => {
    return Collection.findOne({ _id: id });
};

export const updateCollection = async (collection: ICollection, collectionId: string) => {
    await validateCollectionUpdate(collection, collectionId);
    const foundCollection = await Collection.findOne({ _id: collectionId });
    return foundCollection.set(collection).save();
};

export const deleteCollection = async (id: string) => {
    const collection = await Collection.findOne({ _id: id });
    return collection.deleteOne();
};
