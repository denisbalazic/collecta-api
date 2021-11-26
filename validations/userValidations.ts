import Joi from 'joi';
import { processJoiValidationErrors } from '../utils/utils';
import { IUser } from '../domain/IUser';
import User from '../models/userModel';
import { CustomError } from '../utils/CustomError';

const userSchema = Joi.object().keys({
    firstName: Joi.string().alphanum().min(2).max(24).required(),
    lastName: Joi.string().alphanum().min(2).max(24).required(),
    nickname: Joi.string().alphanum().min(2).max(24).required(),
    email: Joi.string().email().required(),
});

const createUserSchema = userSchema.keys({
    password: Joi.string().alphanum().min(8).max(24).required(),
});

const updateUserSchema = userSchema.keys({
    _id: Joi.string().alphanum().min(24).max(24).required(),
});

const checkIfEmailExists = async (user: IUser) => {
    const foundUser = await User.findOne({ email: user.email });
    if (foundUser) {
        throw new CustomError(
            'validations',
            [{ type: 'validations', field: 'email', message: 'User with the same email is already registered' }],
            ''
        );
    }
};

export const validateUserCreation = async (user: IUser): Promise<void> => {
    processJoiValidationErrors(createUserSchema.validate(user));
    await checkIfEmailExists(user);
};

export const validateUserUpdate = async (user: IUser): Promise<void> => {
    processJoiValidationErrors(updateUserSchema.validate(user));
    await checkIfEmailExists(user);
};
