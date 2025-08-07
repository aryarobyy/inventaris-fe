import { ADMIN } from "../core/contants";
import type { PostAdminModel, UpdateAdminModel, AdminModel, LoginAdminModel } from "../models/admin.model";
import apiHandler from "./api.handler";

export const postAdmin = async (admin: PostAdminModel): Promise<AdminModel> => {
  const data = await apiHandler.post<AdminModel>(`/${ADMIN}/`, admin);
  return data.data;
};

export const loginAdmin = async (admin: LoginAdminModel): Promise<AdminModel> => {
  const data = await apiHandler.post<AdminModel>(`/${ADMIN}/login`, admin);
  return data.data;
};

export const getAdminById = async (id: number): Promise<AdminModel> => {
  const data = await apiHandler.get<AdminModel>(`/${ADMIN}/${id}`);
  return data.data;
};

export const getAdmins = async (): Promise<AdminModel[]> => {
  const data = await apiHandler.get<AdminModel[]>(`/${ADMIN}/`);
  return data.data;
};

export const updateAdmin = async (id: number, admin: UpdateAdminModel): Promise<AdminModel> => {
  const data = await apiHandler.put<AdminModel>(`/${ADMIN}/${id}`, admin);
  return data.data;
};

export const deleteAdmin = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${ADMIN}/${id}`);
};