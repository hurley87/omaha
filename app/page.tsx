"use client";

import {
  useMiniKit,
  useAddFrame,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import MintHandButton from "./components/MintHandButton";


export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);

  const addFrame = useAddFrame();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center py-8 px-4">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--app-accent)] to-[#0052FF] bg-clip-text text-transparent">
              Welcome to Onchain Omaha
            </h1>
            <div className="mt-4 space-y-6 max-w-2xl">
            <div className="bg-[var(--app-background)]/50 backdrop-blur-sm rounded-xl p-6 border border-[var(--app-accent)]/20">
              <p className="text-lg font-medium mb-4">
                Mint a 5‑card NFT hand for just $1, peek at your cards, then choose:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--app-accent)]">•</span>
                  <span><strong>Play</strong> – lock your hand, chase the growing pot, and battle up to nine other players.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--app-accent)]">•</span>
                  <span><strong>Fold</strong> – cash back 90 ¢ and live to fight the next deck.</span>
                </li>
              </ul>
              <p className="text-[var(--app-foreground)]/90">
                Every time 10 hands lock in, the contract auto‑reveals all cards, crowns the best hand, and ships the entire pot—provably fair, fully on‑chain.
              </p>
            </div>
          </div>
          </div>
        </main>

        <footer className="mt-auto pt-8 pb-4 flex justify-center">
          <MintHandButton />
        </footer>
      </div>
    </div>
  );
}
