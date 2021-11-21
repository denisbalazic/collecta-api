import User from '../models/userModel';
import { IUser } from '../domain/IUser';
import { validateUserCreation, validateUserUpdate } from '../validations/userValidations';

export const createUser = async (user: IUser) => {
  await validateUserCreation(user);
  const newUser = new User(user);
  return newUser.save();
};

export const findUser = async (id: string) => {
  return User.findOne({ _id: id });
};

export const updateUser = async (user: IUser) => {
  await validateUserUpdate(user);
  const foundUser = await User.findOne({ _id: user._id });
  return foundUser.set(user).save();
};

export const deleteUser = async (id: string) => {
  const user = await User.findOne({ _id: id });
  return user.deleteOne();
};
