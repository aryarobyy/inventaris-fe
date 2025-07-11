import { ItemAvailability, ItemCategory, ItemCondition } from "./enums";
import type { LoanItemModel } from "./loanItem.model";

export interface ItemModel {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  brand?: string;
  imgUrl?: string;
  pairId?: number;
  statusNotes?: string;
  createdAt: Date;
  updatedAt: Date;

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
  statusNotes?: string;

  category?: ItemCategory;
  conditionStatus?: ItemCondition;
  availabilityStatus?: ItemAvailability;
}