import mongoose from 'mongoose';
import { IWithTimeStamp } from './mongo';

export interface IItemProperty {
    itemPropertyId: string;
    value?: string | number | boolean;
}

export interface IItem extends IWithTimeStamp {
    _id?: string;
    collectionId: string;
    image: string;
    properties: IItemProperty[];
}

export type IItemModel = IItem & mongoose.Document;
