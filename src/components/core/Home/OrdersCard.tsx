"use client";
import { useSubaccountStore } from "@/store/accountStore";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pen, X, XIcon } from "lucide-react";
import { Order } from "@drift-labs/sdk";
import { cancelUserOrder } from "@/lib/drift.lib";
import { useDriftStore } from "@/store/driftStore";
import { decodeNumbersToWord, getTokenLogo } from "@/lib/helpers.lib";
import Image from "next/image";

function OrdersCard() {
  const { driftUser, accountloading, activeSubAccount } = useSubaccountStore();
  const { driftClient } = useDriftStore();
  const [userOrders, setUserOrders] = React.useState<Order[] | undefined>([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editValues, setEditValues] = useState({
    limitPrice: "",
    size: "",
    sliderValue: 72,
  });

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

  // Toggle action menu for a specific order

  // Open edit modal with the selected order data
  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditValues({
      limitPrice: (order?.price.toNumber() / 1e6).toString(),
      size: (order?.baseAssetAmount.toNumber() / 1e8).toString(),
      sliderValue: 72,
    });
    setEditModalOpen(true);
  };

  const handleCancelOrder = async (order: Order) => {
    try {
      if (!driftClient) return;
      if (!activeSubAccount) return;
      await cancelUserOrder(
        activeSubAccount?.subAccountId,
        activeSubAccount?.authority,
        activeSubAccount,
        order?.orderId,
        driftClient
      );
      setUserOrders((prevOrders) =>
        prevOrders?.filter((o) => o.orderId !== order.orderId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValues({ ...editValues, sliderValue: parseInt(e.target.value) });
  };

  // Handle confirming changes
  const handleConfirm = () => {
    // Implement your confirm logic here
    console.log("Confirming changes:", editValues);
    setEditModalOpen(false);
  };

  // Handle cancelling order

  return (
    <>
      {userOrders && userOrders.length <= 0 ? (
        <div className="w-[100%] h-[100px] py-3 flex flex-col">
          <div className="flex py-0.5 px-2 w-[95%] justify-center items-center ml-auto mr-auto">
            <div className="w-[100%] text-sm items-center mt-6 flex justify-center">
              No Open Order
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[100%] mt-0 h-[auto] py-3 flex flex-col">
          <div className="flex py-0.5 px-2 w-[95%] ml-auto mr-auto">
            <div className="w-[16.6%] text-sm  flex justify-start">Market</div>
            <div className="w-[16.6%] text-sm flex justify-center">Type</div>
            <div className="w-[16.6%] text-sm flex justify-center">Size</div>
            <div className="w-[16.6%]  text-sm flex justify-center">
              Trigger/limit
            </div>
            <div className="w-[16.6%]  text-sm flex justify-center">Flags</div>
            <div className="w-[16.6%]  text-sm flex justify-end">Action</div>
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
                      <div className="w-[16.6%] flex py-1  justify-start">
                        <Image
                          src={getTokenLogo(order?.marketIndex) || ""}
                          alt="image"
                          height={22}
                          className="ml-1 mr-1"
                          width={22}
                        />
                        <div>
                          {" "}
                          <p className="text-[14px] ml-1 mr-1 mt-0.5 text-white/90 font-semibold">
                            {`${
                              "perp" in order?.marketType ? "PERP -" : "SPOT :"
                            } ${decodeNumbersToWord(
                              driftClient?.getSpotMarketAccount(
                                order?.marketIndex
                              )?.name || [9, 0]
                            )} `}
                          </p>
                          <p className="text-[10px] ml-1 mr-1 mt-0.5 text-white/60 font-semibold">
                            {`${
                              "short" in order?.direction ? "SHORT" : "LONG"
                            } `}{" "}
                          </p>
                        </div>
                      </div>
                      <div className="w-[16.6%] flex flex-col items-center justify-center">
                        <p className="text-md">{`${
                          "limit" in order.orderType
                            ? "LIMIT"
                            : "market" in order.orderType
                            ? "MARKET"
                            : "oracle" in order.orderType
                            ? "ORACLE"
                            : "triggerMarket" in order.orderType
                            ? "STOP MARKET"
                            : "triggerLimit" in order.orderType
                            ? "STOP LIMIT"
                            : "unknown"
                        }`}</p>
                        {/** TO DO USD balance of the token <p className="text-sm">{`$${20000}`}</p> */}
                      </div>
                      <div className="w-[16.6%] flex justify-center">
                        {`${(
                          order?.baseAssetAmountFilled.toNumber() / 1e8
                        ).toLocaleString()}/${(
                          order?.baseAssetAmount.toNumber() / 1e8
                        ).toLocaleString()}`}
                      </div>
                      <div className="w-[16.6%] flex justify-center">
                        {`$${order?.triggerPrice?.toNumber() / 1e6}/${
                          order?.price.toNumber() / 1e6
                        }`}
                      </div>
                      <div className="w-[16.6%] flex justify-center">
                        {order?.reduceOnly ? (
                          <p className="text-sm">Reduce Only</p>
                        ) : (
                          <p className="text-sm">None</p>
                        )}
                      </div>
                      <div className="w-[16.6%] flex justify-end relative">
                        <Button
                          onClick={() => openEditModal(order)}
                          className="w-[34px] h-[34px] ml-1 mr-2 rounded-[8px] bg-[#111d2e] hover:bg-white/20"
                        >
                          <Pen size={16} />
                        </Button>
                        <div
                          onClick={() => handleCancelOrder(order)}
                          className="w-[34px] h-[34px] text-red-400/40 border border-red-400/50 hover:bg-[#FF615C33] cursor-pointer rounded-md py-2 px-1 flex items-center justify-center"
                        >
                          <XIcon size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-[#0d141e] border border-[#132236] rounded-lg w-full max-w-md p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Limit Order</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 text-white p-1 rounded">
                  {"SOL"}
                </div>
                <span className="text-xl">{"SOL"}</span>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xl">${editValues.limitPrice}</div>
                <div className="text-sm text-gray-400">Mark Price</div>
              </div>
            </div>

            {/* Limit Price Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">
                Limit Price
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={editValues.limitPrice}
                  onChange={(e) =>
                    setEditValues({ ...editValues, limitPrice: e.target.value })
                  }
                  className="w-full bg-[#111d2e] border border-[#132236] rounded px-3 py-2 text-white"
                />
                <span className="absolute right-3 top-2 text-gray-400">
                  USD
                </span>
              </div>
            </div>

            {/* Size Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Size</label>
              <div className="relative flex">
                <input
                  type="text"
                  value={editValues.size}
                  onChange={(e) =>
                    setEditValues({ ...editValues, size: e.target.value })
                  }
                  className="w-full bg-[#111d2e] border border-[#132236] rounded px-3 py-2 text-white"
                />
                <div className="flex ml-2 items-center">
                  <span className="text-sm">Max: {"SOL"}</span>
                </div>
              </div>
            </div>

            {/* Slider Section */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>{editValues.sliderValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={editValues.sliderValue}
                onChange={handleSliderChange}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <button className="px-3 py-1 border border-[#132236] rounded hover:bg-[#111d2e]">
                  25%
                </button>
                <button className="px-3 py-1 border border-[#132236] rounded hover:bg-[#111d2e]">
                  50%
                </button>
                <button className="px-3 py-1 border border-[#132236] rounded hover:bg-[#111d2e]">
                  75%
                </button>
                <button className="px-3 py-1 border border-[#132236] rounded hover:bg-[#111d2e]">
                  100%
                </button>
              </div>
            </div>

            {/* Changes Summary */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Changes to Order:</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Side</span>
                  <span className="text-green-500">Buy</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Size</span>
                  <span>{editValues.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Limit Price</span>
                  <span>${editValues.limitPrice}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => alert("Order cancelled")}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 py-2 rounded"
              >
                Cancel Order
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrdersCard;
