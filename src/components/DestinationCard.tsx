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
    <div className="group relative glass-dark border-2 border-blue-200 hover:border-blue-400 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full animate-fade-in-up backdrop-blur-xl">
      {showOrder && (
        <div className="absolute top-4 left-4 z-20 animate-bounce-in">
          <div className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center font-bold text-xl shadow-xl transition-transform duration-300">
            {destination.order}
          </div>
        </div>
      )}

      {/* Enhanced Image Section */}
      <div className="relative h-72 w-full bg-gray-200 overflow-hidden">
        <Image
          src={
            destination.image_url ||
            destination.gambar ||
            `https://picsum.photos/seed/${destination.nama}/600/400`
          }
          alt={destination.nama}
          fill
          className="object-cover group-hover:scale-110 transition-all duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>

        {destination.rating && (
          <div className="absolute top-4 right-4 z-10 animate-bounce-in">
            <div className="flex items-center gap-2 glass backdrop-blur-md px-4 py-2.5 shadow-xl border border-blue-600/50">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg font-bold text-white">
                {destination.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section with Enhanced Design */}
      <div className="relative p-8 flex flex-col flex-grow z-10">
        <h3 className="font-bold text-2xl text-gray-900 mb-5 line-clamp-2 leading-tight min-h-[3.5rem] group-hover:text-blue-600 transition-colors duration-300">
          {destination.nama}
        </h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {destination.kategori.slice(0, 3).map((kat, idx) => (
            <span
              key={idx}
              className="text-xs border border-blue-600 text-blue-600 px-4 py-2 font-semibold bg-white hover:bg-blue-600 hover:text-white transition-all duration-300 uppercase tracking-wider animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {categoryLabels[kat] || kat}
            </span>
          ))}
          {destination.kategori.length > 3 && (
            <span className="text-xs glass border border-blue-700/50 text-blue-300 px-4 py-2 font-bold hover:bg-blue-700 hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer">
              +{destination.kategori.length - 3}
            </span>
          )}
        </div>

        {destination.deskripsi && (
          <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
            {destination.deskripsi}
          </p>
        )}

        <Link
          href={`/destination/${encodeURIComponent(
            destination.place_id ?? ''
          )}`}
          className="group/btn flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 shadow-xl transition-all duration-300 mt-auto transform hover:scale-105"
        >
          <span>LIHAT DETAIL</span>
          <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}
