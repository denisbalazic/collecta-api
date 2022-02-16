import express from 'express';
import { deleteUser, findUser, updateUser } from '../services/userService';
import { authenticate } from '../middleware/auth';
import { CustomError } from '../utils/CustomError';

const router = express.Router({ mergeParams: true });

router.get('/me', authenticate, async (req: any, res, next) => {
    try {
        const foundUser = await findUser(req.userId);
        if (!foundUser) {
            res.status(404).send('There is no user with specified id');
        }
        res.status(200).json(foundUser);
    } catch (err) {
        next(err);
    }
});

router.put('/me', authenticate, async (req: any, res, next) => {
    try {
        if (req.userId !== req.body._id) {
            throw new CustomError(403, [], 'Logged user id does not match update object id');
        }
        const updatedUser = await updateUser(req.body);
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
});

router.delete('/me', authenticate, async (req: any, res, next) => {
    try {
        const result = await deleteUser(req.userId);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

export default router;
