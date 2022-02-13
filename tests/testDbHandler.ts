import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let connection: any;
let mongoServer: MongoMemoryServer;

export const connectToDatabase = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();
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
