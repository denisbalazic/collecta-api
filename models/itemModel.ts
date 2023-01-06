import mongoose from 'mongoose';
import { IItem, IItemProperty } from '../domain/item';

export const propertySchema = new mongoose.Schema<IItemProperty>({
    itemPropertyId: {
        type: String,
        required: true,
    },
    value: {
        type: String,
    },
});

const itemSchema = new mongoose.Schema<IItem>(
    {
        collectionId: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
            trim: true,
        },
        properties: {
            type: [propertySchema],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IItem>('Item', itemSchema);
