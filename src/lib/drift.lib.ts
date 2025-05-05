"use client";
import { Connection } from "@solana/web3.js";
import {
  Wallet,
  DriftClient,
  UserAccount,
  TokenFaucet,
  ReferrerInfo,
  BN,
} from "@drift-labs/sdk";
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

export const createNewUser = async (
  amount: number,
  marketIndex: number,
  driftClient: DriftClient,
  subAccountId: number,
  name: string,
  fromSubAccountId?: number,
  referrerInfo?: ReferrerInfo,
  donateAmount?: number,
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
  },
  customMaxMarginRatio?: number,
  poolId?: number
) => {
  const associatedTokenAccount = await driftClient.getAssociatedTokenAccount(
    marketIndex
  );
  const tx = await driftClient.initializeUserAccountAndDepositCollateral(
    new BN(amount),
    associatedTokenAccount,
    marketIndex,
    subAccountId,
    name,
    fromSubAccountId,
    referrerInfo,
    new BN(donateAmount || 0),
    txParams,
    customMaxMarginRatio,
    poolId
  );

  console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  return tx;
};

export const dripUSDC = async (
  rpcUrl: string,
  amount: number,
  wallet: AnchorWallet,
  mint: PublicKey,
  marketIndex: number,
  driftClient: DriftClient
) => {
  await driftClient.subscribe();
  const connection = new Connection(rpcUrl, "confirmed");
  const programId = new PublicKey(
    "V4v1mQiAdLz4qwckEb45WqHYceYizoib39cDBHSWfaB"
  );

  const associatedTokenAccount = await driftClient.getAssociatedTokenAccount(
    marketIndex
  );

  const tokenFaucet = new TokenFaucet(connection, wallet, programId, mint, {
    commitment: "confirmed",
  });
  const amountInLamports = amount * 1e6;
  console.log("amountInLamports", amountInLamports, marketIndex);
  try {
    if (associatedTokenAccount) {
      const tx = await tokenFaucet.mintToUser(
        associatedTokenAccount,
        new BN(amountInLamports)
      );

      console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
      return tx;
    } else {
      console.log("Associated token account not found");
      const tx = await tokenFaucet.createAssociatedTokenAccountAndMintTo(
        wallet.publicKey,
        new BN(amountInLamports)
      );
      console.log("tx", tx);
      console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
      return tx;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.stack);
    }
  }
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

export const Transfer = async (
  fromSubAccountId: number,
  toSubAccountId: number,
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

  const tx = await driftClient.transferDeposit(
    convertedAmount,
    marketIndex,
    fromSubAccountId,
    toSubAccountId,
    txParams
  );
  console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  return tx;
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
