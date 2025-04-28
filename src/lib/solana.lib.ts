import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
export async function getSplTokenBalance(
  rpcUrl: string,
  tokenAddress: PublicKey,
  userAddress: PublicKey
): Promise<number> {
  const connection = new Connection(
    rpcUrl || "https://api.mainnet-beta.solana.com",
    { commitment: "confirmed" }
  );
  try {
    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      tokenAddress,
      userAddress
    );

    // Check if the account exists
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);

    if (accountInfo === null) {
      // Account doesn't exist, which means the balance is 0
      return 0;
    }

    // Fetch the token account info
    const tokenAccountInfo = await connection.getTokenAccountBalance(
      associatedTokenAddress
    );

    // Return the balance as a number
    return Number(tokenAccountInfo.value.uiAmount);
  } catch (error) {
    console.error("Error fetching SPL token balance:", error);
    // If there's an error, return 0
    return 0;
  }
}
