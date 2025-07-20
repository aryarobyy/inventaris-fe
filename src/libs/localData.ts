import { ITEMKEY } from "../core/contants";

export const postLocalUser = (data: any, key: string): void => {
  try {
    const payload = {
      data,
      expires: Date.now() + 2 * 60 * 60 * 1000
    };
    localStorage.setItem(key, JSON.stringify(payload));
    console.log("Data posted to local storage:", payload);
  } catch (error) {
    console.error("Error posting local data:", error);
  }
};

export const postLocalAdmin = (data: any, key: string): void => {
  try {
    const payload = {
      data,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000 
    };
    localStorage.setItem(key, JSON.stringify(payload));
    console.log("Data posted to local storage:", payload);
  } catch (error) {
    console.error("Error posting local data:", error);
  }
};

export const postLocalItem = (data: any): void => {
  try {
    const payload = {
      data,
      expires: Date.now() + 2 * 60 * 60 * 1000 
    };
    localStorage.setItem(ITEMKEY, JSON.stringify(payload));
    console.log("Data posted to local storage:", payload);
  } catch (error) {
    console.error("Error posting local data:", error);
  }
};

export const getLocalData = (key: string): any | null => {
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
    console.log("Data retrieved from local storage:", payload);
    return payload;
  } catch (error) {
    console.error("Error getting local data:", error);
    return null;
  }
}

export const removeLocalData = (key: string) => {
  localStorage.removeItem(key);
};