'use client';

import { useState, useMemo } from 'react';
import { Destination } from '@/types';
import DestinationCard from '@/components/DestinationCard';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

interface DestinationGridProps {
  destinations: Destination[];
  itemsPerPage?: number;
}

export default function DestinationGrid({
  destinations,
  itemsPerPage = 12,
}: DestinationGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter destinations based on search query
  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return destinations;

    const query = searchQuery.toLowerCase().trim();
    return destinations.filter((dest) =>
      dest.nama.toLowerCase().includes(query)
    );
  }, [destinations, searchQuery]);

  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDestinations = filteredDestinations.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Search bar component to be used inline or in banner
  const SearchBar = ({ inBanner = false }: { inBanner?: boolean }) => (
    <div className={inBanner ? 'w-full md:w-80' : 'mb-8'}>
      <div className={`relative ${inBanner ? '' : 'max-w-md mx-auto'}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Cari destinasi..."
          className="w-full pl-12 pr-12 py-3 border-2 border-blue-600/40 rounded-lg focus:border-blue-600 focus:outline-none transition-colors duration-200 text-gray-700 placeholder-gray-400 bg-white"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {searchQuery && !inBanner && (
        <p className="text-center text-gray-600 mt-3 text-sm">
          Ditemukan{' '}
          <span className="font-semibold text-blue-600">
            {filteredDestinations.length}
          </span>{' '}
          destinasi untuk &quot;{searchQuery}&quot;
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* Info Banner with Search */}
      <div className="glass-dark border-2 border-blue-600/30 p-8 mb-12 backdrop-blur-xl animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 flex items-center justify-center shadow-xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-1">
                Destinasi Pilihan
              </h3>
              <p className="text-blue-600">
                {searchQuery
                  ? `Ditemukan ${filteredDestinations.length} destinasi untuk "${searchQuery}"`
                  : 'Koleksi lengkap tempat wisata terbaik'}
              </p>
            </div>
          </div>
          <SearchBar inBanner />
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentDestinations.map((destination, index) => (
          <div
            key={destination.place_id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <DestinationCard destination={destination} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          {/* Page Info */}
          <p className="text-gray-600 text-sm">
            Menampilkan {startIndex + 1} -{' '}
            {Math.min(endIndex, filteredDestinations.length)} dari{' '}
            {filteredDestinations.length} destinasi
          </p>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && goToPage(page)}
                  disabled={typeof page === 'string'}
                  className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg font-semibold transition-all duration-200 ${
                    typeof page === 'string'
                      ? 'text-gray-400 cursor-default'
                      : page === currentPage
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                currentPage === totalPages
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDestinations.length === 0 && (
        <div className="text-center py-32 animate-fade-in-up">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-2xl neon-glow animate-pulse-scale">
            <Search className="w-16 h-16 text-white" />
          </div>
          {searchQuery ? (
            <>
              <p className="text-3xl font-bold text-gray-800 mb-4">
                Tidak ada destinasi ditemukan
              </p>
              <p className="text-xl text-gray-600 mb-6">
                Tidak ada hasil untuk &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Hapus Pencarian
              </button>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-800 mb-4">
                Belum ada destinasi yang tersedia
              </p>
              <p className="text-xl text-gray-600">
                Destinasi akan segera ditambahkan ✨
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
