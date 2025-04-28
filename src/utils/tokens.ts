interface token {
  name: string;
  logoUrl: string;
  tokenId: number;
  symbol: string;
}
export const Tokens: token[] = [
  {
    name: "USD Coin",
    logoUrl:
      "https://drift-public.s3.eu-central-1.amazonaws.com/assets/icons/markets/usdc.svg",
    tokenId: 0,
    symbol: "USDC",
  },
  {
    name: "Solana",
    logoUrl:
      "https://drift-public.s3.eu-central-1.amazonaws.com/assets/icons/markets/sol.svg",
    tokenId: 1,
    symbol: "SOL",
  },
  {
    name: "Bitcoin",
    logoUrl:
      "https://drift-public.s3.eu-central-1.amazonaws.com/assets/icons/markets/btc.svg",
    tokenId: 2,
    symbol: "BTC",
  },
];
