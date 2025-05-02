'use client';

import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { keccak256, decodeEventLog } from "viem";
import { OMAHA_CONTRACT } from "../contracts/omaha-contract";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface FoldButtonProps {
  tokenId: string;
  gameId: string;
}

export default function FoldButton({ tokenId, gameId }: FoldButtonProps) {
  const publicClient = usePublicClient();
  const router = useRouter();

  const { writeContract, data: hash, isPending: txLoading, error: txError } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: confirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  // Process HandFolded event from receipt
  useEffect(() => {
    const processHandFoldedEvent = async () => {
      if (!isSuccess || !receipt || !hash || !publicClient) return;

      try {
        // Calculate the event signature hash
        const handFoldedEventAbi = OMAHA_CONTRACT.abi.find(
          (item) => item.type === 'event' && item.name === 'HandFolded'
        );
        
        if (!handFoldedEventAbi) {
          console.error('HandFolded event ABI not found');
          return;
        }

        const eventSignature = `${handFoldedEventAbi.name}(${handFoldedEventAbi.inputs.map(input => input.type).join(',')})`;
        const eventHash = keccak256(new TextEncoder().encode(eventSignature));

        // Get the HandFolded event from the receipt
        const handFoldedEvent = receipt.logs.find(
          (log) => 
            log.address.toLowerCase() === OMAHA_CONTRACT.address.toLowerCase() &&
            log.topics[0] === eventHash
        );

        if (!handFoldedEvent) {
          console.error('HandFolded event not found in receipt');
          return;
        }

        // Decode the event data
        const decodedEvent = decodeEventLog({
          abi: OMAHA_CONTRACT.abi,
          data: handFoldedEvent.data,
          topics: handFoldedEvent.topics,
        });

        // Type guard to ensure we have the correct event type
        if (decodedEvent.eventName !== 'HandFolded') {
          console.error('Decoded event is not HandFolded');
          return;
        }

        const { game_id, user, token_id, refund_amount } = decodedEvent.args;

        // Notify backend to update the hand's decision
        await fetch("/api/fold-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId: game_id.toString(),
            tokenId: token_id.toString(),
            txHash: hash,
            player: user,
            refundAmount: refund_amount.toString()
          }),
        });

        // Refresh the page to show updated state
        router.refresh();
      } catch (error) {
        console.error('Error processing HandFolded event from receipt:', error);
      }
    };

    processHandFoldedEvent();
  }, [isSuccess, receipt, hash, publicClient, router]);

  const handleFold = () => {
    writeContract({
      ...OMAHA_CONTRACT,
      functionName: "fold_hand",
      args: [BigInt(gameId), BigInt(tokenId)],
    });
  };

  return (
    <button
      disabled={txLoading || confirming}
      onClick={handleFold}
      className="rounded bg-red-600 px-6 py-3 text-white disabled:opacity-40"
    >
      {txLoading && "Waiting for wallet…"}
      {confirming && "Folding…"}
      {!txLoading && !confirming && "Fold Hand"}
    </button>
  );
} 