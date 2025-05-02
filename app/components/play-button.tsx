'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PlayButtonProps {
  tokenId: number;
}

export function PlayButton({ tokenId }: PlayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId, decision: 'play' }),
      });

      if (!response.ok) {
        throw new Error('Failed to set decision');
      }

      // redirect to /thanks/play
      router.push('/thanks/play');
    } catch (error) {
      console.error('Error setting decision:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Playing...' : 'Play'}
    </button>
  );
} 