import User from '../models/userModel';
import { IUser } from '../domain/user';
import { validatePasswordUpdate, validateUserUpdate } from '../validations/userValidations';
import { CustomError } from '../utils/CustomError';

export const findUser = async (id: string) => {
    return User.findOne({ _id: id });
};

export const updateUser = async (user: IUser) => {
    await validateUserUpdate(user);
    const foundUser = await User.findOne({ _id: user._id });
    if (!foundUser) {
        throw new CustomError(404, [{}], 'User not found');
    }
    return foundUser.set(user).save();
};

export const updatePassword = async (user: IUser) => {
    await validatePasswordUpdate(user);
    const foundUser = await User.findOne({ _id: user._id });
    if (!foundUser) {
        throw new CustomError(404, [{}], 'User not found');
    }
    return foundUser.set(user).save();
};

export const deleteUser = async (id: string) => {
    const user = await User.findOne({ _id: id });
    if (!user) {
        throw new CustomError(404, [{}], 'User not found');
    }
    return user.deleteOne();
};
