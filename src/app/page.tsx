'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const itemsPerPage = 3;
  
  const featuredRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = [featuredRef.current, featuresRef.current, ctaRef.current];
    sections.forEach((section) => section && observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const totalSlides = Math.ceil(featuredDestinations.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://pemerintahan.surabaya.go.id/web/assets/frontend/img/suro_boyo.jpg"
          alt="Surabaya Tourism"
          fill
          className="object-cover brightness-50 scale-105 animate-slow-zoom"
          priority
        />

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-purple-900/40 to-orange-900/60 animate-gradient-shift" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float-slow top-20 -left-48" />
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slower top-40 right-20" />
          <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float bottom-20 left-1/3" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-4xl">
              <div className="animate-fade-in-up">
                <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full">
                  <span className="text-orange-300 font-semibold text-sm tracking-wider">✨ JELAJAHI SURABAYA</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl tracking-tighter leading-none">
                  <span className="text-white block animate-slide-in-left">REKOMENDASI</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 block animate-slide-in-right">
                    WISATA SURABAYA
                  </span>
                </h1>
                <p className="text-2xl md:text-3xl text-gray-200 mb-12 font-light tracking-wide leading-relaxed animate-fade-in-delay">
                  Temukan destinasi wisata halal terbaik dan
                  <span className="text-orange-400 font-semibold"> nikmati kuliner halal Surabaya</span>
                </p>
                <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
                  <Link
                    href="/routes"
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-lg py-6 px-12 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/50 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <RouteIcon className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">REKOMENDASIKAN RUTE</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                  </Link>
                  <Link
                    href="/lihat-semua"
                    className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-lg py-6 px-12 rounded-full border-2 border-white/30 shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Map className="w-6 h-6" />
                    <span>LIHAT DESTINASI</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2 animate-scroll-down" />
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div 
        ref={featuredRef}
        id="featured-section"
        className={`relative py-24 overflow-hidden transition-all duration-1000 ${
          visibleSections.has('featured-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/30 to-white" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="bg-white shadow-2xl border border-orange-100 overflow-hidden rounded-2xl backdrop-blur-sm">
            <div className="h-2 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 animate-gradient-x"></div>

            <div className="p-10 md:p-16">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div className="flex items-start gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Star className="w-8 h-8 text-white fill-white animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Destinasi</span>
                      <span className="text-gray-900"> Populer</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Jelajahi destinasi wisata terbaik di Surabaya
                    </p>
                  </div>
                </div>
                <Link
                  href="/lihat-semua"
                  className="group/link inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform duration-300" />
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
                        className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 hover:-translate-x-1 group"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 hover:translate-x-1 group"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
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
      <div 
        ref={featuresRef}
        id="features-section"
        className={`relative py-24 overflow-hidden transition-all duration-1000 delay-300 ${
          visibleSections.has('features-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/20 to-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-200/20 to-purple-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 via-amber-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-purple-600">Layanan Kami</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kemudahan untuk merencanakan wisata halal di Surabaya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white border-2 border-orange-100 hover:border-orange-300 rounded-3xl p-10 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-block relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <RouteIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                  Rekomendasi Rute
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Dapatkan rekomendasi rute perjalanan terbaik untuk mengunjungi
                  <span className="font-semibold text-orange-600"> destinasi wisata halal di Surabaya</span>
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white border-2 border-purple-100 hover:border-purple-300 rounded-3xl p-10 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-block relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Map className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                  Peta Interaktif
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Lihat peta lokasi wisata dan
                  <span className="font-semibold text-purple-600"> petunjuk arah</span> untuk memudahkan perjalanan Anda
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white border-2 border-amber-100 hover:border-amber-300 rounded-3xl p-10 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-block relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Star className="w-10 h-10 text-white fill-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition-colors">
                  Wisata Halal
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Destinasi wisata pilihan dan
                  <span className="font-semibold text-amber-600"> restoran bersertifikat halal</span> untuk kenyamanan ibadah Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div 
        ref={ctaRef}
        id="cta-section"
        className={`relative bg-gradient-to-br from-gray-900 via-purple-900 to-orange-900 py-32 overflow-hidden transition-all duration-1000 delay-500 ${
          visibleSections.has('cta-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="inline-block relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 via-amber-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
              <MapPin className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-purple-400 animate-gradient-shift">
              Siap Menjelajahi Surabaya?
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-14 font-light max-w-4xl mx-auto leading-relaxed">
            Dapatkan rekomendasi rute wisata terbaik untuk menjelajahi
            <span className="font-semibold text-orange-300"> keindahan Kota Pahlawan</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/routes"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white font-bold text-lg py-6 px-12 rounded-2xl shadow-2xl shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <RouteIcon className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">BUAT RUTE SEKARANG</span>
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
            </Link>
            
            <Link
              href="/lihat-semua"
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold text-lg py-6 px-12 rounded-2xl border-2 border-white/30 hover:border-white/50 shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              LIHAT DESTINASI
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 text-transparent bg-clip-text">
                Wisata Halal Surabaya
              </span>
            </div>
            
            <p className="text-gray-400 text-center max-w-md">
              Menjelajahi keindahan Kota Pahlawan dengan kemudahan dan kenyamanan untuk wisata halal
            </p>
            
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            
            <p className="text-gray-500 text-sm">
              &copy; 2025 Kelompok 4 Capstone C. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
