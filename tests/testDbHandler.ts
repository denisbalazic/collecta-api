import mongoose, { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ICollection } from '../domain/ICollection';
import { ITestUser, IUser } from '../domain/IUser';
import userModel from '../models/userModel';

let connection: any;
let mongoServer: MongoMemoryServer;

export const connectToDatabase = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = await mongoose.connect(uri, {});
};

export const closeDatabase = async () => {
    if (connection) {
        await connection.connection.db.dropDatabase();
        await connection.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
};

export const clearDatabase = async () => {
    if (connection) {
        await connection.connection.db.dropDatabase();
    }
};

export const seedDatabase = async (model: Model<any>, collection: ICollection[] | IUser[] | ITestUser[]) => {
    if (connection) {
        await model.insertMany(collection);
    }
};

export const authenticateTestUser = async (): Promise<{ email: string; password: string; token: string }> => {
    const authDetails = {
        email: 'testuser@test.com',
        password: 'Password1!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGRmNGVmMThiMTc0YzRiYTZiYjk4MyIsIm5hbWUiOiJURVNUIiwiaWF0IjoxNjQ1MjU4MTkzLCJleHAiOjE2NDUzNDQ1OTN9.r5oL2TU3K3PMeDegUa4YYtvFF_tffn0gsSk6rpouECw',
    };

    if (connection) {
        await userModel.create({
            _id: '620df4ef18b174c4ba6bb983',
            name: 'TEST',
            email: 'testuser@test.com',
            password: '$2b$08$JvCi3hvvt3qgiFjZK3II8.YcB4UyoTBW/3KfliqyASO186UJCGNQm',
            tokens: [authDetails.token],
        });
    }
    return authDetails;
};
