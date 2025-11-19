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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [featuredDestinations, setFeaturedDestinations] = useState<
    Destination[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    setIsClient(true);

    // Load destinations and get first 3
    async function loadFeaturedDestinations() {
      try {
        const allDestinations = await getDestinations();
        // Get all destinations for slideshow
        setFeaturedDestinations(allDestinations);
      } catch (error) {
        console.error('Error loading destinations:', error);
        setFeaturedDestinations([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedDestinations();
  }, []);

  const totalSlides = Math.ceil(featuredDestinations.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - keep existing */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* ...existing hero content... */}
        <Image
          src="https://pemerintahan.surabaya.go.id/web/assets/frontend/img/suro_boyo.jpg"
          alt="Surabaya Tourism"
          fill
          className="object-cover brightness-50"
          priority
        />

        {/* Overlay with title */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl tracking-tight leading-tight">
                <span className="text-white">REKOMENDASI</span>
                <br />
                <span className="text-[#F59E0B]">WISATA SURABAYA</span>
              </h1>
              <p className="text-2xl text-white/90 mb-10 font-light tracking-wide">
                Temukan destinasi wisata terbaik di Surabaya dengan rekomendasi
                rute yang optimal
              </p>
              <Link
                href="/routes"
                className="group inline-flex items-center gap-3 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-lg py-5 px-10 shadow-xl transition-all duration-200"
              >
                REKOMENDASIKAN RUTE
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-1 bg-[#F59E0B]"></div>

            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F59E0B] flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Cek Destinasi Berikut
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Jelajahi destinasi wisata di Surabaya
                    </p>
                  </div>
                </div>
                <Link
                  href="/lihat-semua"
                  className="group/link flex items-center gap-2 text-[#F59E0B] hover:text-[#D97706] font-semibold transition-colors duration-200"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>

              {/* Featured Destinations Grid */}
              {isClient && (
                <div className="relative px-14">
                  {/* Navigation Buttons */}
                  {featuredDestinations.length > itemsPerPage && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#F59E0B]/40 hover:bg-[#F59E0B]/80 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-7 h-7" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#F59E0B]/40 hover:bg-[#F59E0B]/80 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-7 h-7" />
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
                        {loading ? (
                          // Loading skeleton
                          <div className="w-full flex gap-6">
                            {[...Array(3)].map((_, idx) => (
                              <div
                                key={idx}
                                className="flex-shrink-0 w-1/3 bg-gray-200 animate-pulse h-96"
                              />
                            ))}
                          </div>
                        ) : featuredDestinations.length > 0 ? (
                          // Chunk destinations into groups of 3
                          Array.from({ length: totalSlides }).map(
                            (_, slideIndex) => (
                              <div
                                key={slideIndex}
                                className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                              >
                                {featuredDestinations
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
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-[#F59E0B] flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fitur-Fitur yang Tersedia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-200 p-8 text-center">
              <div className="w-14 h-14 bg-[#F59E0B] flex items-center justify-center mx-auto mb-6">
                <RouteIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Optimasi Rute
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Rekomendasi rute optimal dengan menggunakan Hybrid Genetic
                Algorithm
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-200 p-8 text-center">
              <div className="w-14 h-14 bg-[#F59E0B] flex items-center justify-center mx-auto mb-6">
                <Map className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Peta Interaktif
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Visualisasi rute dengan OpenStreetMap dan OSRM routing
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-200 p-8 text-center">
              <div className="w-14 h-14 bg-[#F59E0B] flex items-center justify-center mx-auto mb-6">
                <Star className="w-7 h-7 text-white fill-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rekomendasi Restoran Halal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Destinasi wisata pilihan dan restoran yang telah tersertifikasi
                halal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 py-24">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="w-16 h-16 bg-[#F59E0B] flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-white mb-6">
            Siap Menjelajahi Surabaya?
          </h2>
          <p className="text-2xl text-white/80 mb-10 font-light max-w-3xl mx-auto">
            Dapatkan rekomendasi rute wisata yang ada di Surabaya
          </p>
          <Link
            href="/routes"
            className="group inline-flex items-center gap-3 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-lg py-5 px-10 shadow-xl transition-all duration-200"
          >
            <RouteIcon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
            BUAT RUTE SEKARANG
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-center">
            <p className="text-gray-400">&copy; 2025 Kelompok 4 Capstone C.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
