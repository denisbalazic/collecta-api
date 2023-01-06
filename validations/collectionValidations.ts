import Joi from 'joi';
import { processJoiValidationErrors } from '../utils/utils';
import { CollectionType, CollectionVisibility, ICollection, ItemPropertyType } from '../domain/collection';
import Collection from '../models/collectionModel';
import { CustomError } from '../utils/CustomError';

const collectionSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(24).required(),
    description: Joi.string().min(2).max(720),
    image: Joi.string().uri(),
    type: Joi.string()
        .valid(...Object.values(CollectionType))
        .required(),
    visibility: Joi.string()
        .valid(...Object.values(CollectionVisibility))
        .required(),
    admins: Joi.array().items(Joi.string().alphanum().min(24).max(24)).required(),
    openItemUpdating: Joi.boolean().required(),
    itemProperties: Joi.array()
        .items({
            _id: Joi.string().alphanum().min(24).max(24),
            label: Joi.string().min(2).max(24).required(),
            type: Joi.string()
                .valid(...Object.values(ItemPropertyType))
                .required(),
            required: Joi.boolean(),
            unique: Joi.boolean(),
            options: Joi.array().items(Joi.string().min(2).max(24)),
        })
        .required(),
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

const checkForItemPropertyLabelDuplicates = async (collection: ICollection) => {
    const duplicateLabels = collection.itemProperties?.map((p) => p.label).filter((p, i, arr) => arr.indexOf(p) !== i);
    if (duplicateLabels?.length > 0) {
        return {
            field: 'itemProperties',
            message: `Duplicate item property labels found: ${duplicateLabels.join(', ')}`,
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

    const duplicateItemPropertyLabelsErr = await checkForItemPropertyLabelDuplicates(collection);
    if (duplicateItemPropertyLabelsErr) validationErrors.push(duplicateItemPropertyLabelsErr);

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

    const duplicateItemPropertyLabelsErr = await checkForItemPropertyLabelDuplicates(collection);
    if (duplicateItemPropertyLabelsErr) validationErrors.push(duplicateItemPropertyLabelsErr);

    if (validationErrors.length > 0) {
        throw new CustomError(400, validationErrors, '');
    }
};
