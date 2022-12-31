import mongoose from 'mongoose';
import {
    CollectionType,
    CollectionVisibility,
    ICollection,
    IItemProperty,
    ItemPropertyType,
} from '../domain/collection';

export const itemPropertySchema = new mongoose.Schema<IItemProperty>(
    {
        label: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 24,
        },
        type: {
            type: String,
            required: true,
            enum: ItemPropertyType,
        },
        required: {
            type: Boolean,
            required: false,
            default: false,
        },
        unique: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { _id: false }
);

const collectionSchema = new mongoose.Schema<ICollection>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 24,
        },
        description: {
            type: String,
            required: false,
            trim: true,
            minlength: 2,
            maxlength: 720,
        },
        image: {
            type: String,
            required: false,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: CollectionType,
        },
        visibility: {
            type: String,
            required: true,
            enum: CollectionVisibility,
        },
        admins: {
            type: [String],
            required: true,
        },
        openItemUpdating: {
            type: Boolean,
            required: true,
        },
        itemProperties: {
            type: [itemPropertySchema],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICollection>('Collection', collectionSchema);
