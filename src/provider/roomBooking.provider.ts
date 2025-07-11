import { BOOKING } from "../core/contants";
import type { PostRoomBookingModel, RoomBookingModel, UpdateRoomBookingModel } from "../models/roomBooking.model";
import apiHandler from "./api.handler";

export const postBooking = async (booking: PostRoomBookingModel): Promise<RoomBookingModel> => {
  const data = await apiHandler.post<RoomBookingModel>(`/${BOOKING}/`, booking);
  return data.data;
};

export const getBookingById = async (id: number): Promise<RoomBookingModel> => {
  const data = await apiHandler.get<RoomBookingModel>(`/${BOOKING}/${id}`);
  return data.data;
};

export const getBookings = async (): Promise<RoomBookingModel[]> => {
  const data = await apiHandler.get<RoomBookingModel[]>(`/${BOOKING}/`);
  return data.data;
};

export const updateBooking = async (id: number, booking: UpdateRoomBookingModel): Promise<RoomBookingModel> => {
  const data = await apiHandler.put<RoomBookingModel>(`/${BOOKING}/${id}`, booking);
  return data.data;
};

export const deleteBooking = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${BOOKING}/${id}`);
};