import { LOAN } from "../core/contants";
import type { PostLoanModel, LoanModel } from "../models/loan.model";
import apiHandler from "./api.handler";

export const postLoan = async (loan: PostLoanModel): Promise<LoanModel> => {
  const data = await apiHandler.post<LoanModel>(`/${LOAN}/`, loan);
  return data.data;
};

export const getLoanById = async (id: number): Promise<LoanModel> => {
  const data = await apiHandler.get<LoanModel>(`/${LOAN}/${id}`);
  return data.data;
}

export const getLoans = async (): Promise<LoanModel[]> => {
  const data = await apiHandler.get<LoanModel[]>(`/${LOAN}/`);
  return data.data;
};

export const updateLoan = async (id: number, loan: PostLoanModel): Promise<LoanModel> => {
  const data = await apiHandler.put<LoanModel>(`/${LOAN}/${id}`, loan);
  return data.data;
};

export const deleteLoan = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${LOAN}/${id}`);
};