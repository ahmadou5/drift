"use client";
import { useSubaccountStore } from "@/store/accountStore";
import React from "react";
import BalanceCard from "./BalanceCard";
import OrdersCard from "./OrdersCard";
import TradesCard from "./TradesCard";
import PositionCard from "./PositionCard";
import HealthCard from "./HealthCard";

function Activities() {
  const { appTab, setAppTab } = useSubaccountStore();

  const renderTabContent = () => {
    if (appTab === "Balances") {
      return <BalanceCard />;
    } else if (appTab === "Positions") {
      return <PositionCard />;
    } else if (appTab === "Trades") {
      return <TradesCard />;
    } else if (appTab === "Orders") {
      return <OrdersCard />;
    } else {
      return <HealthCard />;
    }
  };
  return (
    <div className="w-[100%] flex-col bg-[#080f18] border border-[#132236] rounded-4xl h-auto py-3 px-4 ml-auto mr-auto items-center justify-between">
      <div className="w-[100%] h-[auto] py-3 px-2 bg-white/0 flex items-center rounded-md justify-between">
        {["Balances", "Positions", "Trades", "Orders", "Health"].map(
          (item, i) => (
            <div
              onClick={() => setAppTab(item)}
              className={`ml-auto mr-auto ${
                item === appTab ? "bg-[#111d2e]/60" : "bg-[030a13]"
              } ${
                item === appTab ? "text-white/70" : "text-white/40"
              } text-black py-1 h-8  rounded-lg border border-[#132236]  w-auto px-7`}
              key={i}
            >
              {`${item} `}
            </div>
          )
        )}
      </div>
      <div className="h-auto rounded-2xl border border-[#132236] px-1 py-2 w-[100%]">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Activities;
