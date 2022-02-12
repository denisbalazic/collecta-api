import Joi from 'joi';
import { processJoiValidationErrors } from '../utils/utils';
import { ICollection } from '../domain/ICollection';
import Collection from '../models/collectionModel';
import { CustomError } from '../utils/CustomError';

const collectionSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(24).required(),
});

const createCollectionSchema = collectionSchema.keys({
    password: Joi.string().alphanum().min(8).max(24).required(),
});

const updateCollectionSchema = collectionSchema.keys({
    _id: Joi.string().alphanum().min(24).max(24).required(),
});

const checkIfNameExists = async (collection: ICollection) => {
    const foundCollection = await Collection.findOne({ name: collection.name });
    if (foundCollection) {
        throw new CustomError(
            'validations',
            [{ type: 'validations', field: 'name', message: 'Collection with the same name already exists' }],
            ''
        );
    }
};

const checkIdEquality = async (collection: ICollection, collectionId: string) => {
    if (collection._id && collection._id !== collectionId) {
        throw new CustomError(
            'validations',
            [{ type: 'validations', field: '_id', message: 'Id in URI doesnt match id in body' }],
            ''
        );
    }
};

export const validateCollectionCreation = async (collection: ICollection): Promise<void> => {
    processJoiValidationErrors(createCollectionSchema.validate(collection));
    await checkIfNameExists(collection);
};
export const validateCollectionUpdate = async (collection: ICollection, collectionId: string): Promise<void> => {
    processJoiValidationErrors(updateCollectionSchema.validate(collection));
    await checkIdEquality(collection, collectionId);
    await checkIfNameExists(collection);
};
