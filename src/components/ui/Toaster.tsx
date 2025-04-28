"use client";

import { Dispatch, SetStateAction } from "react";

import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export default function Toaster({
  setIsToastOpen,
  isToastOpen,
  content,
}: {
  setIsToastOpen: Dispatch<SetStateAction<boolean>>;
  isToastOpen: boolean;
  content: string;
}) {
  return (
    <ToastProvider>
      <Toast isOpen={isToastOpen} setIsOpen={setIsToastOpen}>
        <ToastTitle>Notification</ToastTitle>
        <ToastDescription>{content}</ToastDescription>
      </Toast>

      <ToastViewport />
    </ToastProvider>
  );
}
