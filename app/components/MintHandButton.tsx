// MintHandButton.tsx
// import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
// import { parseEther } from "viem";
import type { Log } from "viem";
import { OMAHA_CONTRACT } from "../contracts/omaha-contract";

export default function MintHandButton() {
  const { address, isConnected } = useAccount();
//   const [tokenId, setTokenId] = useState<bigint | null>(null);

  // Write contract configuration
  const { writeContract, data: hash, isPending: txLoading, error: txError } = useWriteContract();

  console.log(txError);

  // Wait for transaction receipt
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

//   const { data: mintEvents } = useWatchContractEvent({
//     address: HAND_NFT.address,
//     abi: HAND_NFT.abi,
//     eventName: 'Transfer',
//     onLogs: (logs) => {
//       const { args } = logs[0];
//       setTokenId(args.tokenId);
//       // notify backend here
//     }
//   });

  // Handle successful transaction
  const handleSuccess = async (receipt: { logs: Log[]; transactionHash: string }) => {
    // the mint event will tell us the tokenId
    console.log(receipt);
    // 4. notify backend so it can insert into `hands`
    // await fetch("/api/mint-success", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     gameId: "latest",          // or null ⇒ backend decides
    //     tokenId: mintedId.toString(),
    //     txHash: receipt.transactionHash,
    //     player: address,
    //   }),
    // });
  };

  // Watch for successful transaction
  if (isSuccess && hash) {
    handleSuccess({ logs: [], transactionHash: hash });
  }

  const handleMint = () => {
    if (!address) return;
    
    writeContract({
      ...OMAHA_CONTRACT,
      functionName: "buy_hand",
      args: [BigInt(0), BigInt(0), "https://pink-changing-earwig-765.mypinata.cloud/ipfs/bafkreifpjmf5m4n77e3cx5gsaxmqdtjfbg4na3ftwvfvvvd3ezwb6nsbky"],
    });
  };

  return (
    <button
      disabled={!isConnected || txLoading || confirming}
      onClick={handleMint}
      className="rounded bg-emerald-600 px-6 py-3 text-white disabled:opacity-40"
    >
      {txLoading && "Waiting for wallet…"}
      {confirming && "Minting…"}
      {!txLoading && !confirming && "Mint hand (Ξ0.001)"}
    </button>
  );
}