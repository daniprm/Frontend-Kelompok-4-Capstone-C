'use client';

import { Destination } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  showOrder?: boolean;
}

export default function DestinationCard({
  destination,
  showOrder = false,
}: DestinationCardProps) {
  const categoryLabels: { [key: string]: string } = {
    makanan_berat: 'Makanan Berat',
    makanan_ringan: 'Makanan Ringan',
    halal: 'Halal',
    wisata_alam: 'Wisata Alam',
    wisata_budaya: 'Wisata Budaya',
    wisata_kuliner: 'Wisata Kuliner',
    belanja: 'Belanja',
    hiburan: 'Hiburan',
    // Add these missing ones:
    oleh_oleh: 'Oleh-oleh',
    mall: 'Mall',
    non_kuliner: 'Non Kuliner',
    play: 'Bermain',
    kantor_pariwisata: 'Kantor Pariwisata',
    all: 'Semua',
  };

  return (
    <div className="group bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full">
      {showOrder && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-[#F59E0B] text-white w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
            {destination.order}
          </div>
        </div>
      )}

      {/* Enhanced Image Section */}
      <div className="relative h-72 w-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        <Image
          src={
            destination.image_url ||
            destination.gambar ||
            `https://picsum.photos/seed/${destination.nama}/600/400`
          }
          alt={destination.nama}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Dynamic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

        {destination.rating && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg border border-gray-200">
              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-base font-bold text-gray-800">
                {destination.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section with Enhanced Design */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 leading-tight min-h-[3.5rem]">
          {destination.nama}
        </h3>

        <div className="flex flex-wrap gap-2 mb-5">
          {destination.kategori.slice(0, 3).map((kat, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 font-medium border border-gray-300 hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B] transition-all duration-200 uppercase tracking-wide"
            >
              {categoryLabels[kat] || kat}
            </span>
          ))}
          {destination.kategori.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-4 py-2 font-semibold border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all duration-300 cursor-pointer">
              +{destination.kategori.length - 3}
            </span>
          )}
        </div>

        {destination.deskripsi && (
          <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
            {destination.deskripsi}
          </p>
        )}

        <Link
          href={`/destination/${encodeURIComponent(
            destination.place_id ?? ''
          )}`}
          className="group/btn flex items-center justify-center gap-2 w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold py-4 px-6 transition-colors duration-200 mt-auto"
        >
          LIHAT DETAIL
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
}
