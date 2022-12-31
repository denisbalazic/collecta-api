import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { CustomError } from '../utils/CustomError';
import { IUserModel } from '../domain/user';
import { jwtSecret } from '../config';

// eslint-disable-next-line import/prefer-default-export
export const authenticate = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { id } = jwt.verify(token, jwtSecret as Secret);
            const user: IUserModel | null = await User.findOne({ _id: id, tokens: token });
            if (!user) {
                throw new CustomError(401, [{}], 'You need to be logged in');
            }
            req.token = token;
            req.userId = user.id;
            next();
        } else {
            throw new CustomError(401, [{}], 'You need to be logged in');
        }
    } catch (err) {
        req.token = undefined;
        next(err);
    }
};
