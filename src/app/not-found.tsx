import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle w-32 h-32 top-10 left-10 opacity-30 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-24 h-24 bottom-20 right-20 opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="glass-dark border-2 border-blue-600/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl animate-bounce-in">
            <div className="h-2 bg-blue-600"></div>

            <div className="p-12 text-center">
              {/* Icon */}
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <AlertCircle className="w-16 h-16 text-white" />
              </div>

              {/* 404 */}
              <div className="text-9xl font-extrabold text-blue-400 mb-6 animate-pulse">404</div>

              {/* Title */}
              <h2 className="text-5xl font-extrabold text-white mb-6">
                Halaman Tidak Ditemukan
              </h2>

              {/* Description */}
              <p className="text-gray-300 mb-10 text-xl">
                Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
                dipindahkan
              </p>

              {/* Button */}
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Home className="w-6 h-6" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
