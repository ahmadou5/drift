"use client";

import NavLogo from "@/assets/logo.svg";

import { cn } from "@/lib/utils";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Menu, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [{ href: "/indexer", label: "Search" }];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-200",
        scrolled
          ? "lg:bg-black/50 bg-black/50 lg:backdrop-blur-md backdrop-blur-md"
          : "lg:bg-transparent backdrop-blur-md bg-[#080f18]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            <Image src={NavLogo} height={230} width={89} alt="logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-300 transition-colors font-medium hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <BaseWalletMultiButton
              style={{
                backgroundColor: "#132236",
                color: "white",
                border: "1px solid #000000",
                height: "40px",
                flex: "1",
              }}
              labels={{
                "has-wallet": "Wallet Connected",
                "no-wallet": "Connect Wallet",
                "change-wallet": "Change Wallet",
                "copy-address": "Copy",
                disconnect: "Disconnect",
                connecting: "Connecting..",
                copied: "Address copied",
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-gray-300 hover:bg-white/5 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden h-7"
            >
              <div className="flex flex-col gap-4 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <BaseWalletMultiButton
                  style={{
                    backgroundColor: "#132236",
                    color: "white",
                    border: "1px solid black",
                    width: "100%",
                    height: "40px",

                    textAlign: "center",
                  }}
                  labels={{
                    "has-wallet": "Wallet Connected",
                    "no-wallet": "Connect Wallet",
                    "change-wallet": "Change Wallet",
                    "copy-address": "Copy",
                    disconnect: "Disconnect",
                    connecting: "loading..",
                    copied: "Address copied",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
