import express from 'express';
import { login, logout, logoutAll, register } from '../services/authService';
import { authenticate } from '../middleware/auth';

const router = express.Router({ mergeParams: true });

router.post('/register', async (req, res) => {
    try {
        const token = await register(req.body);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const token = await login(req.body);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/logout', authenticate, async (req: any, res) => {
    try {
        await logout(req.userId, req.token);
        res.status(200).json();
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/logout-all', authenticate, async (req: any, res) => {
    try {
        const result = await logoutAll(req.userId);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;
