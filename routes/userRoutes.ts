import express from 'express';
import userService from '../services/userService';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const newUser = req.body;
    const createdUser = await userService.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
