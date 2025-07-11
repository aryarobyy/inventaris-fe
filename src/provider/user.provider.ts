import { USER } from "../core/contants";
import type { PostUserModel, UpdateUserModel, UserModel } from "../models/user.model";
import apiHandler from "./api.handler";

export const postUser = async (user: PostUserModel): Promise<UserModel> => {
  const data = await apiHandler.post<UserModel>(`/${USER}/`, user);
  return data.data;
};

export const getUserById = async (id: number): Promise<UserModel> => {
  const data = await apiHandler.get<UserModel>(`/${USER}/${id}`);
  return data.data;
};

export const getUsers = async (): Promise<UserModel[]> => {
  const data = await apiHandler.get<UserModel[]>(`/${USER}/`);
  return data.data;
};

export const updateUser = async (id: number, user: UpdateUserModel): Promise<UserModel> => {
  const data = await apiHandler.put<UserModel>(`/${USER}/${id}`, user);
  return data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${USER}/${id}`);
};