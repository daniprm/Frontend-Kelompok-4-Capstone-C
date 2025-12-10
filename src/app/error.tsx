'use client';

import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="particle w-32 h-32 top-10 left-10 opacity-30 animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="particle w-24 h-24 bottom-20 right-20 opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="glass-dark border-2 border-red-500/30 overflow-hidden shadow-2xl backdrop-blur-xl animate-bounce-in">
            <div className="h-2 bg-red-500"></div>

            <div className="p-12 text-center">
              {/* Icon */}
              <div className="w-32 h-32 bg-red-500 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <AlertTriangle className="w-16 h-16 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-5xl font-extrabold text-white mb-6">
                Terjadi Kesalahan
              </h2>

              {/* Error Message */}
              <div className="mb-10">
                <p className="text-gray-300 text-xl mb-6">
                  {error.message ||
                    'Maaf, terjadi kesalahan yang tidak terduga.'}
                </p>
                {error.digest && (
                  <p className="text-sm text-gray-400 font-mono glass border border-blue-600/50 p-4">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <RotateCcw className="w-6 h-6" />
                  Coba Lagi
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Home className="w-6 h-6" />
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
