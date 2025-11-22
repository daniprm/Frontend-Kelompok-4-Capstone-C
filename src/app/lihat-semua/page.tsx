import { Metadata } from 'next';
import { getDestinations } from '@/services/destinationService';
import DestinationCard from '@/components/DestinationCard';
import { MapPin, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lihat Semua Destinasi | Wisata Surabaya',
  description:
    'Jelajahi semua destinasi wisata kuliner dan non-kuliner yang tersedia di Surabaya',
};

export default async function LihatSemuaPage() {
  const destinations = await getDestinations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 text-white py-28 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-3xl flex items-center justify-center transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
                <MapPin className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight animate-fade-in-up">
                <span className="text-white">Semua </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 animate-gradient-shift">Destinasi</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Jelajahi <span className="font-bold text-cyan-300">{destinations.length} destinasi</span> wisata kuliner dan
                non-kuliner menakjubkan di <span className="font-bold text-blue-300">Kota Pahlawan</span>
              </p>
              <div className="mt-6 flex items-center justify-center md:justify-start gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-sm font-semibold text-white">🍽️ Kuliner</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-sm font-semibold text-white">🏛️ Wisata</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-sm font-semibold text-white">✅ Halal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative py-16 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-cyan-50/20 to-gray-50" />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-r from-cyan-200/20 to-indigo-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
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
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Belum Ada Destinasi
              </h3>
              <p className="text-xl text-gray-600">
                Destinasi wisata akan segera hadir
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
