export const USER_STORAGE_KEY = 'appUsers';

export interface StoredUser {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  createdDate?: string;
  department?: string;
  phone?: string;
  lastLogin?: string;
}

export const getStoredUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch (err) {
    console.error('getStoredUsers parse error', err);
    return [];
  }
};

export const setStoredUsers = (users: StoredUser[]) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('setStoredUsers error', err);
  }
};
