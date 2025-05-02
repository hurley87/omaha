import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient } from "wagmi";
import { keccak256, decodeEventLog } from "viem";
import { OMAHA_CONTRACT } from "../contracts/omaha-contract";
import { USDC_CONTRACT } from "../contracts/usdc";
import { parseUnits } from "viem";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MintHandButton() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const router = useRouter();

  const { writeContract, data: hash, isPending: txLoading, error: txError } = useWriteContract();

  console.log('txError', txError);

  // Check USDC allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
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

  // Wait for transaction receipt
  const { isLoading: confirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  // Refetch allowance when transaction is successful
  useEffect(() => {
    if (isSuccess && hash) {
      refetchAllowance();
    }
  }, [isSuccess, hash, refetchAllowance]);

  // Process HandBought event from receipt
  useEffect(() => {
    const processHandBoughtEvent = async () => {
      if (!isSuccess || !receipt || !hash || !publicClient) return;

      console.log('receipt', receipt);

      try {
        // Calculate the event signature hash
        const handBoughtEventAbi = OMAHA_CONTRACT.abi.find(
          (item) => item.type === 'event' && item.name === 'HandBought'
        );
        
        if (!handBoughtEventAbi) {
          console.error('HandBought event ABI not found');
          return;
        }

        const eventSignature = `${handBoughtEventAbi.name}(${handBoughtEventAbi.inputs.map(input => input.type).join(',')})`;
        const eventHash = keccak256(new TextEncoder().encode(eventSignature));

        // Get the HandBought event from the receipt
        const handBoughtEvent = receipt.logs.find(
          (log) => 
            log.address.toLowerCase() === OMAHA_CONTRACT.address.toLowerCase() &&
            log.topics[0] === eventHash
        );

        if (!handBoughtEvent) {
          console.error('HandBought event not found in receipt');
          return;
        }

        // Decode the event data
        const decodedEvent = decodeEventLog({
          abi: OMAHA_CONTRACT.abi,
          data: handBoughtEvent.data,
          topics: handBoughtEvent.topics,
        });

        // Type guard to ensure we have the correct event type
        if (decodedEvent.eventName !== 'HandBought') {
          console.error('Decoded event is not HandBought');
          return;
        }

        const { game_id, user, token_id, fid } = decodedEvent.args;

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

        // redirect to /game/game_id
        router.push(`/game/${game_id.toString()}?wallet=${user}`);
      } catch (error) {
        console.error('Error processing HandBought event from receipt:', error);
      }
    };

    processHandBoughtEvent();
  }, [isSuccess, receipt, hash, publicClient]);

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
        className="relative rounded-lg bg-blue-600/90 py-8 text-white disabled:opacity-40 w-full text-2xl font-bold 
        shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30
        border border-blue-400/20 backdrop-blur-sm"
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
        className="relative rounded-lg bg-blue-600/90 py-8 text-white disabled:opacity-40 w-full text-2xl font-bold 
        shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30
        border border-blue-400/20 backdrop-blur-sm
        hover:bg-blue-500 active:bg-blue-700 disabled:hover:bg-blue-600/90"
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
      className="relative rounded-lg bg-blue-600/90 py-8 text-white disabled:opacity-40 w-full text-2xl font-bold 
      shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30
      border border-blue-400/20 backdrop-blur-sm
      hover:bg-blue-500 active:bg-blue-700 disabled:hover:bg-blue-600/90
      before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-blue-400/0 before:via-blue-400/10 before:to-blue-400/0
      before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000"
    >
      {txLoading && "Waiting for wallet…"}
      {confirming && "Minting…"}
      {!txLoading && !confirming && "Mint hand (1 USDC)"}
    </button>
  );
}