import Joi from 'joi';
import { Collection } from 'mongoose';
import { processJoiValidationErrors } from '../utils/utils';
import { IItem } from '../domain/item';
import { CustomError } from '../utils/CustomError';
import { IItemProperty, ItemPropertyType } from '../domain/collection';

const itemSchema = Joi.object().keys({
    collectionId: Joi.string().alphanum().min(24).max(24).required(),
    image: Joi.string().uri(),
    properties: Joi.array()
        .items({
            label: Joi.string().min(2).max(24).required(),
            type: Joi.string()
                .valid(...Object.values(ItemPropertyType))
                .required(),
            // TODO: Add validation for value
            value: Joi.string().required(),
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
    item.properties.forEach((p: IItemProperty) => {
        const propertyExists = collection?.itemProperties.find(
            (c: IItemProperty) => c.label === p.label && c.type === p.type
        );
        if (!propertyExists) {
            return {
                field: p.label,
                message: `Property ${p.label} is not valid for items in this collection`,
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
