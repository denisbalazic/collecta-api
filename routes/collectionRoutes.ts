import express from 'express';
import {
    createCollection,
    deleteCollection,
    findCollection,
    findCollections,
    updateCollection,
} from '../services/collectionService';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
    try {
        const foundCollections = await findCollections();
        if (!foundCollections) {
            res.status(404).send('There are no collections with those parameters');
        }
        res.status(200).json(foundCollections);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const newCollection = req.body;
        const createdCollection = await createCollection(newCollection);
        res.status(201).json(createdCollection);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:collectionId', async (req, res) => {
    try {
        const foundCollection = await findCollection(req.params.collectionId);
        if (!foundCollection) {
            res.status(404).send('There is no collection with specified id');
        }
        res.status(200).json(foundCollection);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:collectionId', async (req, res) => {
    try {
        const updatedCollection = await updateCollection(req.body, req.params.collectionId);
        res.status(200).json(updatedCollection);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:collectionId', async (req, res) => {
    try {
        const result = await deleteCollection(req.params.collectionId);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;
