import mongoose, { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ICollection } from '../domain/ICollection';
import { ITestCredentials, ITestUser, IUser } from '../domain/IUser';
import userModel from '../models/userModel';
import { authedUser, user } from './dbSeeds';

let connection: any;
let mongoServer: MongoMemoryServer;

export const connectToDatabase = async (): Promise<void> => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = await mongoose.connect(uri, {});
};

export const closeDatabase = async (): Promise<void> => {
    if (connection) {
        await connection.connection.db.dropDatabase();
        await connection.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
};

export const clearDatabase = async (): Promise<void> => {
    if (connection) {
        await connection.connection.db.dropDatabase();
    }
};

export const seedDatabase = async (
    model: Model<any>,
    collection: ICollection[] | IUser[] | ITestUser[]
): Promise<void> => {
    if (connection) {
        await model.insertMany(collection);
    }
};

export const authenticateTestUser = async (): Promise<string> => {
    if (connection) {
        await userModel.create(authedUser.user);
    }
    return authedUser.credentials.tokens[0];
};
