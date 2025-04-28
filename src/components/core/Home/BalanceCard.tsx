"use client";
import { useSubaccountStore } from "@/store/accountStore";
import { Tokens } from "@/utils/tokens";
import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
interface tokensWithBalance {
  balance: string;
  liqPrice: number;
  name: string;
  logoUrl: string;
  tokenId: number;
  symbol: string;
}
function BalanceCard() {
  const {
    driftUser,
    accountloading,
    toggleDepositModal,
    setActiveBalanceTab,
    setTokenSelected,
  } = useSubaccountStore();
  const [tokensWithBalance, setTokensWithBalance] = React.useState<
    tokensWithBalance[]
  >([]);
  const [activeActionMenu, setActiveActionMenu] = React.useState<number | null>(
    null
  );

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveActionMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle action menu for a specific order
  const toggleActionMenu = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the outside click handler from triggering
    setActiveActionMenu(activeActionMenu === index ? null : index);
  };
  useEffect(() => {
    const updateBalances = async () => {
      await driftUser;
      try {
        // Create an empty array to store tokens with balance > 0
        const tokensWithBalance = [];

        // Loop through each token in the Tokens array
        for (const token of Tokens) {
          // Get balance for this token and liquidation price

          const price =
            (await driftUser?.liquidationPrice(token?.tokenId)?.toNumber()) /
            10e5;

          const balance =
            (await driftUser?.getTokenAmount(token?.tokenId)?.toNumber()) /
            10e5;

          // If balance is greater than zero, save this token with its balance
          if (balance > 0) {
            tokensWithBalance.push({
              ...token,
              balance: balance?.toLocaleString(),
              liqPrice: price,
            });
          }
        }

        // Save all tokens with balance > 0 to state
        setTokensWithBalance(tokensWithBalance);
        //setTokenLength(tokensWithBalance.length);
      } catch (error) {
        console.error(error);
      }
    };

    updateBalances();
  }, [driftUser]);
  return (
    <>
      {tokensWithBalance.length <= 0 ? (
        <div className="w-[100%] h-[100px] py-3 flex flex-col">
          <div className="flex py-0.5 px-2 w-[95%] justify-center items-center ml-auto mr-auto">
            <div className="w-[100%] text-sm items-center mt-6 flex justify-center">
              Zero Balances
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[100%] mt-0 h-[auto] py-3 flex flex-col">
          <div className="flex py-0.5 px-2 w-[95%] ml-auto mr-auto">
            <div className="w-[25%] text-sm  flex justify-start">Asset</div>
            <div className="w-[25%] text-sm flex justify-center">Balance</div>
            <div className="w-[25%] text-sm flex justify-center">Liq Price</div>
            <div className="w-[25%]  text-sm flex justify-end">Action</div>
          </div>
          <div className="h-[1px] w-[94%] ml-auto mr-auto border mb-2 mt-2 border-[#132236]"></div>
          <div className="flex flex-col items-center justify-center py-0.5 px-2 ml-auto mr-auto w-[95%]">
            {accountloading ? (
              <>
                {Tokens.map((token, i) => (
                  <div
                    className="flex flex-rows w-[100%] ml-auto mr-auto py-2 "
                    key={i}
                  >
                    <div className="h-12 w-[100%] ml-20 mr-20 animate-pulse rounded-lg bg-[#111D2E]"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {tokensWithBalance.map((token, i) => (
                  <div className="flex w-full py-2 px-2 items-center " key={i}>
                    <div className="w-[25%] flex  justify-start">
                      <div className="flex">
                        <Image
                          src={
                            token?.logoUrl ||
                            "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a777954447431762f6c6f676f2e706e67"
                          }
                          className=" w-6.5 h-6.5 rounded-full"
                          alt="ey"
                          height={6}
                          width={6}
                        />
                        <p className="ml-1 text-lg mr-2">{token?.symbol}</p>
                      </div>
                    </div>
                    <div className="w-[25%] flex flex-col items-center justify-center">
                      <p className="text-md">{`${token?.balance} ${token?.symbol}`}</p>
                      {/** TO DO USD balance of the token <p className="text-sm">{`$${20000}`}</p> */}
                    </div>
                    <div className="w-[25%] flex justify-center">
                      {token?.liqPrice <= 0 ? "None" : token?.liqPrice}
                    </div>
                    <div className="w-[25%] flex justify-end relative">
                      <Button
                        onClick={() => {
                          toggleDepositModal();
                          setActiveBalanceTab("Deposit");
                          setTokenSelected(token.tokenId);
                        }}
                        className="w-[108px] h-[34px] ml-1 mr-2 rounded-[8px] bg-[#111d2e] hover:bg-white/70"
                      >
                        <p className="w-[auto] h-[23px] text-[14px] ml-auto mr-auto text-white hover:text-[#111d2e] font-bold">
                          Deposit
                        </p>
                      </Button>

                      {/* Action Menu Dropdown */}
                      {activeActionMenu === i && (
                        <div
                          className="absolute right-0 top-10 z-10 bg-[#0d141e] border border-[#132236] rounded-md shadow-lg w-26 py-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDepositModal();
                              setActiveBalanceTab("Transfer");
                              setTokenSelected(token.tokenId);
                              // e.stopPropagation();
                            }}
                            className="px-3 py-2 hover:bg-[#111d2e] rounded-md cursor-pointer"
                          >
                            Transfer
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(
                                "This feature is not available yet. Please check back later."
                              );
                              toggleDepositModal();
                              setActiveBalanceTab("Withdraw");
                              setTokenSelected(token.tokenId);
                            }}
                            className="px-3 py-2 hover:bg-[#111d2e] rounded-md cursor-pointer"
                          >
                            Withdraw
                          </div>
                        </div>
                      )}
                      <div
                        onClick={(e) => toggleActionMenu(i, e)}
                        className="w-[34px] h-[34px] border border-[#111D2E] hover:bg-[#111d2e] cursor-pointer rounded-md py-2 px-1 flex items-center justify-center"
                      >
                        <EllipsisVertical size={18} />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="h-[1px] w-[18%] ml-auto mr-auto border mb-0 mt-4 border-[#132236]"></div>
                <div className="flex item-center text-sm justify-start mt-3">
                  <p>{`Total value: $${(
                    driftUser?.getNetUsdValue().toNumber() / 10e5
                  ).toLocaleString()}`}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BalanceCard;
