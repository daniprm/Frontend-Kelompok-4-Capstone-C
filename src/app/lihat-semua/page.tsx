import { Metadata } from 'next'
import { getDestinations } from '@/services/destinationService'
import DestinationCard from '@/components/DestinationCard'

export const metadata: Metadata = {
  title: 'Lihat Semua Destinasi | Wisata Surabaya',
  description: 'Jelajahi semua destinasi wisata kuliner dan non-kuliner yang tersedia di Surabaya'
}

export default async function LihatSemuaPage() {
  const destinations = await getDestinations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative w-16 h-16 bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-emerald-300">
                  Semua Destinasi
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide">
                Jelajahi {destinations.length} destinasi wisata kuliner dan non-kuliner menakjubkan di Surabaya
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 md:px-12 py-12">
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
            <div className="inline-block relative mb-6">
              <div className="absolute inset-0 bg-slate-700 blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
              Belum ada destinasi yang tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  )
}