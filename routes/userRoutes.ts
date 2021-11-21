import express from 'express';
import { createUser, deleteUser, findUser, updateUser } from '../services/userService';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const newUser = req.body;
    const createdUser = await createUser(newUser);
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const foundUser = await findUser(req.params.userId);
    if (!foundUser) {
      res.status(404).send('There is no user with specified id');
    }
    res.status(200).json(foundUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await updateUser(req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const result = await deleteUser(req.params.userId);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
