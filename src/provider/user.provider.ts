import { USER } from "../core/contants";
import type { PostUserModel, UpdateUserModel, UserModel, UserIdentity } from "../models/user.model";
import apiHandler from "./api.handler";

export const postUser = async (user: PostUserModel): Promise<UserModel> => {
  const data = await apiHandler.post<UserModel>(`/${USER}`, user);
  console.log('PostUser:', data);
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

export const getIdentities = async (): Promise<UserIdentity[]> => {
  const data = await apiHandler.get(`/${USER}/nim`);
  return data.data
}

export const getUserByIdentity = async (identityNumber: string): Promise<UserModel> => {
  const data = await apiHandler.post(`/${USER}/nim`, { nim: identityNumber });
  console.log(data)
  return data.data
}