import { ItemAvailability, ItemCategory, ItemCondition } from "./enums";
import type { LoanItemModel } from "./loan.model";

export interface ItemModel {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  brand?: string;
  imgUrl?: string;
  pairId?: number;
  stock: number;
  statusNotes?: string;
  borrowedQuantity?: number;
  createdAt: string;
  updatedAt: string;

  loanItems?: LoanItemModel[];
  category: ItemCategory;
  conditionStatus: ItemCondition;
  availabilityStatus: ItemAvailability;
}

export interface PostItemModel {
  name: string;
  description?: string;
  quantity?: number;
  brand?: string;
  imgUrl?: string;
  pairId?: number;
  stock: number;
  borrowedQuantity?: number;
  statusNotes?: string;

  category: ItemCategory;
  conditionStatus: ItemCondition;
  availabilityStatus: ItemAvailability;
}

export interface UpdateItemModel {
  name?: string;
  description?: string;
  quantity?: number;
  brand?: string;
  imgUrl?: string;
  pairId?: number;
  stock: number;
  borrowedQuantity?: number;
  statusNotes?: string;

  category?: ItemCategory;
  conditionStatus?: ItemCondition;
  availabilityStatus?: ItemAvailability;
}