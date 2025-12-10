'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Destination } from '@/types';
import { MapPin, Clock, Star } from 'lucide-react';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface DestinationDetailProps {
  destination: Destination;
}

export default function DestinationDetail({
  destination,
}: DestinationDetailProps) {
  const categoryLabels: { [key: string]: string } = {
    makanan_berat: 'Makanan Berat',
    makanan_ringan: 'Makanan Ringan',
    halal: 'Halal',
    wisata_alam: 'Wisata Alam',
    wisata_budaya: 'Wisata Budaya',
    wisata_kuliner: 'Wisata Kuliner',
    belanja: 'Belanja',
    hiburan: 'Hiburan',
    oleh_oleh: 'Oleh-oleh',
    mall: 'Mall',
    non_kuliner: 'Non Kuliner',
    play: 'Bermain',
    kantor_pariwisata: 'Kantor Pariwisata',
    all: 'Semua',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="particle w-32 h-32 top-10 right-10 opacity-30 animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="particle w-24 h-24 bottom-20 left-20 opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="particle w-40 h-40 top-1/2 right-1/4 opacity-25 animate-float"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[600px] w-full bg-gray-200 overflow-hidden">
        <Image
          src={
            destination.image_url ||
            destination.gambar ||
            `https://picsum.photos/seed/${destination.place_id}/1920/800`
          }
          alt={destination.nama}
          fill
          className="object-cover brightness-75 hover:scale-105 transition-transform duration-500"
          priority
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gray-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 z-10">
          <div className="container mx-auto animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
              {destination.nama}
            </h1>
            <div className="flex flex-wrap gap-3">
              {destination.kategori.map((kat, idx) => (
                <span
                  key={idx}
                  className="px-6 py-3 border-2 bg-white border-blue-600 text-blue-600 font-bold text-sm uppercase tracking-widest shadow-2xl transition-all duration-300 animate-bounce-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {categoryLabels[kat] || kat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              <div className="bg-white border-2 border-blue-200 overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="h-2 bg-blue-600"></div>
                <div className="p-10">
                  <h2 className="text-4xl font-extrabold mb-6 text-gray-900">
                    Tentang Destinasi
                  </h2>
                  {destination.deskripsi ? (
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                      {destination.deskripsi}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic text-lg">
                      Deskripsi belum tersedia untuk destinasi ini
                    </p>
                  )}
                </div>
              </div>

              {/* Map Card */}
              <div
                className="bg-white border-2 border-blue-200 overflow-hidden shadow-2xl animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="h-2 bg-blue-600"></div>
                <div className="p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-blue-600  flex items-center justify-center shadow-xl">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900">
                      Lokasi
                    </h2>
                  </div>
                  <div className=" overflow-hidden shadow-2xl border-2 border-blue-600/50">
                    <MapComponent
                      destinations={[destination]}
                      userLocation={destination.coordinates}
                      height="400px"
                      showRoute={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              <div
                className="bg-white border-2 border-blue-200 overflow-hidden shadow-2xl sticky top-4 animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="h-2 bg-blue-600"></div>
                <div className="p-8">
                  <h2 className="text-3xl font-extrabold mb-8 text-gray-900">
                    Informasi
                  </h2>

                  <div className="space-y-6">
                    {/* Rating */}
                    {destination.rating && (
                      <div className="flex items-start gap-4 p-6 bg-blue-50 border-2 border-blue-200  hover:border-blue-400 transition-colors duration-300">
                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-white fill-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            Rating
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {destination.rating.toFixed(1)} / 5.0
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    {destination.alamat && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 border-l-4 border-blue-600">
                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            Alamat
                          </p>
                          <p className="text-base text-gray-700 leading-relaxed">
                            {destination.alamat}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Opening Hours */}
                    {destination.jam_buka && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 border-l-4 border-blue-600">
                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            Jam Buka
                          </p>
                          <p className="text-base text-gray-700 font-medium">
                            {destination.jam_buka}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Coordinates */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 border-l-4 border-blue-600">
                      <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          Koordinat
                        </p>
                        <p className="text-sm text-gray-700 font-mono">
                          {destination.coordinates[0].toFixed(6)},{' '}
                          {destination.coordinates[1].toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps Button */}
                  <div className="mt-6">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${destination.coordinates[0]},${destination.coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6  transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      <MapPin className="w-5 h-5" />
                      <span>Buka di Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
