import express from 'express';
import { login, logout, logoutAll, register } from '../services/authService';
import { authenticate } from '../middleware/auth';

const router = express.Router({ mergeParams: true });

router.post('/register', async (req, res, next) => {
    try {
        const token = await register(req.body);
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const token = await login(req.body);
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
});

router.post('/logout', authenticate, async (req: any, res, next) => {
    try {
        await logout(req.userId, req.token);
        res.status(200).json();
    } catch (err) {
        next(err);
    }
});

router.post('/logout-all', authenticate, async (req: any, res, next) => {
    try {
        const result = await logoutAll(req.userId);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

export default router;
