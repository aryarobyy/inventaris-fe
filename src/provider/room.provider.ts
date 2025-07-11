import { ROOM } from "../core/contants";
import type { PostRoomModel, UpdateRoomModel, RoomModel } from "../models/room.model";
import apiHandler from "./api.handler";

export const postRoom = async (room: PostRoomModel): Promise<RoomModel> => {
  const data = await apiHandler.post<RoomModel>(`/${ROOM}/`, room);
  return data.data;
};

export const getRoomById = async (id: number): Promise<RoomModel> => {
  const data = await apiHandler.get<RoomModel>(`/${ROOM}/${id}`);
  return data.data;
}

export const getRooms = async (): Promise<RoomModel[]> => {
  const data = await apiHandler.get<RoomModel[]>(`/${ROOM}/`);
  return data.data;
};

export const updateRoom = async (id: number, room: UpdateRoomModel): Promise<RoomModel> => {
  const data = await apiHandler.put<RoomModel>(`/${ROOM}/${id}`, room);
  return data.data;
};

export const deleteRoom = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${ROOM}/${id}`);
};