"use client";
import React from "react";
import { useSubaccountStore } from "@/store/accountStore";
import { decodeNumbersToWord, getTokenLogo } from "@/lib/helpers.lib";
import { Button } from "@/components/ui/button";
import { useDriftStore } from "@/store/driftStore";
import Image from "next/image";
import { LucideChevronDown } from "lucide-react";
import { Withdraw } from "@/lib/drift.lib";
function WithdrawModal() {
  const { activeSubAccount, driftUser, tokenSelected } = useSubaccountStore();
  const { driftClient } = useDriftStore();
  const [amount, setAmount] = React.useState<number>();
  const [transactionLoading, setTransactionLoading] =
    React.useState<boolean>(false);
  const withdraw = async () => {
    try {
      if (!amount) {
        alert("Please enter an amount to deposit");
        return;
      }
      setTransactionLoading(true);
      if (driftUser && driftClient && activeSubAccount && amount) {
        setTransactionLoading(true);
        const tx = await Withdraw(
          tokenSelected,
          activeSubAccount?.subAccountId,
          amount,
          driftClient
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
  return (
    <div className="h-auto py-2 px-1">
      <div className="mt-3 mb-3 py-2 px-0">
        <p className="text-[13px] text-white/50 font-semibold">Withdraw from</p>
        <div className="flex border border-[#132236] rounded-sm py-2 px-2 items-center justify-between mt-2 mb-2">
          <p className="text-[13px] text-white/40 font-semibold">
            {activeSubAccount && decodeNumbersToWord(activeSubAccount?.name)}
          </p>
        </div>
      </div>
      <div className="mt-3 mb-3 py-2 px-0">
        <p className="text-[13px] px-1 text-white/50 font-semibold">Amount</p>
        <div className="flex border border-[#132236] rounded-sm py-2 px-2 items-center justify-between mt-2 mb-2">
          <div className="bg-white/40 flex items-center justify-between w-28 py-1 px-2 rounded-sm">
            <Image
              src={getTokenLogo(tokenSelected) || ""}
              alt="image"
              height={23}
              width={23}
            />
            <div className="flex w-[100%] items-center justify-between">
              <p className="text-[13px] ml-1 mr-1 text-black font-semibold">
                {`
                    ${decodeNumbersToWord(
                      driftClient?.getSpotMarketAccount(tokenSelected)
                        ?.name || [9, 0]
                    )}`}
              </p>
              <LucideChevronDown size={20} className="text-black ml-1 mr-1" />
            </div>
          </div>
          <div className="flex items-center justify-between w-[79%]">
            <input
              type="number"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setAmount(value);
              }}
              value={amount}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white/40 w-[100%] h-[30px] outline-hidden scroll-hidden rounded-sm border border-[#132236] px-2"
              placeholder={`${"0.00"} ${decodeNumbersToWord(
                driftClient?.getSpotMarketAccount(tokenSelected)?.name || [9, 0]
              )} `}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[13px] px-1 text-white/50 font-semibold">
            Available to withdraw
          </p>
          <p className="text-[13px] px-1 text-white/50 font-semibold">
            {`${(
              driftUser?.getTokenAmount(tokenSelected).toNumber() / 10e5
            ).toLocaleString()} ${decodeNumbersToWord(
              driftClient?.getSpotMarketAccount(tokenSelected)?.name || [9, 0]
            )}`}
          </p>
        </div>
      </div>
      <div className="h-[1px] w-[100%] ml-auto mr-auto border mb-0 mt-4 border-[#132236]"></div>
      <div className="mt-3 mb-3 py-2 px-2">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-white/50 font-semibold">
            Asset Balance
          </p>
          <p className="text-[13px] text-white/80 font-semibold">
            {`${(
              driftUser?.getTokenAmount(tokenSelected).toNumber() / 10e5
            ).toLocaleString()} ${decodeNumbersToWord(
              driftClient?.getSpotMarketAccount(tokenSelected)?.name || [9, 0]
            )}`}
          </p>
        </div>
      </div>
      <div className="mt-3 mb-3 py-1 px-0">
        <Button
          onClick={() => withdraw()}
          className="w-[100%] h-[40px] ml-1 mr-2 cursor-pointer rounded-[8px] bg-[#E5E7EB]"
        >
          {transactionLoading ? (
            <div className="animate-pulse rounded-lg bg-[#111D2E] w-[99%] h-6  ">
              <p className="text-black/80 font-semibold text-[14px]">
                Processing...
              </p>
            </div>
          ) : (
            <p className="text-black/80 font-semibold text-[14px]">
              Confirm Deposit
            </p>
          )}
        </Button>
      </div>
    </div>
  );
}

export default WithdrawModal;
