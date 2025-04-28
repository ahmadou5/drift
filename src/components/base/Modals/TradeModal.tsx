import { Order } from "@drift-labs/sdk";
import React from "react";
interface TradeModalProps {
  order: Order;
  onClose: () => void;
}
function TradeModal({ order, onClose }: TradeModalProps) {
  return (
    <div onClick={onClose} className="w-20 h-8 bg-white rounded-xl">
      {order?.triggerPrice?.toNumber() / 1e6}{" "}
    </div>
  );
}

export default TradeModal;
