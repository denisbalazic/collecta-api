import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/userModel';
import { IUser, IUserModel } from '../domain/IUser';
import { validateUserRegistration } from '../validations/userValidations';
import { CustomError } from '../utils/CustomError';
import { jwtSecret } from '../config';

export const generateAuthToken = async (user: IUserModel) => {
    const token: string = jwt.sign({ id: user._id, name: user.name }, jwtSecret as Secret, {
        expiresIn: 86400,
    });
    user.tokens.push(token);
    await user.save();
    return token;
};

export const register = async (user: IUser) => {
    await validateUserRegistration(user);
    const newUser: IUserModel = new User({
        ...user,
        password: user.password && bcrypt.hashSync(user.password, 8),
    });
    const createdUser: IUserModel = await newUser.save();
    return generateAuthToken(createdUser);
};

export const login = async (user: IUser) => {
    const foundUser: IUserModel | null = await User.findOne({ email: user.email });
    if (!foundUser) throw new CustomError('authentication', [{}], 'Wrong credentials');

    const isPasswordValid = user.password && bcrypt.compareSync(user.password, foundUser.password);
    if (!isPasswordValid) throw new CustomError('authentication', [{}], 'Wrong credentials');

    return generateAuthToken(foundUser);
};

export const logout = async (userId: string, token: string): Promise<void> => {
    const registredUser: IUserModel | null = await User.findOne({ _id: userId });
    if (registredUser) {
        registredUser.tokens = registredUser.tokens.filter((tok) => tok !== token);
        await registredUser.save();
    }
};

export const logoutAll = async (userId: string): Promise<void> => {
    const registredUser: IUserModel | null = await User.findOne({ _id: userId });
    if (registredUser) {
        registredUser.tokens = [];
        await registredUser.save();
    }
};
