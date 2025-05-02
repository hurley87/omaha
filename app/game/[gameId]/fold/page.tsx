import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hand Folded | Omaha Poker',
  description: 'Your hand has been folded successfully.',
};

interface FoldPageProps {
  params: {
    gameId: string;
  };
}

export default function FoldPage({ params }: FoldPageProps) {
  const gameId = params.gameId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Hand Folded</h1>
          <p className="text-gray-300 mb-8">
            You have successfully folded your hand in Game #{gameId}. Your chips have been returned to your balance.
          </p>
          
          <div className="space-y-4">
            <Link
              href={`/game/${gameId}`}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Return to Game
            </Link>
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Start New Game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 