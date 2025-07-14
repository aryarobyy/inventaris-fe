import { RoomStatus } from "./enums";

export interface RoomModel {
  id: number;
  roomName: string;
  pcCount: number;
  description?: string;
  capacity?: number;
  location?: string;
  roomStatus: RoomStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PostRoomModel {
  roomName: string;
  pcCount?: number;
  description?: string;
  capacity?: number;
  location?: string;
  roomStatus: RoomStatus;
}

export interface UpdateRoomModel {
  roomName?: string;
  pcCount?: number;
  description?: string;
  capacity?: number;
  location?: string;
  roomStatus?: RoomStatus;
}