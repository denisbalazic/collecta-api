import Joi from 'joi';
import User from '../models/user';
import { IUser } from '../domain/IUser';

const userSchema = Joi.object().keys({
  firstName: Joi.string().alphanum().min(2).max(24).required(),
  lastName: Joi.string().alphanum().min(2).max(24).required(),
  nickname: Joi.string().alphanum().min(2).max(24).required(),
  email: Joi.string().email().required(),
});

const userCreateSchema = userSchema.keys({
  password: Joi.string().alphanum().min(8).max(24).required(),
});

const userUpdateSchema = userSchema.keys({
  _id: Joi.string().alphanum().min(24).max(24).required(),
});

const userService = {
  createUser: async (user: IUser) => {
    const result = userCreateSchema.validate(user);
    if (result.error) {
      return result.error;
    }
    const newUser = new User(user);
    return newUser.save();
  },
  findUser: async (id: string) => {
    return User.findOne({ _id: id });
  },
  updateUser: async (user: IUser) => {
    const result = userUpdateSchema.validate(user);
    if (result.error) {
      return result.error;
    }
    const foundUser = await User.findOne({ _id: user._id });
    return foundUser.set(user).save();
  },
  deleteUser: async (id: string) => {
    const user = await User.findOne({ _id: id });
    return user.deleteOne();
  },
};

export default userService;
