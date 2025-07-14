import { USERKEY } from "../core/contants";
import type { PostUserModel, UserModel } from "../models/user.model";

const key = USERKEY;

const getExpiryTimestamp = (): number => {
  const twoHours = 2 * 60 * 60 * 1000;
  return Date.now() + twoHours;
};

export const postLocalUser = (user: PostUserModel): void => {
  try {
    const payload = {
      user,
      expires: getExpiryTimestamp()
    };
    localStorage.setItem(key, JSON.stringify(payload));
    console.log("User posted to local storage:", payload);
  } catch (error) {
    console.error("Error posting local user:", error);
  }
};

export const getLocalUser = (): UserModel | null => {
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
    console.log("User retrieved from local storage:", payload.user);
    return payload.user;
  } catch (error) {
    console.error("Error getting local user:", error);
    return null;
  }
}

export const removeLocalUser = () => {
  localStorage.removeItem(USERKEY);
};