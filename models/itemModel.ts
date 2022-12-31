import mongoose from 'mongoose';
import { IItem } from '../domain/item';
import { itemPropertySchema } from './collectionModel';

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
            type: [itemPropertySchema],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IItem>('Item', itemSchema);
