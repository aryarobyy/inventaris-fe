import { Role } from "./enums";

export interface AdminModel {
  id: number;
  username: string;
  name: string;
  password: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface PostAdminModel {
  username: string;
  name: string;
  password: string;
}

export interface UpdateAdminModel {
  username?: string;
  name?: string;
  password?: string;
  status?: boolean;
  role?: Role;
}