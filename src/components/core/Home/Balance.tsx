import { Button } from "@/components/ui/button";

import Down from "@/assets/down.png";
import Up from "@/assets/up.png";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSubaccountStore } from "@/store/accountStore";
import { LucideEye, LucideEyeClosed, LucideX } from "lucide-react";
import * as motion from "motion/react-client";
import Modal from "@/components/base/Modals/Modal";
import DepositModal from "@/components/base/Modals/DepositModal";
import WithdrawModal from "@/components/base/Modals/WithdrawModal";
import TransferModal from "@/components/base/Modals/TransferModal";

function Balance() {
  const {
    driftUser,
    accountloading,
    isDepositModalOpen,
    activeBalanceTab,
    setActiveBalanceTab,
    setTokenSelected,
    toggleDepositModal,
  } = useSubaccountStore();
  const [userBalance, setUserBalance] = useState<string>("");
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const handleSetShowBalance = () => {
    setShowBalance(!showBalance);
  };
  const renderTabContent = () => {
    if (activeBalanceTab === "Deposit") {
      return <DepositModal />;
    } else if (activeBalanceTab === "Withdraw") {
      return <WithdrawModal />;
    } else if (activeBalanceTab === "Transfer") {
      return <TransferModal />;
    }
  };
  useEffect(() => {
    const updateBalance = async () => {
      try {
        const balance = await (
          driftUser?.getNetUsdValue().toNumber() / 10e5
        ).toLocaleString();
        setUserBalance(balance);
      } catch (error) {
        console.error(error);
      }
    };
    updateBalance();
  }, [driftUser, showBalance]);
  return (
    <div className="h-[190px] px-3 py-3 lg:h-[180px] mb-5 lg:mb-0 ml-auto mr-auto text-white border border-[#132236] rounded-3xl p-2 w-[99%] lg:w-[824px] bg-[#080f18]">
      <div className="lg:w-[564px] w-[100%] h-[60px] ">
        <div className="w-[99%] lg:w-[196px] lg:py-0 lg:px-0 py-2 px-1 mt-4 lg:mt-2 text-[14px] items-center justify-between lg:text-[14px] flex h-[20px]">
          <p className="text-[23px] ml-2">Total Balance</p>
          {showBalance ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleSetShowBalance()}
            >
              {" "}
              <LucideEyeClosed />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleSetShowBalance()}
            >
              <LucideEye />
            </motion.div>
          )}
        </div>
        {accountloading ? (
          <div className="animate-pulse rounded-lg bg-[#111D2E] w-[99%] lg:w-[60%] h-8 lg:h-[37px] mt-[20px] "></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[auto] h-[43px] mt-[12px] ml-2 lg:text-[30px] text-[28px] font-bold"
          >
            {showBalance ? (
              <motion.p
                className="lg:text-[26px] text-[24px]"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >{`$ ${userBalance} USD`}</motion.p>
            ) : (
              <motion.p
                className="lg:text-[26px] text-[24px]"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >{`$ **** USD`}</motion.p>
            )}
          </motion.div>
        )}
      </div>
      <div className="w-[564px] flex h-[40px] mt-8 lg:mt-[30px]">
        {accountloading ? (
          <div className="animate-pulse w-[108px] h-[40px] mb-1 ml-1 mr-2 rounded-[8px] bg-[#E5E7EB]/50 "></div>
        ) : (
          <Button
            onClick={() => {
              toggleDepositModal();
              setActiveBalanceTab("Deposit");
            }}
            className="w-[108px] h-[40px] ml-1 mr-2 rounded-[8px] bg-[#E5E7EB]"
          >
            <p className="w-[auto] h-[23px] text-[14px] ml-auto mr-auto text-black">
              Deposit
            </p>
            <Image src={Down} alt="camera" className="w-[12px] h-[16px] " />
          </Button>
        )}
        {accountloading ? (
          <div className="animate-pulse w-[108px] h-[40px] mb-1 ml-1 mr-2 rounded-[8px] bg-[#E5E7EB]/50 "></div>
        ) : (
          <Button
            onClick={() => {
              toggleDepositModal();
              setActiveBalanceTab("Withdraw");
            }}
            className="w-[108px] h-[40px] ml-1 mr-2 rounded-[8px] bg-[#E5E7EB]"
          >
            <p className="w-[auto] h-[23px] text-[14px] ml-auto mr-auto text-black">
              Withdraw
            </p>
            <Image src={Up} alt="camera" className="w-[12px] h-[16px] " />
          </Button>
        )}
      </div>
      <Modal isOpen={isDepositModalOpen} onClose={toggleDepositModal}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Balances</h2>
          <button
            onClick={() => {
              toggleDepositModal();
              setTokenSelected(0);
            }}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            aria-label="Close"
          >
            <LucideX className="w-5 h-5" color={"white"} />
          </button>
        </div>
        <div className="w-[100%] h-[auto] py-3 px-0 bg-white/0 flex items-center rounded-md justify-between">
          {["Deposit", "Withdraw", "Transfer"].map((item, i) => (
            <div
              onClick={() => setActiveBalanceTab(item)}
              className={` ${
                item === activeBalanceTab ? "bg-white/80" : "bg-[030a13]"
              } ${
                item === activeBalanceTab ? "text-black/70" : "text-white/70"
              } text-black py-1 h-8  rounded-lg border border-[#132236]  w-auto px-7`}
              key={i}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="h-auto rounded-2xl mt-6 px-1 py-2 w-[100%]">
          {renderTabContent()}
        </div>
      </Modal>
    </div>
  );
}

export default Balance;
// This component is a simple balance display with deposit and withdraw buttons.
