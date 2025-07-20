import { LOAN } from "../core/contants";
import type { PostLoanModel, LoanModel, UpdateLoanModel } from "../models/loan.model";
import apiHandler from "./api.handler";

export const postLoan = async (loan: PostLoanModel): Promise<LoanModel> => {
  const data = await apiHandler.post(`/${LOAN}/`, loan);
  return data.data.data.data;
};

export const getLoanById = async (id: number): Promise<LoanModel> => {
  const data = await apiHandler.get(`/${LOAN}/${id}`);
  return data.data.data.data;
}

export const getLoans = async (): Promise<LoanModel[]> => {
  const data = await apiHandler.get(`/${LOAN}`);
  return data.data.data.data;
};

export const updateLoan = async (id: number, loan: UpdateLoanModel): Promise<LoanModel> => {
  const data = await apiHandler.put(`/${LOAN}/${id}`, loan);
  return data.data.data.data;
};

export const deleteLoan = async (id: number): Promise<void> => {
  await apiHandler.delete(`/${LOAN}/${id}`);
};