import Joi from 'joi';
import { processJoiValidationErrors } from '../utils/utils';
import { ICollection } from '../domain/ICollection';
import Collection from '../models/collectionModel';
import { CustomError } from '../utils/CustomError';

const collectionSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(24).required(),
});

const updateCollectionSchema = collectionSchema.keys({
    _id: Joi.string().alphanum().min(24).max(24),
});

const checkIfNameExists = async (collection: ICollection, collectionId: string | null) => {
    const foundCollection = await Collection.findOne({ name: collection.name });
    if (foundCollection && foundCollection._id.toString() !== collectionId) {
        return {
            field: 'name',
            message: 'Collection with the same name already exists',
        };
    }
    return null;
};

const checkIdEquality = async (collection: ICollection, collectionId: string) => {
    if (collection._id && collection._id !== collectionId) {
        return {
            field: '_id',
            message: 'Id in URI does not match id in body',
        };
    }
    return null;
};

export const validateCollectionCreation = async (collection: ICollection): Promise<void> => {
    const validationErrors = processJoiValidationErrors(collectionSchema.validate(collection));

    const nameExistsErr = await checkIfNameExists(collection, null);
    if (nameExistsErr) validationErrors.push(nameExistsErr);

    if (validationErrors.length > 0) {
        throw new CustomError(400, validationErrors, 'Validation failed for user creation');
    }
};

export const validateCollectionUpdate = async (collection: ICollection, collectionId: string): Promise<void> => {
    const validationErrors = processJoiValidationErrors(updateCollectionSchema.validate(collection));

    const nameExistsErr = await checkIfNameExists(collection, collectionId);
    if (nameExistsErr) validationErrors.push(nameExistsErr);

    const idEqualityErr = await checkIdEquality(collection, collectionId);
    if (idEqualityErr) validationErrors.push(idEqualityErr);

    if (validationErrors.length > 0) {
        throw new CustomError(400, validationErrors, '');
    }
};
