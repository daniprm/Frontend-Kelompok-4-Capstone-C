'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DestinationCard from '@/components/DestinationCard';
import { Destination } from '@/types';
import {
  MapPin,
  Route as RouteIcon,
  Star,
  ArrowRight,
  Map,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface HomeContentProps {
  destinations: Destination[];
}

export default function HomeContent({ destinations }: HomeContentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 3;

  const totalSlides = Math.ceil(destinations.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle w-32 h-32 top-10 left-10 opacity-30 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-24 h-24 top-40 right-20 opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="particle w-40 h-40 bottom-20 left-1/4 opacity-25 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="particle w-28 h-28 top-1/3 right-1/3 opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="particle w-36 h-36 bottom-40 right-10 opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <Image
          src="https://pemerintahan.surabaya.go.id/web/assets/frontend/img/suro_boyo.jpg"
          alt="Surabaya Tourism"
          fill
          className="object-cover brightness-[0.35] scale-105"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80"></div>
        
        {/* Animated Gradient Lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-shimmer" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-4xl">
              <div className="animate-fade-in-up">
                <h1 className="text-7xl md:text-8xl font-extrabold mb-8 drop-shadow-2xl tracking-tight leading-none">
                  <span className="text-white block mb-2 animate-slide-in-left">REKOMENDASI</span>
                  <span className="text-blue-100 block text-8xl md:text-9xl animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                    WISATA SURABAYA
                  </span>
                </h1>
                <div className="relative inline-block mb-10">
                  <p className="text-2xl md:text-3xl text-blue-50 font-light tracking-wide leading-relaxed animate-slide-in" style={{ animationDelay: '0.4s' }}>
                    Temukan destinasi wisata terbaik di Surabaya dengan <br />
                    <span className="text-white font-semibold">rekomendasi rute yang optimal</span>
                  </p>
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-white to-transparent"></div>
                </div>
                <Link
                  href="/routes"
                  className="group inline-flex items-center gap-4 bg-white hover:bg-blue-50 text-blue-600 font-bold text-xl py-6 px-12 rounded-lg shadow-xl transition-all duration-300 animate-bounce-in transform hover:scale-105"
                  style={{ animationDelay: '0.6s' }}
                >
                  <Sparkles className="w-6 h-6" />
                  REKOMENDASIKAN RUTE
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="relative bg-gradient-to-br from-blue-50 to-white py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="glass-dark shadow-2xl rounded-3xl overflow-hidden border border-blue-200 backdrop-blur-xl">
            <div className="h-2 bg-blue-600"></div>

            <div className="p-10 md:p-14">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-6 animate-slide-in-left">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl hover:rotate-6 transition-transform duration-300">
                      <Star className="w-10 h-10 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                      Cek Destinasi Berikut
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Jelajahi destinasi wisata pilihan di Surabaya
                    </p>
                  </div>
                </div>
                <Link
                  href="/lihat-semua"
                  className="group/link flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-in-right"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-6 h-6 group-hover/link:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>

              {/* Featured Destinations Grid */}
              <div className="relative px-14">
                {/* Navigation Buttons */}
                {destinations.length > itemsPerPage && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 hover:-translate-x-1"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 hover:translate-x-1"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </>
                )}

                {/* Slideshow Content */}
                <div className="overflow-hidden">
                  <div
                    className="transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    <div className="flex">
                      {destinations.length > 0 ? (
                        // Chunk destinations into groups of 3
                        Array.from({ length: totalSlides }).map(
                          (_, slideIndex) => (
                            <div
                              key={slideIndex}
                              className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                              {destinations
                                .slice(
                                  slideIndex * itemsPerPage,
                                  (slideIndex + 1) * itemsPerPage
                                )
                                .map((dest, idx) => (
                                  <DestinationCard
                                    key={dest.place_id || idx}
                                    destination={dest}
                                  />
                                ))}
                            </div>
                          )
                        )
                      ) : (
                        <div className="w-full text-center py-12">
                          <p className="text-gray-500 text-lg">
                            Belum ada destinasi yang tersedia
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white py-24 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,white,transparent)]"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
              Fitur-Fitur yang Tersedia
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Teknologi canggih untuk pengalaman wisata yang luar biasa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group glass-dark border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-10 text-center transform transition-all duration-300 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative inline-block mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-300">
                  <RouteIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Optimasi Rute
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Rekomendasi rute optimal dengan menggunakan <span className="text-blue-600 font-semibold">Hybrid Genetic Algorithm</span>
              </p>
              <div className="mt-6 w-16 h-1 bg-gradient-to-r from-blue-400 to-transparent mx-auto"></div>
            </div>

            {/* Feature 2 */}
            <div className="group card-lift glass-dark border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-10 text-center transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative inline-block mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Map className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Peta Interaktif
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Visualisasi rute dengan <span className="text-blue-600 font-semibold">OpenStreetMap dan OSRM routing</span>
              </p>
              <div className="mt-6 w-16 h-1 bg-gradient-to-r from-blue-400 to-transparent mx-auto"></div>
            </div>

            {/* Feature 3 */}
            <div className="group card-lift glass-dark border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-10 text-center transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative inline-block mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Star className="w-10 h-10 text-white fill-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Rekomendasi Restoran Halal
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Destinasi wisata pilihan dan restoran yang telah <span className="text-blue-600 font-semibold">tersertifikasi halal</span>
              </p>
              <div className="mt-6 w-16 h-1 bg-gradient-to-r from-blue-400 to-transparent mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-scale"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-scale" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-scale" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="relative inline-block mb-10">
              <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <MapPin className="w-14 h-14 text-white" />
              </div>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
              <span className="text-white block mb-3">Siap Menjelajahi</span>
              <span className="text-blue-100 text-7xl md:text-8xl">Surabaya?</span>
            </h2>
            
            <p className="text-2xl md:text-3xl text-blue-50 mb-14 font-light max-w-4xl mx-auto leading-relaxed">
              Dapatkan rekomendasi rute wisata yang <span className="text-white font-semibold">optimal dan terbaik</span> di Surabaya
            </p>
            
            <Link
              href="/routes"
              className="group inline-flex items-center gap-4 bg-white hover:bg-blue-50 text-blue-600 font-bold text-xl md:text-2xl py-7 px-14 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105 animate-bounce-in"
            >
              <RouteIcon className="w-7 h-7" />
              BUAT RUTE SEKARANG
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>

            {/* Decorative Elements */}
            <div className="mt-16 flex items-center justify-center gap-8 text-cyan-300/60">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-cyan-400"></div>
              <Sparkles className="w-6 h-6 animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-cyan-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gray-100 text-gray-900 py-16 overflow-hidden border-t border-blue-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">Wisata Surabaya</span>
            </div>
            <p className="text-gray-600 text-lg">&copy; 2025 Kelompok 4 Capstone C. All rights reserved.</p>
            <div className="flex items-center gap-4 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm">Powered by Hybrid Genetic Algorithm</span>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
