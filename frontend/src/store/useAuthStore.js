import { create } from 'zustand';
import { storage } from '../utils/storage';

export const useAuthStore = create((set) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: Boolean(storage.getToken()),
  isLoading: false,

  setAuth: (user, token) => {
    storage.setUser(user);
    storage.setToken(token);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    storage.clearAuth();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
