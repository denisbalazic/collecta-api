import mongoose from 'mongoose';

export interface ICollection {
    _id?: string;
    name: string;
}

export interface ICollectionModel extends mongoose.Document {
    _id: string;
    name: string;
}
