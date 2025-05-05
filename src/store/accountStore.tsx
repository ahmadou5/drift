import { User, UserAccount } from "@drift-labs/sdk";
import { PublicKey } from "@solana/web3.js";
import { create } from "zustand";

interface SubaccountState {
  subaccounts: UserAccount[];
  activeSubAccount: UserAccount | null;
  driftUser: User | undefined | null;
  loading: boolean;
  accountloading: boolean;
  error: string | null;
  activeTab: number | null;
  activeBalanceTab: string;
  transferToAccount: number;
  isDepositModalOpen: boolean;
  isAccountModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  tokenSelected: number;
  appTab: string;
  searchInput: string;
  setSearchInput: (input: string) => void;
  setDriftUser: (user: User | undefined) => void;
  setActiveSubAccount: (account: UserAccount | null) => void;
  setSubaccounts: (accounts: UserAccount[]) => void;
  setAccountLoading: (accountloading: boolean) => void;
  toggleWithdrawModal: () => void;
  toggleDepositModal: () => void;
  setTranferToAccount: (account: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: number | null) => void;
  setTokenSelected: (length: number) => void;
  setActiveBalanceTab: (tab: string) => void;
  setAppTab: (tab: string) => void;
  handleSearch: (searchInput: string) => Promise<void>;
  toggleAccountModal: () => void;
  getActiveSubaccount: () => UserAccount | null;
}

export const useSubaccountStore = create<SubaccountState>((set, get) => ({
  subaccounts: [],
  activeSubAccount: null,
  loading: false,
  accountloading: false,
  error: null,
  activeTab: null,
  transferToAccount: 0,
  activeBalanceTab: "Deposit",
  tokenSelected: 0,
  isDepositModalOpen: false,
  isAccountModalOpen: false,
  isWithdrawModalOpen: false,
  appTab: "Balances",
  driftUser: null,
  searchInput: "arbJEWqPDYfgTFf3CdACQpZrk56tB6z7hPFc6K9KLUi",
  setTranferToAccount: (account) => set({ transferToAccount: account }),
  setSearchInput: (input: string) => set({ searchInput: input }),
  setDriftUser: (user) => set({ driftUser: user }),
  setActiveSubAccount: (account) => set({ activeSubAccount: account }),
  setAppTab: (tab) => set({ appTab: tab }),
  setTokenSelected: (token) => set({ tokenSelected: token }),
  toggleAccountModal: () => {
    set((state) => ({ isAccountModalOpen: !state.isAccountModalOpen }));
  },
  toggleWithdrawModal: () =>
    set((state) => ({ isWithdrawModalOpen: !state.isWithdrawModalOpen })),
  toggleDepositModal: () =>
    set((state) => ({ isDepositModalOpen: !state.isDepositModalOpen })),
  setSubaccounts: (accounts) => set({ subaccounts: accounts }),
  setAccountLoading: (accountloading) => set({ accountloading }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveBalanceTab: (tab) => set({ activeBalanceTab: tab }),

  getActiveSubaccount: () => {
    const { activeTab, subaccounts } = get();
    const index = activeTab ?? 0;
    return subaccounts.length > 0 && index < subaccounts.length
      ? subaccounts[index]
      : null;
  },

  handleSearch: async (searchInput) => {
    if (!searchInput.trim()) return;

    set({ loading: true, error: null, activeTab: null });

    try {
      const driftClient = (await import("@/lib/drift.lib")).driftClient;
      await driftClient.subscribe();

      const userAccounts = await driftClient.getUserAccountsForAuthority(
        new PublicKey(searchInput.trim())
      );

      if (userAccounts.length === 0) {
        set({
          error: "No subaccounts found for this wallet address",
          subaccounts: [],
        });
        return;
      }

      set({
        subaccounts: userAccounts,
        activeTab: userAccounts.length > 0 ? 0 : null,
      });
    } catch (error) {
      console.error("Error fetching subaccounts:", error);
      set({
        error:
          "Error fetching subaccounts. Please check the wallet address and try again.",
        subaccounts: [],
      });
    } finally {
      set({ loading: false });
    }
  },
}));
