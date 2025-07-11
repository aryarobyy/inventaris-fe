import { ItemCondition } from "./enums";

export interface LoanItemModel {
  id: number;
  loanId: number;
  itemId: number;
  borrowedQuantity: number;
  returnedAt?: Date;
  borrowCondition?: ItemCondition;
  returnCondition?: ItemCondition;
}

export interface PostLoanItemModel {
  loanId?: number;
  itemId: number;
  borrowedQuantity?: number;
  borrowCondition?: ItemCondition;
}

export interface UpdateLoanItemModel {
  returnedAt?: Date;
  returnCondition?: ItemCondition;
  borrowedQuantity?: number;
}