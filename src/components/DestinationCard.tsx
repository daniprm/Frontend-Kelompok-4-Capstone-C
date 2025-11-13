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
    <div className="group relative bg-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 hover:scale-[1.02]">
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      <div className="absolute inset-[2px] bg-white -z-5"></div>

      {showOrder && (
        <div className="absolute top-6 left-6 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-slate-700 blur-lg opacity-50 animate-glow-pulse"></div>
            <div className="relative bg-gradient-to-br from-slate-700 to-slate-900 text-white w-14 h-14 flex items-center justify-center font-bold text-xl shadow-2xl">
              {destination.order}
            </div>
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

        {/* Floating rating badge */}
        {destination.rating && (
          <div className="absolute top-6 right-6 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-md opacity-60"></div>
              <div className="relative flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-xl border-2 border-amber-500">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-lg font-bold text-gray-800">
                  {destination.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section with Enhanced Design */}
      <div className="p-6 relative">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

        <h3 className="font-bold text-xl text-gray-800 mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-700 group-hover:to-slate-900 transition-all duration-300 leading-tight">
          {destination.nama}
        </h3>

        {/* Category badges with modern styling */}
        <div className="flex flex-wrap gap-2 mb-5">
          {destination.kategori.slice(0, 3).map((kat, idx) => (
            <span
              key={idx}
              className="text-xs bg-slate-100 text-slate-700 px-4 py-2 font-semibold border border-slate-300 hover:bg-black hover:text-white hover:border-black transition-all duration-300 uppercase tracking-wide cursor-pointer"
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

        {/* Enhanced CTA Button */}
        <Link
  href={`/destination/${encodeURIComponent(destination.place_id ?? '')}`}
  className="group/btn relative flex items-center justify-center gap-3 w-full text-center overflow-hidden"
>
          <span className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900"></span>
          <span className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-black translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>

          <span className="relative flex items-center gap-3 text-white font-bold py-4 px-6 uppercase tracking-wider text-sm">
            LIHAT DETAIL
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
          </span>
        </Link>
      </div>
    </div>
  );
}