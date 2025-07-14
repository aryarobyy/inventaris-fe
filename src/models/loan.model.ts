import type { LoanStatus } from "./enums";
import type { UserModel } from "./user.model";

export interface LoanItemModel {
  id: number;
  loanId: number;
  itemId: number;
  borrowedQuantity: number;
  item: {
    id: number;
    name: string;
  };
}

export interface LoanModel {
  id: number;
  borrower: UserModel;
  borrowerId: number;
  loanDate: string;
  dueDate: string;
  returnDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  loanStatus: LoanStatus;
  loanItems: LoanItemModel[];
}

export interface PostLoanModel {
  borrowerId: number;
  loanDate: string; 
  dueDate: string;
  returnDate?: string | null;
  notes?: string | null;
  loanStatus: LoanStatus;
  loanItems: {
    itemId: number; 
    borrowedQuantity: number;
  }[];
}

export interface UpdateLoanModel {
  loanDate?: string;
  dueDate?: string;
  returnDate?: string | null;
  notes?: string | null;
  loanStatus?: LoanStatus;
  loanItems?: {
    itemId: number;
    borrowedQuantity: number;
  }[];
}