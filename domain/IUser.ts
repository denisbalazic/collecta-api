import * as mongoose from 'mongoose';

export interface IUserModel extends mongoose.Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    tokens: string[];
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    confirmedPassword?: string;
    oldPassword?: string;
}
