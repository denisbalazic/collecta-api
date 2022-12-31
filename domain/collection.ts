import mongoose from 'mongoose';
import { IWithTimeStamp } from './mongo';

export enum CollectionType {
    COMIC = 'COMIC',
    STICKER = 'STICKER',
    CARD = 'CARD',
    FIGURE = 'FIGURE',
    OTHER = 'OTHER',
}

export enum CollectionVisibility {
    PUBLIC = 'PUBLIC',
    GROUP = 'GROUP',
    PRIVATE = 'PRIVATE',
}

export enum ItemPropertyType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    YEAR = 'YEAR',
}

export interface IItemProperty {
    label: string;
    type: ItemPropertyType;
    required?: boolean;
    unique?: boolean;
    value?: string | number;
}

export interface ICollection extends IWithTimeStamp {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    type: CollectionType;
    visibility: CollectionVisibility;
    admins: string[];
    openItemUpdating: boolean;
    itemProperties: IItemProperty[];
}

export type ICollectionModel = ICollection & mongoose.Document;
