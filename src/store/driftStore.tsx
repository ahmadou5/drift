import { DriftClient } from "@drift-labs/sdk";
import { create } from "zustand";

interface DriftStoreState {
  driftClient: DriftClient | null;
  setDriftClient: (client: DriftClient | null) => void;
  resetDriftClient: () => void;
}

export const useDriftStore = create<DriftStoreState>((set) => ({
  driftClient: null,
  setDriftClient: (client) => set({ driftClient: client }),
  resetDriftClient: () => set({ driftClient: null }),
}));
