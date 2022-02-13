import joi from 'joi';
import joiPassword from 'joi-password';
import { processJoiValidationErrors } from '../utils/utils';
import { IUser, IUserModel } from '../domain/IUser';
import User from '../models/userModel';
import { CustomError } from '../utils/CustomError';
import { IResponseError } from '../domain/IResponse';

const paswordSchema = joiPassword
    .string()
    .min(8)
    .max(64)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces();

const userSchema = joi.object().keys({
    name: joi.string().alphanum().min(2).max(32).required(),
    email: joi.string().email().max(64).required(),
});

const registerUserSchema = userSchema.keys({
    password: paswordSchema.required(),
    confirmedPassword: joi.string().required(),
});

const updateUserSchema = userSchema.keys({
    _id: joi.string().alphanum().min(24).max(24).required(),
    oldPassword: joi.string(),
    password: paswordSchema,
    confirmedPassword: joi.string(),
});

const checkIfEmailExists = async (user: IUser): Promise<IResponseError | null> => {
    const foundUser = await User.findOne({ email: user.email });
    if ((!user._id && foundUser) || (user._id && foundUser && foundUser.id !== user._id)) {
        return {
            type: 'validations',
            field: 'email',
            message: 'User with the same email is already registered',
        };
    }
    return null;
};

const checkIfNameExists = async (user: IUser): Promise<IResponseError | null> => {
    const foundUser = await User.findOne({ name: user.name });
    if (foundUser) {
        return {
            type: 'validations',
            field: 'name',
            message: 'User with the same name is already registered',
        };
    }
    return null;
};

const checkIfPasswordsMatch = (user: IUser): IResponseError | null => {
    if (user.password && user.password !== user.confirmedPassword) {
        return {
            type: 'validations',
            field: 'confirmedPassword',
            message: 'Passwords do not match',
        };
    }
    return null;
};

const checkIfUserExists = async (user: IUser): Promise<IResponseError | null> => {
    const foundUser = await User.findOne({ _id: user._id });
    if (!foundUser) {
        return {
            type: 'validations',
            field: '_id',
            message: 'User with this id does not exist',
        };
    }
    return null;
};

// TODO: Check if old password is correct

async function validateCommon(user: IUser, validationErrors: IResponseError[]) {
    const emailValidationErr = await checkIfEmailExists(user);
    if (emailValidationErr) validationErrors.push(emailValidationErr);

    const nameValidationErr = await checkIfNameExists(user);
    if (nameValidationErr) validationErrors.push(nameValidationErr);

    const passwordValidationErr = await checkIfPasswordsMatch(user);
    if (passwordValidationErr) validationErrors.push(passwordValidationErr);

    if (validationErrors.length > 0) {
        throw new CustomError('validations', validationErrors, '');
    }
}

export const validateUserRegistration = async (user: IUser): Promise<void> => {
    const validationErrors = processJoiValidationErrors(registerUserSchema.validate(user));

    await validateCommon(user, validationErrors);
};

export const validateUserUpdate = async (user: IUser): Promise<void> => {
    const validationErrors = processJoiValidationErrors(updateUserSchema.validate(user));

    const existenceValidationErr = await checkIfUserExists(user);
    if (existenceValidationErr) validationErrors.push(existenceValidationErr);

    await validateCommon(user, validationErrors);
};
