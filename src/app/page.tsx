'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DestinationCard from '@/components/DestinationCard';
import { Destination } from '@/types';
import { getDestinations } from '@/services/destinationService';
import {
  MapPin,
  Route as RouteIcon,
  Star,
  ArrowRight,
  Map,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Load destinations and get first 3
    async function loadFeaturedDestinations() {
      try {
        const allDestinations = await getDestinations();
        // Get first 3 destinations
        const featured = allDestinations.slice(0, 3);
        setFeaturedDestinations(featured);
      } catch (error) {
        console.error('Error loading destinations:', error);
        setFeaturedDestinations([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedDestinations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Hero Section - keep existing */}
      <div className="relative h-[600px] w-full overflow-hidden">
        {/* ...existing hero content... */}
        <Image
          src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2070"
          alt="Surabaya Tourism"
          fill
          className="object-cover brightness-50"
          priority
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        ></div>

        {/* Overlay with title */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-emerald-300">
                  REKOMENDASI
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-white to-white">
                  WISATA SURABAYA
                </span>
              </h1>
              <p className="text-2xl text-white/90 mb-10 font-light tracking-wide">
                Temukan destinasi wisata terbaik di Surabaya dengan rekomendasi
                rute yang optimal
              </p>
              <Link
                href="/routes"
                className="group/btn relative inline-flex items-center gap-3 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-900 hover:to-black text-white font-bold text-lg py-5 px-10 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/20 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-all duration-300"></span>
                <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>
                <span className="relative">REKOMENDASIKAN RUTE</span>
                <ArrowRight className="w-6 h-6 relative transition-transform group-hover/btn:translate-x-2 duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="container mx-auto px-6 md:px-12 py-20">
        <div className="relative group mb-12">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white shadow-2xl border border-gray-100 overflow-hidden">
            {/* Accent Bar */}
            <div className="h-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800"></div>

            <div className="p-10">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-700 blur-lg opacity-50"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <Star className="w-7 h-7 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
                      Destinasi Populer
                    </h2>
                    <p className="text-gray-600 font-medium mt-1">
                      Jelajahi 3 destinasi terpopuler di Surabaya
                    </p>
                  </div>
                </div>
                <Link
                  href="/lihat-semua"
                  className="group/link flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold transition-colors duration-300"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover/link:translate-x-1 duration-300" />
                </Link>
              </div>

              {/* Featured Destinations Grid */}
              {isClient && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    // Loading skeleton for 3 cards
                    [...Array(3)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className="bg-gray-200 animate-pulse h-96 rounded-lg"
                      />
                    ))
                  ) : featuredDestinations.length > 0 ? (
                    featuredDestinations.map((dest, idx) => (
                      <DestinationCard 
                        key={dest.place_id || idx} 
                        destination={dest} 
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-lg">
                        Belum ada destinasi yang tersedia
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
{/* Features Section */}
      <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="inline-block relative mb-6">
              <div className="absolute inset-0 bg-emerald-600 blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900 mb-4">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-gray-600 text-lg font-medium">
              Teknologi terkini untuk pengalaman wisata terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
              <div className="relative bg-white shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:scale-[1.02]">
                <div className="h-1.5 bg-gradient-to-r from-slate-700 to-slate-900"></div>
                <div className="p-8 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-slate-700 blur-md opacity-50"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mx-auto">
                      <RouteIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Rute Optimal
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Dapatkan rekomendasi rute terbaik menggunakan AI untuk
                    mengoptimalkan perjalanan Anda
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
              <div className="relative bg-white shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:scale-[1.02]">
                <div className="h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
                <div className="p-8 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-emerald-600 blur-md opacity-50"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto">
                      <Map className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">
                    Peta Interaktif
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Visualisasi rute secara real-time dengan OpenStreetMap dan
                    OSRM routing
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
              <div className="relative bg-white shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:scale-[1.02]">
                <div className="h-1.5 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                <div className="p-8 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-amber-500 blur-md opacity-50"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto">
                      <Star className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-600 mb-4">
                    Rekomendasi Terpercaya
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Destinasi wisata pilihan dengan rating dan review dari
                    pengunjung lain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        ></div>

        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mx-auto">
              <MapPin className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-300 to-white">
              Siap Menjelajahi Surabaya?
            </span>
          </h2>
          <p className="text-2xl text-white/80 mb-10 font-light max-w-3xl mx-auto">
            Dapatkan rekomendasi rute wisata yang dipersonalisasi berdasarkan
            lokasi Anda dengan teknologi AI terkini
          </p>
          <Link
            href="/routes"
            className="group/btn relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-800 text-white font-bold text-xl py-6 px-12 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/30 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-all duration-300"></span>
            <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>
            <RouteIcon className="w-7 h-7 relative transition-transform group-hover/btn:rotate-12 duration-300" />
            <span className="relative">BUAT RUTE SEKARANG</span>
            <ArrowRight className="w-7 h-7 relative transition-transform group-hover/btn:translate-x-2 duration-300" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-black text-white py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Wisata Surabaya</span>
            </div>
            <p className="text-gray-400 font-medium">
              &copy; 2025 Rekomendasi Wisata Surabaya. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}