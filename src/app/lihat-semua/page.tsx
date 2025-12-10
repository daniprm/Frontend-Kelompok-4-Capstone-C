import { Metadata } from 'next';
import { getDestinations } from '@/services/destinationService';
import DestinationGrid from '@/components/DestinationGrid';

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
        <div
          className="particle w-32 h-32 top-10 left-10 opacity-30 animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="particle w-24 h-24 top-40 right-20 opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="particle w-40 h-40 bottom-20 left-1/4 opacity-25 animate-float"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white py-24 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-center gap-8 animate-fade-in-up">
            <div className="relative">
              <div className="w-28 h-28 bg-white flex items-center justify-center shadow-2xl">
                <svg
                  className="w-16 h-16 text-blue-600"
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
                <span className="text-white">Semua Destinasi</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed">
                Jelajahi{' '}
                <span className="font-bold">{destinations.length}</span>{' '}
                destinasi wisata kuliner dan non-kuliner di Surabaya
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Destinations Grid with Pagination */}
          <DestinationGrid destinations={destinations} itemsPerPage={12} />
        </div>
      </div>
    </div>
  );
}
