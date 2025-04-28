"use client";
import { Connection } from "@solana/web3.js";
import { Wallet, DriftClient, UserAccount } from "@drift-labs/sdk";
import { PublicKey } from "@solana/web3.js";
//import { ENV } from "./constants/env.constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ENV } from "./constants/env.constants";
import { Keypair } from "@solana/web3.js";

const connection = new Connection(ENV.SOLANA_RPC || "", "confirmed");

const keyPairFile = Keypair.generate();
const wallet = new Wallet(keyPairFile);

export const initializeDriftClient = async (
  connection: Connection,
  wallet: AnchorWallet,
  env: DriftClient["env"]
): Promise<DriftClient> => {
  const driftClient = new DriftClient({
    connection,
    wallet,
    env,
  });
  await driftClient.subscribe();
  return driftClient;
};

export const driftClient = new DriftClient({
  connection,
  wallet,
  env: "devnet",
});

export const fetchUser1SubAccounts = async (
  mint: string,
  connection: Connection,
  wallet: Wallet,
  network: DriftClient["env"]
) => {
  try {
    const driftClient = new DriftClient({
      connection,
      wallet,
      env: network,
    });
    await driftClient.subscribe();
    const userAddress = new PublicKey(mint);
    const accounts = await driftClient.getUserAccountsForAuthority(userAddress);

    return accounts;
  } catch (error) {
    console.error("Error fetching user accounts:", error);
  }
};

export const fetchUserSubAccounts = async (
  mint: string,
  driftClient: DriftClient
) => {
  try {
    await driftClient.subscribe();
    const userAddress = new PublicKey(mint);
    const accounts = await driftClient.getUserAccountsForAuthority(userAddress);

    return accounts;
  } catch (error) {
    console.error("Error fetching user accounts:", error);
  }
};

export const getUserSubAccount = async (
  subAccountId: number,
  authority: PublicKey,
  userAcc: UserAccount,
  driftClient: DriftClient
) => {
  try {
    await driftClient.addUser(subAccountId, authority, userAcc);
    const subAccount = await driftClient.getUser(subAccountId, authority);
    return subAccount;
  } catch (error) {
    console.log(error);
  }
};

export const getUserSubAccountNetUSD = async (
  subAccountId: number,
  authority: PublicKey,
  userAcc: UserAccount,
  driftClient: DriftClient
) => {
  try {
    await driftClient.subscribe();
    await driftClient.addUser(subAccountId, authority, userAcc);
    const subAccount = driftClient.getUser(subAccountId, authority);
    if (!subAccount) return;
    return subAccount.getNetUsdValue().toNumber();
  } catch (error) {
    console.log(error);
  }
};

export const Deposit = async (
  subAccountId: number,
  marketIndex: number,
  amount: number,
  driftClient: DriftClient,
  txParams: {
    computeUnitsPrice?: number;
    skipPreflight?: boolean;
    commitment?: string;
    preflightCommitment?: string;
  } = {
    computeUnitsPrice: 10_000,
    skipPreflight: false,
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  }
) => {
  // USDC
  const convertedAmount = driftClient.convertToSpotPrecision(
    marketIndex,
    amount
  ); // $100
  const associatedTokenAccount = await driftClient.getAssociatedTokenAccount(
    marketIndex
  );

  const tx = await driftClient.deposit(
    convertedAmount,
    marketIndex,
    associatedTokenAccount,
    subAccountId,
    false,
    txParams
  );
  console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  return tx;
};

export const Withdraw = async (
  marketIndex: number,
  subAccountId: number,
  amount: number,
  driftClient: DriftClient,
  txParams: {
    computeUnitsPrice?: number;
    skipPreflight?: boolean;
    commitment?: string;
    preflightCommitment?: string;
  } = {
    computeUnitsPrice: 10_000,
    skipPreflight: false,
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  }
) => {
  // USDC
  const convertedAmount = driftClient.convertToSpotPrecision(
    marketIndex,
    amount
  ); // $100
  const associatedTokenAccount = await driftClient.getAssociatedTokenAccount(
    marketIndex
  );

  const tx = await driftClient.withdraw(
    convertedAmount,
    marketIndex,
    associatedTokenAccount,
    false,
    subAccountId,
    txParams
  );
  console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  return tx;
};

export const cancelUserOrder = async (
  subAccountId: number,
  authority: PublicKey,
  userAcc: UserAccount,
  orderId: number,
  driftClient: DriftClient,
  txParams: {
    computeUnitsPrice?: number;
    skipPreflight?: boolean;
    commitment?: string;
    preflightCommitment?: string;
  } = {
    computeUnitsPrice: 10_000,
    skipPreflight: false,
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  }
) => {
  try {
    await driftClient.addUser(subAccountId, authority, userAcc);
    const tx = await driftClient.cancelOrder(orderId, txParams, subAccountId);
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    return tx;
  } catch (error) {
    console.log(error);
  }
};

export const cancelOrder = async (
  subAccountId: number,
  authority: PublicKey,
  userAcc: UserAccount,
  orderId: number,
  connection: Connection,
  wallet: Wallet,
  network: DriftClient["env"]
) => {
  try {
    const driftClient = new DriftClient({
      connection,
      wallet,
      env: network,
    });
    await driftClient.subscribe();
    await driftClient.addUser(subAccountId, authority, userAcc);
    await driftClient.cancelOrder(orderId);
  } catch (error) {
    console.error("Error fetching user accounts:", error);
  }
};
