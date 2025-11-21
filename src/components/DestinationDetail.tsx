'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Destination } from '@/types';
import { ArrowLeft, MapPin, Clock, Star } from 'lucide-react';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      {/* <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-6 md:px-12">
          <Link
            href="/lihat-semua"
            className="inline-flex items-center gap-2 text-white hover:text-[#F59E0B] transition-colors duration-200 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Semua Destinasi</span>
          </Link>
        </div>
      </div> */}

      {/* Hero Image */}
      <div className="relative h-[500px] w-full bg-gradient-to-br from-gray-200 to-gray-300">
        <Image
          src={
            destination.image_url ||
            destination.gambar ||
            `https://picsum.photos/seed/${destination.place_id}/1920/800`
          }
          alt={destination.nama}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {destination.nama}
            </h1>
            <div className="flex flex-wrap gap-3">
              {destination.kategori.map((kat, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-[#F59E0B] text-white font-semibold text-sm uppercase tracking-wide shadow-lg"
                >
                  {categoryLabels[kat] || kat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-1 bg-[#F59E0B]"></div>
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Tentang Destinasi
                  </h2>
                  {destination.deskripsi ? (
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                      {destination.deskripsi}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Deskripsi belum tersedia untuk destinasi ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Map Card */}
              <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-1 bg-[#F59E0B]"></div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#F59E0B] flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Lokasi</h2>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
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
              <div className="bg-white shadow-lg border border-gray-200 overflow-hidden sticky top-4">
                <div className="h-1 bg-[#F59E0B]"></div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informasi
                  </h2>

                  <div className="space-y-6">
                    {/* Rating */}
                    {destination.rating && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 border-l-4 border-[#F59E0B]">
                        <div className="w-10 h-10 bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
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
                      <div className="flex items-start gap-4 p-4 bg-gray-50 border-l-4 border-gray-700">
                        <div className="w-10 h-10 bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            Alamat
                          </p>
                          <p className="text-base text-gray-800 leading-relaxed">
                            {destination.alamat}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Opening Hours */}
                    {destination.jam_buka && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 border-l-4 border-gray-600">
                        <div className="w-10 h-10 bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            Jam Buka
                          </p>
                          <p className="text-base text-gray-800 font-medium">
                            {destination.jam_buka}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Coordinates */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 border-l-4 border-gray-500">
                      <div className="w-10 h-10 bg-gray-500 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          Koordinat
                        </p>
                        <p className="text-sm text-gray-800 font-mono">
                          {destination.coordinates[0].toFixed(6)},{' '}
                          {destination.coordinates[1].toFixed(6)}
                        </p>
                      </div>
                    </div>
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
