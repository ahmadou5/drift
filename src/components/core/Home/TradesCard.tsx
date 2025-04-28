"use client";
import { useSubaccountStore } from "@/store/accountStore";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pen } from "lucide-react";
import { Order } from "@drift-labs/sdk";

function TradesCard() {
  const { driftUser, accountloading } = useSubaccountStore();
  const [userOrders, setUserOrders] = React.useState<Order[] | undefined>([]);

  useEffect(() => {
    const updateBalances = async () => {
      await driftUser;
      try {
        // Create an empty array to store tokens with balance > 0
        const orders = await driftUser?.getOpenOrders();
        console.log(orders, "order");
        // Save all tokens with balance > 0 to state
        setUserOrders(orders);
      } catch (error) {
        console.error(error);
      }
    };

    updateBalances();
  }, [driftUser]);
  return (
    <>
      {userOrders && userOrders.length <= 0 ? (
        <div className="w-[100%] h-[100px] py-3 flex flex-col">
          <div className="flex py-0.5 px-2 w-[95%] justify-center items-center ml-auto mr-auto">
            <div className="w-[100%] text-sm items-center mt-6 flex justify-center">
              No Open Trades available
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[100%] mt-0 h-[auto] py-3 flex flex-col">
          <div className="flex py-0.5 px-2 w-[95%] ml-auto mr-auto">
            <div className="w-[16.6%] text-sm  flex justify-start">Market</div>
            <div className="w-[16.6%] text-sm flex justify-center">Size</div>
            <div className="w-[16.6%] text-sm flex justify-center">Price</div>
            <div className="w-[16.6%]  text-sm flex justify-center">
              Notional
            </div>
            <div className="w-[16.6%]  text-sm flex justify-center">Fee</div>
            <div className="w-[16.6%]  text-sm flex justify-end">Date</div>
          </div>
          <div className="h-[1px] w-[94%] ml-auto mr-auto border mb-2 mt-2 border-[#132236]"></div>
          <div className="flex flex-col items-center justify-center py-0.5 px-2 ml-auto mr-auto w-[95%]">
            {accountloading ? (
              <>
                {userOrders &&
                  userOrders.map((order, i) => (
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
                {userOrders &&
                  userOrders.map((order, i) => (
                    <div
                      className="flex w-full py-2 px-2 items-center "
                      key={i}
                    >
                      <div className="w-[16.6%] flex  justify-start">
                        <p>
                          {order?.triggerCondition === "ABOVE"
                            ? "LONG"
                            : "SHORT"}
                        </p>
                      </div>
                      <div className="w-[16.6%] flex flex-col items-center justify-center">
                        <p className="text-md">{`${
                          order?.direction === "LONG" ? "Buy" : "Sell"
                        }`}</p>
                        {/** TO DO USD balance of the token <p className="text-sm">{`$${20000}`}</p> */}
                      </div>
                      <div className="w-[16.6%] flex justify-center">
                        {`${(
                          order?.baseAssetAmountFilled.toNumber() / 10e8
                        ).toLocaleString()}/${(
                          order?.baseAssetAmount.toNumber() / 10e8
                        ).toLocaleString()}`}
                      </div>
                      <div className="w-[16.6%] flex justify-center">
                        {`$${order?.triggerPrice?.toNumber() / 10e5}/${
                          order?.price.toNumber() / 10e5
                        }`}
                      </div>
                      <div className="w-[16.6%] flex justify-center">
                        {order?.reduceOnly ? (
                          <p className="text-sm">Reduce Only</p>
                        ) : (
                          <p className="text-sm">None</p>
                        )}
                      </div>
                      <div className="w-[16.6%] flex justify-end">
                        <Button className="w-[34px] h-[34px] ml-1 mr-2 rounded-[8px] bg-[#111d2e] hover:bg-white/70">
                          <Pen />
                        </Button>
                        <div className="w-[34px] h-[34px] border border-[#111D2E] hover:bg-white/60 rounded-md py-2 px-1 flex items-center justify-center">
                          <EllipsisVertical size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default TradesCard;
