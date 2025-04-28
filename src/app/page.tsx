"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { formatAddress } from "@/lib/helpers.lib";
import Balance from "@/components/core/Home/Balance";
import SubAccountSwitcher from "@/components/core/Home/SubAccountSwitcher";
import Activities from "@/components/core/Home/Activities";
import Toaster from "@/components/ui/Toaster";
import { useToastStore } from "@/store/toastStore";
export default function Home() {
  const { publicKey } = useWallet();
  const { toast, resetToast } = useToastStore();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-5 pb-5 gap-8 sm:p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="lg:w-[1248px] mt-[60px] w-[100%] h-[264px] flex flex-col lg:flex-row  ml-auto mr-auto">
          <Balance />
          <SubAccountSwitcher />
        </div>
        <div className="w-[99%]">
          {" "}
          <Activities />
        </div>

        <p className="font-bold">
          {formatAddress(publicKey?.toString() || "")}
        </p>
        <BaseWalletMultiButton
          style={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid black",
          }}
          labels={{
            "has-wallet": "Wallet Connected",
            "no-wallet": "Connect a Solana Wallet",
            "change-wallet": "Change Wallet",
            "copy-address": "Copy",
            disconnect: "Disconnect",
            connecting: "loading..",
            copied: "Address copied",
          }}
        />
      </main>
      <Toaster
        setIsToastOpen={resetToast}
        isToastOpen={toast.isOpen}
        content={toast.message}
      />
    </div>
  );
}
