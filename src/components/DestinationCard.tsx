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
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200 flex flex-col h-full transform hover:-translate-y-2">
      {/* Gradient glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:via-cyan-500/10 group-hover:to-indigo-500/10 rounded-2xl transition-all duration-500 pointer-events-none" />
      
      {showOrder && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            {destination.order}
          </div>
        </div>
      )}

      {/* Enhanced Image Section */}
      <div className="relative h-64 w-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        <Image
          src={
            destination.image_url ||
            destination.gambar ||
            `https://picsum.photos/seed/${destination.nama}/600/400`
          }
          alt={destination.nama}
          fill
          className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

        {destination.rating && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl border-2 border-white/50 transform transition-all duration-300 group-hover:scale-110">
              <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
              <span className="text-base font-bold text-gray-900">
                {destination.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section with Enhanced Design */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 leading-tight min-h-[3.5rem] group-hover:text-blue-600 transition-colors duration-300">
          {destination.nama}
        </h3>

        <div className="flex flex-wrap gap-2 mb-5">
          {destination.kategori.slice(0, 2).map((kat, idx) => (
            <span
              key={idx}
              className="text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-4 py-2 rounded-full font-semibold border-2 border-gray-200 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-600 hover:text-white hover:border-blue-400 transition-all duration-300 uppercase tracking-wide shadow-sm"
            >
              {categoryLabels[kat] || kat}
            </span>
          ))}
          {destination.kategori.length > 2 && (
            <span className="text-xs bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 px-4 py-2 rounded-full font-bold border-2 border-cyan-200 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-cyan-700 hover:text-white hover:border-cyan-500 transition-all duration-300 cursor-pointer shadow-sm">
              +{destination.kategori.length - 2}
            </span>
          )}
        </div>

        {destination.deskripsi && (
          <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
            {destination.deskripsi}
          </p>
        )}

        <Link
          href={`/destination/${encodeURIComponent(
            destination.place_id ?? ''
          )}`}
          className="group/btn relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-auto overflow-hidden transform hover:scale-105"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          <span className="relative z-10">LIHAT DETAIL</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}
