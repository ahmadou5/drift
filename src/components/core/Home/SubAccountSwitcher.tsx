import {
  fetchUserSubAccounts,
  getUserSubAccount,
  initializeDriftClient,
} from "@/lib/drift.lib";
import { UserAccount } from "@drift-labs/sdk";
import { Button } from "@/components/ui/button";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { decodeNumbersToWord, formatBigNumber } from "@/lib/helpers.lib";
import * as motion from "motion/react-client";
import { useSubaccountStore } from "@/store/accountStore";
import { Connection, PublicKey } from "@solana/web3.js";
import { ENV } from "@/lib/constants/env.constants";
import { useDriftStore } from "@/store/driftStore";

function SubAccountSwitcher() {
  const wallet = useAnchorWallet();

  const connection = new Connection(ENV.SOLANA_RPC || "", {
    commitment: "confirmed",
  });
  const {
    activeSubAccount,
    setActiveSubAccount,
    setDriftUser,
    driftUser: user,
    subaccounts,
    setSubaccounts,
    setAccountLoading,

    toggleAccountModal,
    accountloading,
  } = useSubaccountStore();

  const { driftClient, setDriftClient, resetDriftClient } = useDriftStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { publicKey, connected, disconnecting } = useWallet();
  useEffect(() => {
    if (wallet) {
      initDriftClient();
    }
  }, [wallet]);
  useEffect(() => {
    if (disconnecting) {
      resetDriftClient();
    }
  }, [disconnecting]);
  useEffect(() => {
    const initClient = async () => {
      if (wallet && connected && !driftClient) {
        console.log("WalletConnector: Initializing Drift client");
        try {
          const client = await initializeDriftClient(
            connection,
            wallet,
            "devnet"
          );
          console.log(client);

          setDriftClient(client);
        } catch (error) {
          console.error("Failed to initialize Drift client:", error);
        }
      }
    };

    initClient();
  }, [wallet, connected, driftClient, connection, setDriftClient, publicKey]);

  const updateUser1 = async (
    id: number,
    author: PublicKey,
    acc: UserAccount
  ) => {
    try {
      if (!driftClient) return;
      const updatedUser = await getUserSubAccount(id, author, acc, driftClient);
      return updatedUser;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const updateUser = async () => {
      if (!driftClient) return;
      if (!activeSubAccount) return;
      try {
        const updatedUser = await getUserSubAccount(
          activeSubAccount?.subAccountId,
          activeSubAccount?.authority,
          activeSubAccount,
          driftClient
        );
        setDriftUser(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error(error);
      }
    };
    updateUser();
  }, [user]);

  const handleExpand = async (subAccount: UserAccount) => {
    try {
      setDriftUser(undefined);
      setActiveSubAccount(subAccount);
      const newUSer = await updateUser1(
        subAccount.subAccountId,
        subAccount.authority,
        subAccount
      );
      console.log("new User", newUSer?.getNetUsdValue());
      setDriftUser(newUSer);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error expanding:", error);
    }
  };

  useEffect(() => {
    const fetchDriftUser = async () => {
      setAccountLoading(true);
      try {
        if (!driftClient) return;
        if (publicKey === null) return;
        const driftUser = await fetchUserSubAccounts(
          publicKey?.toString() || "",
          driftClient
        );
        console.log("driftUser", driftUser);
        if (driftUser) {
          setSubaccounts(driftUser);
          setActiveSubAccount(driftUser[0]);
          const user1 = await getUserSubAccount(
            driftUser[0]?.subAccountId,
            driftUser[0]?.authority,
            driftUser[0],
            driftClient
          );
          setDriftUser(user1);
          setAccountLoading(false);
          console.log("user", formatBigNumber(user?.getNetUsdValue()));
        } else {
          alert("error fetching drift user");
        }
      } catch (error) {
        console.error("Error fetching Drift user:", error);
      }
    };
    fetchDriftUser();
  }, [publicKey, driftClient]);
  const initDriftClient = async () => {
    try {
      if (!wallet) return;
      const client = await initializeDriftClient(connection, wallet, "devnet");
      setDriftClient(client);
      console.log("Drift client initialized:", client);
    } catch (error) {
      console.error("Error initializing Drift client:", error);
    }
  };
  return (
    <motion.div
      className={`lg:w-[374px] w-[99%] mb-0 lg:mb ${
        isExpanded ? "h-[auto]" : "h-[260px]"
      } bg-white/0 rounded-[16px] ml-auto mr-auto`}
      ref={dropdownRef}
    >
      <div className="">
        {publicKey && (
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant={"outline"}
            className="w-[40%] lg:w-[100%] ml-auto mr-auto h-12 font-bold border border-[#111d2e] justify-between rounded-xl  text-black bg-[#080f18] "
          >
            {accountloading ? (
              <div className="animate-pulse rounded-lg bg-[#111D2E] w-[99%] h-6  "></div>
            ) : (
              <>
                <p className="text-white/70 font-bold text-xl">{`${
                  (activeSubAccount &&
                    decodeNumbersToWord(activeSubAccount?.name)) ||
                  "Click to Create Account"
                }`}</p>
                <ChevronDown color={"white"} />
              </>
            )}
          </Button>
        )}
        {isExpanded && !accountloading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed  w-[40%] lg:w-[370px] ml-auto z-50 mr-auto h-[auto] font-bold border border-[#111d2e] text-black rounded-xl bg-[#080f18]"
          >
            {subaccounts?.map((subAccount, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 px-3 mt-1 mb-1 border-b border-black/20"
                  onClick={() => {
                    handleExpand(subAccount);
                  }}
                >
                  <p className="text-sm text-white/70 font-bold">{`${decodeNumbersToWord(
                    subAccount.name
                  )}`}</p>
                </div>
              );
            })}
            <div className="flex justify-between items-center p-2 border-b border-black/20">
              <Button
                onClick={() => {
                  toggleAccountModal();
                  setIsExpanded(!isExpanded);
                }}
                variant={"outline"}
                className="w-[40%] lg:w-[98%] bg-white/70 ml-auto mr-auto  h-10 font-bold border border-[#111d2e] rounded-xl  text-black"
              >
                {subaccounts?.length > 0 ? (
                  <p>Add a new sub account</p>
                ) : (
                  <p>Create a sub account</p>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default SubAccountSwitcher;
