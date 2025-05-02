import { getMostRecentPendingHand } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { PlayButton } from '@/app/components/play-button';
import FoldButton from '@/app/components/fold-button';
import { Icon } from '@/app/components/DemoComponents';

// Helper function to convert card code to display format
const formatCard = (card: string): { value: string; suit: string } => {
  const value = card.slice(0, -1);
  const suit = card.slice(-1).toLowerCase();
  
  const suitSymbols: Record<string, string> = {
    'c': '♣',
    'd': '♦',
    'h': '♥',
    's': '♠'
  };

  return {
    value,
    suit: suitSymbols[suit] || suit
  };
};

interface GamePageProps {
  params: {
    gameId: string;
  };
  searchParams: {
    wallet?: string;
  };
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const gameId = parseInt(params.gameId); 
  const wallet = searchParams.wallet as `0x${string}`;

  if (!wallet || isNaN(gameId)) {
    notFound();
  }

  const hand = await getMostRecentPendingHand(wallet);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)] bg-gradient-to-b">
      <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col justify-center h-full">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="relative">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[var(--app-accent)] via-[#0052FF] to-[var(--app-accent)] bg-clip-text text-transparent animate-gradient-x">
                Game #{gameId}
              </h1>
              <div className="absolute -top-4 -right-4 w-8 h-8 animate-bounce">
                <Icon name="star" size="lg" className="text-[var(--app-accent)]" />
              </div>
              <p className="text-[var(--app-foreground)]/80 mt-2 font-mono text-sm">
                {wallet.slice(0, 6)}...{wallet.slice(-4)}
              </p>
            </div>

            {/* Main Content */}
            {!hand ? (
              <div className="bg-[var(--app-background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-4 text-[var(--app-foreground)]">No Hand Found</h2>
                  <p className="text-[var(--app-foreground)]/80">
                    {`You don't have a hand in this game yet. Mint a new hand to get started!`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--app-background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="space-y-6">
                  {/* Token ID Section */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[var(--app-foreground)]">Your Hand</h2>
                    <span className="px-4 py-2 bg-[var(--app-accent)]/10 text-[var(--app-accent)] rounded-full text-sm font-medium">
                      Token #{hand.token_id}
                    </span>
                  </div>

                  {/* Cards Display */}
                  <div className="grid grid-cols-5 gap-4">
                    {hand.cards.map((card: string, index: number) => {
                      const { value, suit } = formatCard(card);
                      return (
                        <div
                          key={index}
                          className="aspect-[2.5/3.5] bg-[var(--app-accent)]/5 hover:bg-[var(--app-accent)]/10 rounded-xl p-4 flex items-center justify-center border border-[var(--app-accent)]/20 shadow-sm transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <span className="text-xl font-bold text-[var(--app-accent)]">
                            {value}{suit}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Decision Section */}
                  <div className="pt-6 border-t border-[var(--app-accent)]/10">
                    {hand.decision ? (
                      <div className="space-y-4">
                        {hand.decision === 'fold' && (
                          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center">
                            <p className="font-medium">You folded this hand</p>
                          </div>
                        )}
                        {hand.decision === 'play' && (
                          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center">
                            <p className="font-medium">You played this hand</p>
                          </div>
                        )}
                        {hand.decision === 'pending' && (
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <PlayButton tokenId={hand.token_id} />
                              <FoldButton 
                                tokenId={hand.token_id} 
                                gameId={gameId.toString()}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 