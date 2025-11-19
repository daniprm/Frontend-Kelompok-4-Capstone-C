import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-1 bg-[#F59E0B]"></div>

            <div className="p-12 text-center">
              {/* Icon */}
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-gray-400" />
              </div>

              {/* 404 */}
              <div className="text-8xl font-bold text-[#F59E0B] mb-4">404</div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Halaman Tidak Ditemukan
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-8 text-lg">
                Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
                dipindahkan.
              </p>

              {/* Button */}
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
