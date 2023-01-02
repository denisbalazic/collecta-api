import express from 'express';
import { createItem, deleteItem, findItem, findItems, updateItem } from '../services/itemService';
import { authenticate } from '../middleware/auth';
import { IItem } from '../domain/item';
import { IPageableQuery, IPageableResponse } from '../domain/response';
import { parseFilters } from '../utils/pagination';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
    try {
        const query = { ...req.query, filters: parseFilters(req.query.filters as string) } as IPageableQuery;
        const foundItems: IPageableResponse<IItem> = await findItems(query);
        if (!foundItems) {
            res.status(404).send('There are no items with those parameters');
        }
        res.status(200).json(foundItems);
    } catch (err) {
        next(err);
    }
});

router.post('/', authenticate, async (req, res, next) => {
    try {
        const newItem: IItem = req.body;
        const createdItem: IItem = await createItem(newItem);
        res.status(201).json(createdItem);
    } catch (err) {
        next(err);
    }
});

router.get('/:itemId', async (req, res, next) => {
    try {
        const foundItem: IItem | null = await findItem(req.params.itemId);
        if (!foundItem) {
            res.status(404).send('There is no item with specified id');
        }
        res.status(200).json(foundItem);
    } catch (err) {
        next(err);
    }
});

router.put('/:itemId', authenticate, async (req, res, next) => {
    try {
        const updatedItem: IItem = await updateItem(req.body, req.params.itemId);
        res.status(200).json(updatedItem);
    } catch (err) {
        next(err);
    }
});

router.delete('/:itemId', authenticate, async (req, res, next) => {
    try {
        const deletedItem: IItem = await deleteItem(req.params.itemId);
        res.status(200).send(deletedItem);
    } catch (err) {
        next(err);
    }
});

export default router;
