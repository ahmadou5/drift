"use client";
import React, { useEffect } from "react";
import { useSubaccountStore } from "@/store/accountStore";
import { useDriftStore } from "@/store/driftStore";
import { decodeNumbersToWord, getTokenLogo } from "@/lib/helpers.lib";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { getSplTokenBalance } from "@/lib/solana.lib";
import { ENV } from "@/lib/constants/env.constants";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { dripUSDC, createNewUser } from "@/lib/drift.lib";
import TokenSelector from "./TokenSelect";
import { Tokens } from "@/utils/tokens";

function CreateAccountModal() {
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const {
    subaccounts,

    driftUser,
    tokenSelected,
    toggleDepositModal,
  } = useSubaccountStore();
  const { driftClient } = useDriftStore();
  //const { toast, setToast, resetToast } = useToastStore();
  const [transactionLoading, setTransactionLoading] =
    React.useState<boolean>(false);
  const [amount, setAmount] = React.useState<number>();
  const [userName, setUserName] = React.useState<string>("");
  const [balance, setBalance] = React.useState<number | null>(null);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const tokenMint =
          driftClient?.getSpotMarketAccount(tokenSelected)?.mint;

        if (driftClient && tokenMint && publicKey) {
          const balance = await getSplTokenBalance(
            ENV?.SOLANA_RPC || "",
            tokenMint || PublicKey.default,
            publicKey || PublicKey.default
          );
          setBalance(balance);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, [tokenSelected, toggleDepositModal]);
  const airdrop = async () => {
    if (!wallet) return;
    try {
      const tokenMint = driftClient?.getSpotMarketAccount(tokenSelected)?.mint;
      if (driftClient && publicKey && tokenMint) {
        const tx = await dripUSDC(
          ENV.SOLANA_RPC || "",
          100000,
          wallet,
          tokenMint,
          tokenSelected,
          driftClient
        );
        console.log(tx);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createAccount = async () => {
    try {
      setTransactionLoading(true);
      if (driftUser && driftClient && subaccounts) {
        const tx = await createNewUser(
          amount || 0,
          tokenSelected,
          driftClient,
          subaccounts.length > 0 ? subaccounts.length : 0,
          userName || `SubAccount ${subaccounts.length + 1}`
        );
        console.log(tx);
        setTransactionLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTransactionLoading(false);
    }
  };

  if (driftClient === undefined) return;

  return (
    <div className="h-auto py-2 px-0">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => airdrop()}
          className="w-[24%] h-[30px] ml-1 mr-2 cursor-pointer rounded-md bg-[#E5E7EB]"
        >
          <p className="text-black/80 font-semibold text-[12px]">{`Airdrop ${decodeNumbersToWord(
            driftClient?.getSpotMarketAccount(tokenSelected)?.name || [9, 0]
          )}`}</p>
          <Image
            src={getTokenLogo(tokenSelected) || ""}
            alt="image"
            height={20}
            width={20}
          />
        </Button>
      </div>
      <div className="mt-3 mb-3 py-2 ">
        <p className="text-[13px] text-white/50 font-semibold">
          New Account name
        </p>
        <div className="flex rounded-sm py-2  items-center mt-2 mb-1">
          <input
            type="text"
            onChange={(e) => {
              const value = e.target.value;
              setUserName(value);
            }}
            value={userName}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none py-2 [&::-webkit-inner-spin-button]:appearance-none text-white/40 w-[100%] h-[35px] outline-hidden scroll-hidden rounded-sm border border-[#132236] px-2"
            placeholder={userName || `SubAccount ${subaccounts?.length + 1}`}
          />
        </div>
      </div>
      <div className="mt-1 mb-3 py-2 px-0">
        <p className="text-[13px] px-1 text-white/50 font-semibold">
          Deposit Collateral From
        </p>
      </div>
      <div className="mt-3 mb-3 py-2 px-0">
        <p className="text-[13px] px-1 text-white/50 font-semibold">Amount</p>
        <div className="flex rounded-sm py-2 px-2 items-center justify-between mt-2 mb-2">
          <div className="w-[25%]">
            <TokenSelector tokens={Tokens} />
          </div>

          <div className="flex items-center py-1 justify-between w-[74%]">
            <input
              type="number"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setAmount(value);
              }}
              value={amount}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none py-2 [&::-webkit-inner-spin-button]:appearance-none text-white/40 w-[100%] h-[35px] outline-hidden scroll-hidden rounded-sm border border-[#132236] px-2"
              placeholder={`${"0.00"} ${decodeNumbersToWord(
                driftClient?.getSpotMarketAccount(tokenSelected)?.name || [9, 0]
              )} `}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="px-2">
            <p className="text-[13px] ml-0.5 mr-1 mt-0.5 text-white/60 font-semibold">
              Available Balance
            </p>
          </div>
          {balance !== null ? (
            <div className="flex items-center w-auto py-1 px-2">
              <Image
                src={getTokenLogo(tokenSelected) || ""}
                alt="image"
                height={14}
                className="ml-1 mr-1"
                width={14}
              />
              <p className="text-[13px] ml-0.5 mr-1 mt-0.5 text-white/60 font-semibold">
                {`${balance.toLocaleString()} ${decodeNumbersToWord(
                  driftClient?.getSpotMarketAccount(tokenSelected)?.name || [
                    9, 0,
                  ]
                )}`}
              </p>
              <div className="flex items-center justify-between">
                <div
                  onClick={() => {
                    setAmount((balance * 50) / 100);
                  }}
                  className="flex bg-white/10 rounded-lg py-0 ml-1 mr-1 px-1 items-center"
                >
                  <p className="text-[13px] ml-0.5 mr-1 mt-0.5 text-white/60 font-semibold">
                    50%
                  </p>
                </div>
                <div
                  onClick={() => {
                    setAmount(balance);
                  }}
                  className="flex bg-white/10 rounded-lg py-0 px-1 ml-1 mr-1 items-center"
                >
                  <p className="text-[13px] ml-0.5 mr-1 mt-0.5 text-white/60 font-semibold">
                    Max
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-[120px] h-5 rounded-sm bg-white/10 animate-pulse"></div>
          )}
        </div>
      </div>

      <div className="mt-6 mb-3 py-1 px-0">
        <Button
          onClick={() => createAccount()}
          className="w-[100%] h-[40px] ml-1 mr-2 cursor-pointer rounded-[8px] bg-[#E5E7EB]"
        >
          {transactionLoading ? (
            <div className=" w-[99%] h-6  ">
              <p className="text-black/80 font-semibold text-[14px]">
                initialising account...
              </p>
            </div>
          ) : (
            <p className="text-black/80 font-semibold text-[14px]">
              Create Account
            </p>
          )}
        </Button>
      </div>
    </div>
  );
}

export default CreateAccountModal;
