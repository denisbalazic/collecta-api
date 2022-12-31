import mongoose from 'mongoose';
import { IWithTimeStamp } from './mongo';
import { IItemProperty } from './collection';

export interface IItem extends IWithTimeStamp {
    _id?: string;
    collectionId: string;
    image: string;
    properties: IItemProperty[];
}

export type IItemModel = IItem & mongoose.Document;
