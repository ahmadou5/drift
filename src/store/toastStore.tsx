interface ToastStoreState {
  toast: {
    message: string;
    type: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  };
  setToast: (toast: {
    message: string;
    type: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  }) => void;
  resetToast: () => void;
}

import { create } from "zustand";

export const useToastStore = create<ToastStoreState>((set) => ({
  toast: {
    message: "",
    type: "info",
    isOpen: true,
  },
  setToast: (toast) => set({ toast }),
  resetToast: () =>
    set({ toast: { message: "", type: "info", isOpen: false } }),
}));
