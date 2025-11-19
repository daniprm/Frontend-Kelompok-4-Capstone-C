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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#F59E0B] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                <span className="text-white">Semua </span>
                <span className="text-[#F59E0B]">Destinasi</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Jelajahi {destinations.length} destinasi wisata kuliner dan
                non-kuliner menakjubkan di Surabaya
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 md:px-12">
          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.place_id}
                destination={destination}
              />
            ))}
          </div>

          {/* Empty State */}
          {destinations.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <p className="text-xl font-semibold text-gray-700">
                Belum ada destinasi yang tersedia
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
