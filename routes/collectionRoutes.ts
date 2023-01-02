import express from 'express';
import {
    createCollection,
    deleteCollection,
    findCollection,
    findCollections,
    updateCollection,
} from '../services/collectionService';
import { authenticate } from '../middleware/auth';
import { ICollection } from '../domain/collection';
import { IPageableQuery, IPageableResponse } from '../domain/response';
import { parseFilters } from '../utils/pagination';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
    try {
        const query = { ...req.query, filters: parseFilters(req.query.filters as string) } as IPageableQuery;
        const foundCollections: IPageableResponse<ICollection> = await findCollections(query);
        if (!foundCollections) {
            res.status(404).send('There are no collections with those parameters');
        }
        res.status(200).json(foundCollections);
    } catch (err) {
        next(err);
    }
});

router.post('/', authenticate, async (req, res, next) => {
    try {
        const newCollection: ICollection = req.body;
        const createdCollection: ICollection = await createCollection(newCollection);
        res.status(201).json(createdCollection);
    } catch (err) {
        next(err);
    }
});

router.get('/:collectionId', async (req, res, next) => {
    try {
        const foundCollection: ICollection | null = await findCollection(req.params.collectionId);
        if (!foundCollection) {
            res.status(404).send('There is no collection with specified id');
        }
        res.status(200).json(foundCollection);
    } catch (err) {
        next(err);
    }
});

router.put('/:collectionId', authenticate, async (req, res, next) => {
    try {
        const updatedCollection: ICollection = await updateCollection(req.body, req.params.collectionId);
        res.status(200).json(updatedCollection);
    } catch (err) {
        next(err);
    }
});

router.delete('/:collectionId', authenticate, async (req, res, next) => {
    try {
        const deletedCollection: ICollection = await deleteCollection(req.params.collectionId);
        res.status(200).send(deletedCollection);
    } catch (err) {
        next(err);
    }
});

export default router;
