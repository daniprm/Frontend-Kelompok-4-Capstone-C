import { Metadata } from 'next';
import { getDestinations } from '@/services/destinationService';
import DestinationCard from '@/components/DestinationCard';

export const metadata: Metadata = {
  title: 'Lihat Semua Destinasi | Wisata Surabaya',
  description:
    'Jelajahi semua destinasi wisata kuliner dan non-kuliner yang tersedia di Surabaya',
};

export default async function LihatSemuaPage() {
  const destinations = await getDestinations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle w-32 h-32 top-10 left-10 opacity-30 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-24 h-24 top-40 right-20 opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="particle w-40 h-40 bottom-20 left-1/4 opacity-25 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white py-24 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-center gap-8 animate-fade-in-up">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-tight leading-tight">
                <span className="text-white">Semua </span>
                <span className="text-blue-400 text-7xl md:text-8xl">Destinasi</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed">
                Jelajahi <span className="text-blue-400 font-bold">{destinations.length}</span> destinasi wisata kuliner dan
                non-kuliner di Surabaya
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Info Banner */}
          <div className="glass-dark border-2 border-blue-600/30 rounded-3xl p-8 mb-12 backdrop-blur-xl animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Destinasi Pilihan</h3>
                  <p className="text-gray-300">Koleksi lengkap tempat wisata terbaik</p>
                </div>
              </div>
              <div className="glass border border-blue-600/50 px-6 py-3 rounded-full">
                <span className="text-gray-300 font-semibold">Total: </span>
                <span className="text-3xl font-bold text-white">{destinations.length}</span>
                <span className="text-blue-400 ml-2">destinasi</span>
              </div>
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {destinations.map((destination, index) => (
              <div 
                key={destination.place_id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <DestinationCard destination={destination} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {destinations.length === 0 && (
            <div className="text-center py-32 animate-fade-in-up">
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl neon-glow animate-pulse-scale">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white mb-4">
                Belum ada destinasi yang tersedia
              </p>
              <p className="text-xl text-cyan-200">
                Destinasi akan segera ditambahkan ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
