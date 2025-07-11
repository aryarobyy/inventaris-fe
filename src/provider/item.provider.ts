import { ITEM } from "../core/contants";
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
  return data.data;
};

export const updateItem = async (id: number, item: UpdateItemModel): Promise<ItemModel> => {
  const data = await apiHandler.put<ItemModel>(`/${ITEM}/${id}`, item);
  return data.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${ITEM}/${id}`);
};