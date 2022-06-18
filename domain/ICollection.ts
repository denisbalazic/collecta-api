import mongoose from 'mongoose';
import { IWithTimeStamp } from './IMongo';

export interface ICollection extends IWithTimeStamp {
    _id?: string;
    name: string;
}

export interface ICollectionModel extends mongoose.Document {
    _id: string;
    name: string;
}
