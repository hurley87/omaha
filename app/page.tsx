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
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)] bg-gradient-to-b">
      <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit hover:text-[var(--app-accent)] transition-colors" />
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

        <main className="flex-1 flex flex-col justify-center h-full">
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[var(--app-accent)] via-[#0052FF] to-[var(--app-accent)] bg-clip-text text-transparent animate-gradient-x">
                Welcome to Onchain Omaha
              </h1>
              <div className="absolute -top-4 -right-4 w-8 h-8 animate-bounce">
                <Icon name="star" size="lg" className="text-[var(--app-accent)]" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[var(--app-background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">                
                <p className="text-lg font-medium mb-6 text-[var(--app-foreground)]/90">
                  Mint a 5‑card NFT hand for just $1, peek at your cards, then choose:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--app-accent)]/5 hover:bg-[var(--app-accent)]/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[var(--app-accent)]/20 flex items-center justify-center flex-shrink-0">
                      <Icon name="arrow-right" size="sm" className="text-[var(--app-accent)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--app-accent)]">Play</p>
                      <p className="text-[var(--app-foreground)]/80">Lock your hand, chase the growing pot, and battle up to nine other players.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--app-accent)]/5 hover:bg-[var(--app-accent)]/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[var(--app-accent)]/20 flex items-center justify-center flex-shrink-0">
                      <Icon name="check" size="sm" className="text-[var(--app-accent)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--app-accent)]">Fold</p>
                      <p className="text-[var(--app-foreground)]/80">Cash back 90 ¢ and live to fight the next deck.</p>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </main>

        <div className="mt-auto pt-8 pb-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--app-accent)] to-[#0052FF] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <MintHandButton />
          </div>
        </div>
      </div>
    </div>
  );
}
