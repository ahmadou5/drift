import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, User } from "lucide-react";
import { decodeNumbersToWord } from "@/lib/helpers.lib";
import { UserAccount } from "@drift-labs/sdk";
import { useSubaccountStore } from "@/store/accountStore";

// Optional props interface for the component
interface AccountSelectorProps {
  accounts?: UserAccount[];
  onSelect?: (account: UserAccount) => void;
  defaultSelected?: UserAccount;
}

export default function AccountSelector({
  accounts = [],
  onSelect,
  defaultSelected,
}: AccountSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Fix: Handle the possibility of defaultSelected being undefined
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(
    defaultSelected || null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { activeSubAccount, setTranferToAccount } = useSubaccountStore();
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const getFisrtAccount = () => {
      if (activeSubAccount && accounts.length > 0) {
        const firstAccount = accounts.filter(
          (account) => account.subAccountId !== activeSubAccount.subAccountId
        );
        setSelectedAccount(firstAccount[0]);
        if (onSelect) {
          onSelect(firstAccount[0]);
        }
      }
    };
    getFisrtAccount();
  }, []);

  const selectAccount = (account: UserAccount) => {
    setSelectedAccount(account);
    setTranferToAccount(account.subAccountId);
    setIsOpen(false);

    // Call the onSelect prop if provided
    if (onSelect) {
      onSelect(account);
    }

    console.log("Selected account:", account);
  };

  if (!activeSubAccount) return;

  return (
    <div className="w-full rounded-sm">
      {/* Dropdown Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full rounded-sm py-2 px-2 border border-[#132236] rounded-lg shadow-sm hover:border-[#132236]/50 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <User size={10} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-[13px] text-white/40 font-semibold">
                {selectedAccount
                  ? decodeNumbersToWord(selectedAccount.name)
                  : "Select Account"}
              </p>
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute mt-1 w-full border border-[#132236] bg-[#132236] rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto scrollbar-hide">
            {accounts
              .filter(
                (account) =>
                  account.subAccountId !== activeSubAccount.subAccountId
              )
              .map((account) => (
                <div
                  key={account.subAccountId}
                  onClick={() => selectAccount(account)}
                  className="flex items-center py-2 px-3 hover:bg-black/5 cursor-pointer transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <User size={10} className="text-blue-600" />
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="text-[13px] text-white/40 font-semibold">
                      {decodeNumbersToWord(account.name)}
                    </p>
                  </div>
                  {selectedAccount &&
                    selectedAccount.subAccountId === account.subAccountId && (
                      <Check size={12} className="text-blue-600 ml-2" />
                    )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
