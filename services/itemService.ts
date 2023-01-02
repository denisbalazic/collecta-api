import { IItem, IItemModel } from '../domain/item';
import Item from '../models/itemModel';
import { CustomError } from '../utils/CustomError';
import { IPageableQuery, IPageableResponse } from '../domain/response';
import { getPaginatedResult } from '../utils/pagination';
import { removeTimeStamp } from '../utils/utils';
import { validateItemCreation, validateItemUpdate } from '../validations/itemValidations';

export const findItems = async (query: IPageableQuery): Promise<IPageableResponse<IItem>> => {
    return getPaginatedResult<IItem>(Item, query);
};

export const createItem = async (item: IItem): Promise<IItem> => {
    await validateItemCreation(item);
    const newItem: IItemModel = new Item(item);
    return newItem.save();
};

export const findItem = async (id: string): Promise<IItem | null> => {
    const foundItem: IItemModel | null = await Item.findOne({ _id: id });
    if (!foundItem) throw new CustomError(404, [], 'Resource not found');
    return Item.findOne({ _id: id });
};

export const updateItem = async (item: IItem, id: string): Promise<IItem> => {
    await validateItemUpdate(removeTimeStamp<IItem>(item), id);
    const foundItem: IItemModel | null = await Item.findOne({ _id: id });
    if (!foundItem) throw new CustomError(404, [], 'Resource not found');
    return foundItem.set(item).save();
};

export const deleteItem = async (id: string): Promise<IItem> => {
    const foundItem = await Item.findOne({ _id: id });
    if (!foundItem) throw new CustomError(404, [], 'Resource not found');
    return foundItem.deleteOne();
};
