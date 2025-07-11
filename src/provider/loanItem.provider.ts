import { LOAN_ITEM } from "../core/contants";
import type { LoanModel, PostLoanModel } from "../models/loan.model";
import type { UpdateLoanItemModel } from "../models/loanItem.model";
import apiHandler from "./api.handler";

export const postLoanItem = async (loanItem: PostLoanModel): Promise<LoanModel> => {
  const data = await apiHandler.post<LoanModel>(`/${LOAN_ITEM}/`, loanItem);
  return data.data;
}

export const getLoanItemById = async (id: number): Promise<LoanModel> => {
  const data = await apiHandler.get<LoanModel>(`/${LOAN_ITEM}/${id}`);
  return data.data;
}

export const getLoanItems = async (): Promise<LoanModel[]> => {
  const data = await apiHandler.get<LoanModel[]>(`/${LOAN_ITEM}/`);
  return data.data;
};

export const updateLoanItem = async (id: number, loanItem: UpdateLoanItemModel): Promise<LoanModel> => {
  const data = await apiHandler.put<LoanModel>(`/${LOAN_ITEM}/${id}`, loanItem);
  return data.data;
}

export const deleteLoanItem = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${LOAN_ITEM}/${id}`);
};