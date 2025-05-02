// MintHandButton.tsx
// import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useWatchContractEvent } from "wagmi";
// import { parseEther } from "viem";
import { OMAHA_CONTRACT } from "../contracts/omaha-contract";
import { USDC_CONTRACT } from "../contracts/usdc";
import { parseUnits } from "viem";

export default function MintHandButton() {
  const { address, isConnected } = useAccount();
//   const [tokenId, setTokenId] = useState<bigint | null>(null);

  // Write contract configuration
  const { writeContract, data: hash, isPending: txLoading, error: txError } = useWriteContract();

  console.log('txError', txError);

  // Wait for transaction receipt
  const { isLoading: confirming } = useWaitForTransactionReceipt({
    hash,
  });

  // Check USDC allowance
  const { data: allowance } = useReadContract({
    ...USDC_CONTRACT,
    functionName: "allowance",
    args: [address!, OMAHA_CONTRACT.address],
    query: {
      enabled: !!address,
    },
  });

  console.log('allowance', allowance);

  const requiredAllowance = parseUnits("1", 6); // 1 USDC with 6 decimals
  const needsApproval = !allowance || allowance < requiredAllowance;

  // Watch for HandBought event
  useWatchContractEvent({
    address: OMAHA_CONTRACT.address,
    abi: OMAHA_CONTRACT.abi,
    eventName: 'HandBought',
    onLogs: async (logs) => {
      console.log('HandBought event logs:', logs);
      
      try {
        const { args } = logs[0];
        if (!args) {
          console.error('No args found in HandBought event');
          return;
        }

        const { game_id, user, token_id, fid } = args;
        
        if (!token_id || !game_id || !user || !fid) {
          console.error('Missing required event data:', { game_id, user, token_id, fid });
          return;
        }

        console.log('HandBought event details:', {
          gameId: game_id.toString(),
          tokenId: token_id.toString(),
          user,
          fid: fid.toString()
        });

        // Notify backend so it can insert into `hands`
        await fetch("/api/mint-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId: game_id.toString(),
            tokenId: token_id.toString(),
            txHash: hash,
            player: user,
            fid: fid.toString()
          }),
        });
      } catch (error) {
        console.error('Error processing HandBought event:', error);
      }
    },
  });

  const handleApprove = () => {
    if (!address) return;
    
    writeContract({
      ...USDC_CONTRACT,
      functionName: "approve",
      args: [OMAHA_CONTRACT.address, requiredAllowance],
    });
  };

  const handleMint = () => {
    if (!address) return;
    
    writeContract({
      ...OMAHA_CONTRACT,
      functionName: "buy_hand",
      args: [BigInt(0), BigInt(788), "https://pink-changing-earwig-765.mypinata.cloud/ipfs/bafkreifpjmf5m4n77e3cx5gsaxmqdtjfbg4na3ftwvfvvvd3ezwb6nsbky"],
    });
  };

  if (!isConnected) {
    return (
      <button
        disabled
        className="rounded bg-emerald-600 px-6 py-3 text-white disabled:opacity-40"
      >
        Connect wallet to continue
      </button>
    );
  }

  if (needsApproval) {
    return (
      <button
        disabled={txLoading || confirming}
        onClick={handleApprove}
        className="rounded bg-emerald-600 px-6 py-3 text-white disabled:opacity-40"
      >
        {txLoading && "Waiting for wallet…"}
        {confirming && "Approving…"}
        {!txLoading && !confirming && "Approve USDC"}
      </button>
    );
  }

  return (
    <button
      disabled={txLoading || confirming}
      onClick={handleMint}
      className="rounded bg-emerald-600 px-6 py-3 text-white disabled:opacity-40"
    >
      {txLoading && "Waiting for wallet…"}
      {confirming && "Minting…"}
      {!txLoading && !confirming && "Mint hand (1 USDC)"}
    </button>
  );
}