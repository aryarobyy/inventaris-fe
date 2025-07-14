import { BookingStatus } from "./enums";

export interface RoomBookingModel {
  id: number;
  borrowerId: number;
  roomId: number;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  actualReturnTime?: string;
  purpose?: string;
  notes?: string;
  bookingStatus: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PostRoomBookingModel {
  borrowerId: number;
  roomId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  notes?: string;
  bookingStatus?: BookingStatus;
}

export interface UpdateRoomBookingModel {
  startTime?: string;
  endTime?: string;
  actualReturnTime?: string;
  purpose?: string;
  notes?: string;
  bookingStatus?: BookingStatus;
}