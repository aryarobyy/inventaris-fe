import { ITEM } from "../core/contants";
import type { ItemCategory } from "../models/enums";
import type { ItemModel, PostItemModel, UpdateItemModel } from "../models/item.model";
import apiHandler from "./api.handler";

export const postItem = async (item: PostItemModel): Promise<ItemModel> => {
  const data = await apiHandler.post<ItemModel>(`/${ITEM}/`, item);
  return data.data;
};

export const getItemById = async (id: number): Promise<ItemModel> => {
  const data = await apiHandler.get<ItemModel>(`/${ITEM}/${id}`);
  return data.data;
}

export const getItems = async (): Promise<ItemModel[]> => {
  const data = await apiHandler.get<ItemModel[]>(`/${ITEM}/`);
  return data.data.data.data;
};

export const updateItem = async (id: number, item: UpdateItemModel): Promise<ItemModel> => {
  const data = await apiHandler.put<ItemModel>(`/${ITEM}/${id}`, item);
  return data.data.data.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${ITEM}/${id}`);
};

export const getItemByCat = async (cat: ItemCategory): Promise<ItemModel[]> => {
  const data = await apiHandler.get(`/${ITEM}/category/${cat}`);
  return data.data.data.data
}