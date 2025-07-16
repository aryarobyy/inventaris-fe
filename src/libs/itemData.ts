import { ITEMKEY } from "../core/contants";
import type { ItemModel, PostItemModel } from "../models/item.model";

const key = ITEMKEY;

const getExpiryTimestamp = (): number => {
  const twoHours = 2 * 60 * 60 * 1000;
  return Date.now() + twoHours;
};

export const postLocalItem = (
  item: PostItemModel[]
): { item: PostItemModel[]; expires: number } | null => {
  try {
    const payload = {
      item,
      expires: getExpiryTimestamp(),
    };
    localStorage.setItem("key", JSON.stringify(payload));
    console.log("Items posted to local storage:", payload);
    return payload;
  } catch (error) {
    console.error("Error posting local items:", error);
    return null;
  }
};


export const getLocalItems = (): ItemModel[] | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    const payload = JSON.parse(item);
    if (payload.expires < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    console.log("Items retrieved from local storage:", payload.user);
    return payload.user;
  } catch (error) {
    console.error("Error getting local items:", error);
    return null;
  }
}

export const removeLocalItem = () => {
  localStorage.removeItem(ITEMKEY);
};