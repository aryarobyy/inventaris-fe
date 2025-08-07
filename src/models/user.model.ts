// import { LoanItemModel } from "./loanItem.model";
// import { RoomBookingModel } from "./roomBooking.model";

export interface UserModel {
  id: number;
  name: string;
  identityNumber: string;
  majorName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  
  // loans?: LoanItemModel[];
  // roomBookings?: RoomBookingModel[];
}

export interface PostUserModel {
  name: string;
  identityNumber: string;
  majorName: string;
  phoneNumber: string;
}

export interface UpdateUserModel {
  name?: string;
  identityNumber?: string;
  majorName?: string;
  phoneNumber?: string;
}

// user.model.ts
export type UserIdentity = {
    identityNumber: string;
}