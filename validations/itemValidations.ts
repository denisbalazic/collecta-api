import Joi from 'joi';
import Collection from '../models/collectionModel';
import { processJoiValidationErrors } from '../utils/utils';
import { IItem, IItemProperty } from '../domain/item';
import { CustomError } from '../utils/CustomError';
import { IItemPropertySchema } from '../domain/collection';

const itemSchema = Joi.object().keys({
    collectionId: Joi.string().alphanum().min(24).max(24).required(),
    image: Joi.string().uri(),
    properties: Joi.array()
        .items({
            itemPropertyId: Joi.string().min(2).max(24).required(),
            // TODO: Add validation for value; can be string, number or boolean
            value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()),
        })
        .required(),
});

const updateItemSchema = itemSchema.keys({
    _id: Joi.string().alphanum().min(24).max(24),
});

const checkIdEquality = async (item: IItem, itemId: string) => {
    if (item._id && item._id !== itemId) {
        return {
            field: '_id',
            message: 'Id in URI does not match id in body',
        };
    }
    return null;
};

const checkIfItemPropertiesExistInCollection = async (item: IItem) => {
    const collection = await Collection.findOne({ _id: item.collectionId });
    // eslint-disable-next-line consistent-return
    item.properties?.forEach((p: IItemProperty) => {
        const propertyExists = collection?.itemProperties.find((c: IItemPropertySchema) => c._id === p.itemPropertyId);
        if (!propertyExists) {
            return {
                field: p.itemPropertyId,
                message: `Property with id '${p.itemPropertyId}' and value '${p.value}' is not valid for items in this collection`,
            };
        }
    });
    return null;
};

export const validateItemCreation = async (item: IItem): Promise<void> => {
    const validationErrors = processJoiValidationErrors(itemSchema.validate(item));

    if (validationErrors.length > 0) {
        throw new CustomError(400, validationErrors, 'Validation failed for user creation');
    }
};

export const validateItemUpdate = async (item: IItem, itemId: string): Promise<void> => {
    const validationErrors = processJoiValidationErrors(updateItemSchema.validate(item));

    const idEqualityErr = await checkIdEquality(item, itemId);
    if (idEqualityErr) validationErrors.push(idEqualityErr);

    const propertiesErr = await checkIfItemPropertiesExistInCollection(item);
    if (propertiesErr) validationErrors.push(propertiesErr);

    if (validationErrors.length > 0) {
        throw new CustomError(400, validationErrors, '');
    }
};
