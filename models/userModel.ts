import mongoose from 'mongoose';
import { IUserModel } from '../domain/user';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        tokens: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.methods.toJSON = function () {
    const userObj = this.toObject();
    delete userObj.password;
    delete userObj.tokens;
    return userObj;
};

export default mongoose.model<IUserModel>('User', userSchema);
