"use client";
import React from "react";
import { useSubaccountStore } from "@/store/accountStore";
import { decodeNumbersToWord, getTokenLogo } from "@/lib/helpers.lib";
import { Button } from "@/components/ui/button";
import { useDriftStore } from "@/store/driftStore";
import { User } from "lucide-react";
import { Withdraw } from "@/lib/drift.lib";
import TokenSelector from "./TokenSelect";
import { Tokens } from "@/utils/tokens";
import Image from "next/image";
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
        <div className="flex border border-[#132236] rounded-sm py-2 px-2 items-center mt-2 mb-2">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <User size={10} className="text-blue-600" />
          </div>
          <p className="text-[13px] ml-1 mr-1 text-white/40 font-semibold">
            {activeSubAccount && decodeNumbersToWord(activeSubAccount?.name)}
          </p>
        </div>
      </div>
      <div className="mt-3 mb-3 py-2 px-0">
        <p className="text-[13px] px-1 text-white/50 font-semibold">Amount</p>
        <div className="flex rounded-sm py-2 px-2 items-center justify-between mt-2 mb-2">
          <div className="w-[25%]">
            <TokenSelector tokens={Tokens} />
          </div>
          <div className="flex items-center justify-between w-[74%]">
            <input
              type="number"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setAmount(value);
              }}
              value={amount}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white/40 w-[100%] h-[35px] outline-hidden scroll-hidden rounded-sm border border-[#132236] px-2"
              placeholder={`${"0.00"} ${decodeNumbersToWord(
                driftClient?.getSpotMarketAccount(tokenSelected)?.name || [9, 0]
              )} `}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="px-2">
            <p className="text-[13px] ml-0.5 mr-1 mt-0.5 text-white/60 font-semibold">
              Available to withdraw
            </p>
          </div>

          <div className="flex items-center w-auto py-1 px-2">
            <Image
              src={getTokenLogo(tokenSelected) || ""}
              alt="image"
              height={14}
              className="ml-1 mr-1"
              width={14}
            />
            <p className="text-[13px] ml-0.5 mr-1 mt-0.5 text-white/60 font-semibold">
              {`${(
                driftUser?.getTokenAmount(tokenSelected).toNumber() / 10e5
              ).toLocaleString()} ${decodeNumbersToWord(
                driftClient?.getSpotMarketAccount(tokenSelected)?.name || [9, 0]
              )}`}
            </p>
            <div className="flex items-center justify-between">
              <div
                onClick={() => {
                  setAmount(
                    ((driftUser?.getTokenAmount(tokenSelected).toNumber() /
                      10e5) *
                      50) /
                      100
                  );
                }}
                className="flex bg-white/10 rounded-lg py-0 ml-1 mr-1 px-1 items-center"
              >
                <p className="text-[13px] ml-0.5 mr-1 mt-0.5 text-white/60 font-semibold">
                  50%
                </p>
              </div>
              <div
                onClick={() => {
                  setAmount(
                    driftUser?.getTokenAmount(tokenSelected).toNumber() / 10e5
                  );
                }}
                className="flex bg-white/10 rounded-lg py-0 px-1 ml-1 mr-1 items-center"
              >
                <p className="text-[13px] ml-0.5 mr-1 mt-0.5 text-white/60 font-semibold">
                  Max
                </p>
              </div>
            </div>
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
            <div className=" w-[99%] h-6  ">
              <p className="text-black/80 font-semibold text-[14px]">
                Withdrawing...
              </p>
            </div>
          ) : (
            <p className="text-black/80 font-semibold text-[14px]">
              Confirm Withdraw
            </p>
          )}
        </Button>
      </div>
    </div>
  );
}

export default WithdrawModal;
