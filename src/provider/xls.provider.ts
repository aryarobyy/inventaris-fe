import { XLS } from "../core/contants"
import apiHandler from "./api.handler"

export const getXls = async () => {
  const data = await apiHandler.get(`/${XLS}/`)
  console.log("Xls data",data)
  return data.data
}