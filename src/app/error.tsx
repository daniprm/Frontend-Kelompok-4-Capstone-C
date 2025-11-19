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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-1 bg-[#F59E0B]"></div>

            <div className="p-12 text-center">
              {/* Icon */}
              <div className="w-24 h-24 bg-red-50 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Terjadi Kesalahan
              </h2>

              {/* Error Message */}
              <div className="mb-8">
                <p className="text-gray-600 text-lg mb-4">
                  {error.message ||
                    'Maaf, terjadi kesalahan yang tidak terduga.'}
                </p>
                {error.digest && (
                  <p className="text-sm text-gray-500 font-mono bg-gray-50 p-3 border border-gray-200">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <RotateCcw className="w-5 h-5" />
                  Coba Lagi
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-700 hover:bg-gray-800 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
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
