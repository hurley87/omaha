import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thanks for Playing | Omaha',
  description: 'Thank you for participating in the game.',
};

export default function ThanksPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thanks for Playing!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your decision has been recorded. We appreciate your participation.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
} 