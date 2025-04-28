import { BN } from "@drift-labs/sdk";
import { Tokens } from "@/utils/tokens";

interface token {
  name: string;
  logoUrl: string;
  tokenId: number;
  symbol: string;
}
export const formatAddress = (value: string) => {
  return value.substring(0, 4) + ".." + value.substring(value.length - 4);
};

export const decodeNumbersToWord = (numbers: number[]): string => {
  return numbers.map((num) => String.fromCharCode(num)).join("");
};

/**
 * Formats a number with commas as thousand separators
 * @param num The number to format
 * @param decimals Optional number of decimal places to show (default: 2)
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (
  num: number,
  decimals: number = 2
): string => {
  return num?.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatBigNumber = (value: BN) => {
  const formatted = value?.toNumber() / 10e5;
  return formatted?.toLocaleString("en-Us");
};

export const formatImpact = (value: number | string) => {
  // Convert to number if it's a string
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  // Format the number with compact notation
  const formattedNumber = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(numericValue);

  return formattedNumber;
};

export const getTokenLogo = (value: number) => {
  const ImageString = Tokens.find((token: token) => token.tokenId === value);
  return ImageString?.logoUrl;
};
