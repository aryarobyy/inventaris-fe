import type { LoanStatus } from "./enums";
import type { LoanItemModel } from "./loanItem.model";
import type { UserModel } from "./user.model";

export interface LoanModel {
  id: number;
  borrower: UserModel;
  borrowerId: number;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date | null;
  notes?: string | null;
  createdAt: Date; 
  updatedAt: Date;
  loanStatus: LoanStatus
  loanItems: LoanItemModel[];
}

export interface PostLoanModel {
  borrowerId: number;
  loanDate: Date; 
  dueDate: Date;
  returnDate?: Date | null;
  notes?: string | null;
  loanStatus: LoanStatus;
  loanItems: {
    itemId: number; 
    quantity: number;
  }[];
}

export interface UpdateLoanModel {
  loanDate?: Date;
  dueDate?: Date;
  returnDate?: Date | null;
  notes?: string | null;
  loanStatus?: LoanStatus;
  loanItems?: {
    itemId: number;
    quantity: number;
  }[];
}