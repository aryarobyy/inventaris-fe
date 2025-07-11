import { BookingStatus } from "./enums";

export interface RoomBookingModel {
  id: number;
  borrowerId: number;
  roomId: number;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  actualReturnTime?: Date;
  purpose?: string;
  notes?: string;
  bookingStatus: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostRoomBookingModel {
  borrowerId: number;
  roomId: number;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  purpose?: string;
  notes?: string;
  bookingStatus?: BookingStatus;
}

export interface UpdateRoomBookingModel {
  startTime?: Date;
  endTime?: Date;
  actualReturnTime?: Date;
  purpose?: string;
  notes?: string;
  bookingStatus?: BookingStatus;
}