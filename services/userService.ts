import User from '../models/userModel';
import { IUser } from '../domain/IUser';
import { validateUserRegistration, validateUserUpdate } from '../validations/userValidations';
import { CustomError } from '../utils/CustomError';

export const createUser = async (user: IUser) => {
    await validateUserRegistration(user);
    const newUser = new User(user);
    return newUser.save();
};

export const findUser = async (id: string) => {
    return User.findOne({ _id: id });
};

export const updateUser = async (user: IUser) => {
    await validateUserUpdate(user);
    const foundUser = await User.findOne({ _id: user._id });
    if (!foundUser) {
        throw new CustomError('notFound', [{}], 'User not found');
    }
    return foundUser.set(user).save();
};

export const deleteUser = async (id: string) => {
    const user = await User.findOne({ _id: id });
    if (!user) {
        throw new CustomError('notFound', [{}], 'User not found');
    }
    return user.deleteOne();
};
