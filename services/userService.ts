import Joi from 'joi';
import User from '../models/user';
import { IUser } from '../domain/IUser';

const userCreateSchema = Joi.object().keys({
  firstName: Joi.string().alphanum().min(2).max(24).required(),
  lastName: Joi.string().alphanum().min(2).max(24).required(),
  nickname: Joi.string().alphanum().min(2).max(24).required(),
  password: Joi.string().alphanum().min(8).max(24).required(),
  email: Joi.string().email().required(),
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
};

export default userService;
