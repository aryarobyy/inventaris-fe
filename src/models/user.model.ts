// import { LoanItemModel } from "./loanItem.model";
// import { RoomBookingModel } from "./roomBooking.model";

export interface UserModel {
  id: number;
  name: string;
  studentId: string;
  majorName: string;
  academicYear: string;
  phoneNumber: string;
  organization: string;
  createdAt: string;  updatedAt: string;
  
  // loans?: LoanItemModel[];
  // roomBookings?: RoomBookingModel[];
}

export interface PostUserModel {
  name: string;
  studentId: string;
  majorName: string;
  academicYear: string;
  phoneNumber: string;
  organization: string;
}

export interface UpdateUserModel {
  name?: string;
  studentId?: string;
  majorName?: string;
  academicYear?: string;
  phoneNumber?: string;
  organization?: string;
}