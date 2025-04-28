"use client";
import { formatImpact } from "@/lib/helpers.lib";
import { useSubaccountStore } from "@/store/accountStore";
import { Heart, HeartCrack } from "lucide-react";
import React, { useEffect } from "react";

function HealthCard() {
  const { driftUser, accountloading } = useSubaccountStore();

  useEffect(() => {
    const updateBalances = async () => {
      await driftUser;
      try {
        // Create an empty array to store tokens with balance > 0
        const orders = await driftUser?.getOpenOrders();
        console.log(orders, "order");
        // Save all tokens with balance > 0 to state
        //setUserOrders(orders);
      } catch (error) {
        console.error(error);
      }
    };

    updateBalances();
  }, [driftUser]);
  return (
    <>
      <div className="w-[100%] mt-0 h-[auto] py-3 flex flex-col">
        <div className="flex flex-rows items-center justify-center py-0.5 px-2 ml-auto mr-auto w-[100%]">
          {accountloading ? (
            <>
              {["1", "2", "3"].map((order, i) => (
                <div className="flex w-[100%] ml-auto  mr-auto py-2 " key={i}>
                  <div className="h-[200px] w-[100%] ml-20 mr-20 animate-pulse rounded-lg bg-[#111D2E]"></div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="w-[100%] flex items-center justify-between rounded-sm py-1 px-2 h-[auto]">
                <div className="w-[33%] rounded-xl border border-[#111D2E] h-[200px]">
                  <div className="w-[98%] px-3 py-2 flex justify-between">
                    <p className="text-lg font-bold text-white/70">
                      Net USD Value
                    </p>
                    {accountloading ? (
                      <div className="bg-[#111D2E] animate-pulse w-20 h-5 rounded-lg"></div>
                    ) : (
                      <p className="text-lg font-bold text-white/70">{`$ ${formatImpact(
                        driftUser?.getNetUsdValue().toNumber() / 10e5
                      )}`}</p>
                    )}
                  </div>
                  <div className="w-[98%] px-3 py-2 flex justify-between">
                    <p className="text-md  font-medium text-white/70">
                      Balance
                    </p>
                    {accountloading ? (
                      <div className="bg-[#111D2E] animate-pulse w-20 h-5 rounded-lg"></div>
                    ) : (
                      <p className="text-md font-medium text-white/70">{`$ ${(
                        driftUser?.getNetUsdValue().toNumber() / 10e5
                      ).toLocaleString()}`}</p>
                    )}
                  </div>
                </div>
                <div className="w-[33%] rounded-xl border border-[#111D2E] h-[200px]">
                  <div className="w-[98%] px-3 py-2 flex justify-between">
                    <p className="text-lg font-bold text-white/70">
                      Acct. Leverage
                    </p>
                    {accountloading ? (
                      <div className="bg-[#111D2E] animate-pulse w-20 h-5 rounded-lg"></div>
                    ) : (
                      <p className="text-lg font-semibold text-white/70">
                        {`${(
                          driftUser?.getLeverage(true)?.toNumber() / 10e3
                        ).toFixed(2)}`}
                        <span className="text-sm">x</span>
                      </p>
                    )}
                  </div>
                  <div className="w-[98%] px-3 py-2 flex justify-between">
                    <p className="text-md font-medium text-white/70">
                      Total Collateral
                    </p>
                    {accountloading ? (
                      <div className="bg-[#111D2E] animate-pulse w-20 h-5 rounded-lg"></div>
                    ) : (
                      <p className="text-lg font-semibold text-white/70">
                        {`$${(
                          driftUser?.getTotalCollateral()?.toNumber() / 10e5
                        ).toLocaleString()}`}
                      </p>
                    )}
                  </div>
                  <div className="w-[98%] px-3 py-2 flex justify-between">
                    <p className="text-md font-medium text-white/70">
                      Free Collateral
                    </p>
                    {accountloading ? (
                      <div className="bg-[#111D2E] animate-pulse w-20 h-5 rounded-lg"></div>
                    ) : (
                      <p className="text-lg font-semibold text-white/70">
                        {`$${(
                          driftUser?.getFreeCollateral()?.toNumber() / 10e5
                        ).toLocaleString()}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-[33%] rounded-xl border border-[#111D2E] h-[200px]">
                  <div className="w-[98%] px-3 py-2 flex justify-between">
                    <p className="text-lg font-bold text-white/70">
                      Account Health
                    </p>
                    {accountloading ? (
                      <div className="bg-[#111D2E] animate-pulse w-20 h-5 rounded-lg"></div>
                    ) : (
                      <p
                        className={`text-lg  ${
                          driftUser && driftUser?.getHealth() <= 50
                            ? "text-[#FF615C]"
                            : "text-[#34CB88]"
                        } flex font-semibold `}
                      >
                        {driftUser && driftUser?.getHealth() <= 50 ? (
                          <HeartCrack
                            size={20}
                            className="mt-1 ml-1 mr-1"
                            color="#FF615C"
                          />
                        ) : (
                          <Heart
                            size={20}
                            className="mt-1 ml-1 mr-1"
                            color="#34CB88"
                          />
                        )}

                        {`${driftUser?.getHealth()}%`}
                      </p>
                    )}
                  </div>
                  <div className="w-[98%] px-3 py-2 flex justify-between">
                    <p className="text-md font-medium text-white/70">
                      Maint. Margin
                    </p>
                    {accountloading ? (
                      <div className="bg-[#111D2E] animate-pulse w-20 h-5 rounded-lg"></div>
                    ) : (
                      <p className="text-lg font-semibold text-white/70">
                        {`$${(
                          driftUser
                            ?.getMaintenanceMarginRequirement()
                            .toNumber() / 10e5
                        ).toFixed(2)}`}
                      </p>
                    )}
                  </div>
                  <div className="w-[98%] px-3 py-2 flex justify-between">
                    <p className="text-md font-medium text-white/70">
                      Initial Margin
                    </p>
                    {accountloading ? (
                      <div className="bg-[#111D2E] animate-pulse w-20 h-5 rounded-lg"></div>
                    ) : (
                      <p className="text-lg font-semibold text-white/70">
                        {`$${(
                          driftUser?.getInitialMarginRequirement().toNumber() /
                          10e5
                        ).toFixed(2)}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HealthCard;
