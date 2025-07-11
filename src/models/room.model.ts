import { RoomStatus } from "./enums";

export interface RoomModel {
  id: number;
  roomName: string;
  pcCount: number;
  description?: string;
  capacity?: number;
  location?: string;
  roomStatus: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
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