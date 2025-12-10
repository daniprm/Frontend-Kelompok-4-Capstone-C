'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Route as RouteIcon, Star } from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import { generateRoutes, getOSRMRoute } from '@/lib/api';

// Dynamic import for LocationPickerMap to avoid SSR issues
const LocationPickerMap = dynamic(
  () => import('@/components/LocationPickerMap'),
  { ssr: false }
);

// Dynamic import for MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
});

// Interface untuk destinasi dari backend API
interface BackendDestination {
  order: number;
  place_id: number;
  nama_destinasi: string;
  kategori: string[];
  latitude: number;
  longitude: number;
  alamat: string;
  image_url: string;
  deskripsi: string | null;
}

// Interface untuk route dari backend
interface BackendRoute {
  rank: number;
  total_distance_km: number;
  is_valid_order: boolean;
  destinations: BackendDestination[];
  estimated_duration_minutes?: number;
}

// Interface untuk response API
interface BackendApiResponse {
  success: boolean;
  message: string;
  data: {
    routes: BackendRoute[];
  };
}

// Fungsi untuk transformasi data backend ke format frontend
function transformDestination(backendDest: BackendDestination) {
  return {
    place_id: backendDest.place_id.toString(),
    nama: backendDest.nama_destinasi,
    kategori: backendDest.kategori,
    coordinates: [backendDest.latitude, backendDest.longitude] as [
      number,
      number
    ],
    alamat: backendDest.alamat,
    image_url: backendDest.image_url,
    deskripsi: backendDest.deskripsi || undefined,
    order: backendDest.order,
  };
}

export default function RoutesPage() {
  const [userLocation, setUserLocation] = useState({
    latitude: -7.2458,
    longitude: 112.7378,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState<BackendApiResponse | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<BackendRoute | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  // Function to calculate real distance using OSRM
  const calculateRealDistances = async (
    routes: BackendRoute[],
    userLoc: { latitude: number; longitude: number }
  ) => {
    setIsCalculatingDistance(true);
    console.log('=== Calculating Real Distances with OSRM ===');

    const updatedRoutes = await Promise.all(
      routes.map(async (route) => {
        try {
          // Create array of coordinates: user location + all destinations
          const allPoints: [number, number][] = [
            [userLoc.latitude, userLoc.longitude],
            ...route.destinations.map(
              (d) => [d.latitude, d.longitude] as [number, number]
            ),
          ];

          console.log(
            `Calculating route ${route.rank} with ${allPoints.length} points`
          );

          // Get OSRM route data with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const osrmData = await getOSRMRoute(allPoints, 'car').finally(() => {
            clearTimeout(timeoutId);
          });

          if (osrmData.routes && osrmData.routes[0]) {
            const realDistance = osrmData.routes[0].distance / 1000; // convert to km
            const realDuration = osrmData.routes[0].duration / 60; // convert to minutes

            console.log(`Route ${route.rank}:`, {
              oldDistance: route.total_distance_km,
              newDistance: realDistance,
              duration: realDuration,
            });

            return {
              ...route,
              total_distance_km: realDistance,
              estimated_duration_minutes: realDuration,
            };
          }

          console.warn(
            `No route data for route ${route.rank}, using original distance`
          );
          return route; // Return original if OSRM fails
        } catch (error) {
          console.error(
            `Error calculating distance for route ${route.rank}:`,
            error
          );
          // Return original route with a note that distance is estimated
          return {
            ...route,
            estimated_duration_minutes: undefined,
          };
        }
      })
    );

    setIsCalculatingDistance(false);
    console.log('=== Distance Calculation Complete ===');
    return updatedRoutes;
  };

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setUserLocation({ latitude: lat, longitude: lng });
  }, []);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(
            'Tidak dapat mengakses lokasi. Menggunakan lokasi default (Surabaya).'
          );
        }
      );
    } else {
      alert('Geolocation tidak didukung oleh browser Anda.');
    }
  };

  const handleGenerateRoutes = async () => {
    console.log('=== Generate Routes Clicked ===');
    console.log('User Location:', userLocation);

    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling API...');
      const response = await generateRoutes(userLocation);
      console.log('API Response:', response);

      // Cast response to BackendApiResponse since backend structure is different
      const backendResponse = response as unknown as BackendApiResponse;

      if (
        backendResponse.success &&
        backendResponse.data &&
        backendResponse.data.routes
      ) {
        // Try to calculate real distances using OSRM
        let finalRoutes = backendResponse.data.routes;

        try {
          console.log('Recalculating distances with OSRM...');
          const routesWithRealDistances = await calculateRealDistances(
            backendResponse.data.routes,
            userLocation
          );
          finalRoutes = routesWithRealDistances;
          console.log('✓ Distance recalculation successful');
        } catch (osrmError) {
          console.warn(
            '⚠ OSRM calculation failed, using backend distances:',
            osrmError
          );
          // Continue with original backend distances if OSRM fails
        }

        // Sort routes by distance (shortest to longest)
        const sortedRoutes = [...finalRoutes].sort((a, b) => {
          return a.total_distance_km - b.total_distance_km;
        });

        // Update rank after sorting
        const routesWithUpdatedRank = sortedRoutes.map((route, index) => ({
          ...route,
          rank: index + 1,
        }));

        console.log(
          'Routes sorted by distance:',
          routesWithUpdatedRank.map((r) => ({
            rank: r.rank,
            distance: r.total_distance_km.toFixed(2),
          }))
        );

        // Update response with sorted routes
        const updatedResponse: BackendApiResponse = {
          ...backendResponse,
          data: {
            routes: routesWithUpdatedRank,
          },
        };

        setRouteData(updatedResponse);

        // Set the first route (shortest distance) as selected
        if (routesWithUpdatedRank.length > 0) {
          setSelectedRoute(routesWithUpdatedRank[0]);
        }
      } else {
        setError('Response API tidak sesuai format yang diharapkan');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(
        'Gagal mengambil rekomendasi rute. Pastikan API berjalan di http://localhost:8000'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsCalculatingDistance(false);
      console.log('=== Generate Routes Finished ===');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="particle w-32 h-32 top-10 left-10 opacity-30 animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="particle w-24 h-24 top-40 right-20 opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="particle w-40 h-40 bottom-20 left-1/4 opacity-25 animate-float"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Header with Enhanced Design */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white py-24 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-baseline gap-8 animate-fade-in-up">
            <div className="relative">
              <div className="w-24 h-24 bg-white flex items-center justify-center shadow-2xl">
                <RouteIcon className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-tight leading-tight">
                <span className="text-white">Rekomendasi Rute Wisata</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed">
                Temukan destinasi wisata terbaik di Surabaya dengan rekomendasi
                rute yang{' '}
                <span className="text-white font-semibold">optimal</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Input Section - 2 Column Layout */}
      <div className="relative bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Enhanced Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Input with Glass Morphism */}
            <div className="bg-white border-2 border-blue-200 overflow-hidden shadow-2xl backdrop-blur-xl animate-fade-in-up">
              <div className="h-2 bg-blue-600"></div>

              <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-blue-600 flex items-center justify-center shadow-xl">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-blue-600">
                    Masukkan Lokasi Anda
                  </h2>
                </div>

                {/* Coordinate Inputs with Modern Styling */}
                <div className="space-y-5 mb-8">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-3 block uppercase tracking-wider">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={userLocation.latitude}
                      onChange={(e) =>
                        setUserLocation({
                          ...userLocation,
                          latitude: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-mono text-gray-900 placeholder:text-gray-400 shadow-lg"
                      placeholder="-7.2458"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-3 block uppercase tracking-wider">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={userLocation.longitude}
                      onChange={(e) =>
                        setUserLocation({
                          ...userLocation,
                          longitude: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-mono text-gray-900 placeholder:text-gray-400 shadow-lg"
                      placeholder="112.7378"
                    />
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-4 mb-8">
                  <button
                    onClick={handleGetCurrentLocation}
                    className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-300 shadow-xl flex items-center justify-center gap-3 transform hover:scale-105"
                  >
                    <MapPin className="w-6 h-6" />
                    Gunakan Lokasi Saat Ini
                  </button>
                  <button
                    onClick={handleGenerateRoutes}
                    disabled={isLoading || isCalculatingDistance}
                    className="w-full px-6 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl flex items-center justify-center gap-4 transform hover:scale-105 disabled:transform-none"
                  >
                    {isLoading || isCalculatingDistance ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white animate-spin"></div>
                        <span>
                          {isCalculatingDistance
                            ? 'Menghitung Jarak Rute...'
                            : 'Memproses...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <RouteIcon className="w-7 h-7" />
                        <span>Generate Rute</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Enhanced Info Box */}
                <div className="p-6 bg-blue-50 border-2 border-blue-200">
                  <p className="font-bold mb-3 text-gray-900 text-lg flex items-center gap-2">
                    <span className="text-2xl">💡</span> Tips:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        Klik peta di sebelah kanan untuk memilih lokasi
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Drag marker merah ke posisi yang diinginkan</span>
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="mt-6 p-5 bg-red-50 border-2 border-red-300">
                    <p className="text-sm font-bold text-red-700 flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Enhanced Map Picker */}
            <div
              className="bg-white border-2 border-blue-200 overflow-hidden shadow-2xl backdrop-blur-xl animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="h-2 bg-blue-600"></div>
              <div className="p-10 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-blue-600 flex items-center justify-center shadow-xl">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-blue-600">
                    Pilih Lokasi di Peta
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden shadow-2xl border-2 border-blue-600/50">
                  <LocationPickerMap
                    initialLocation={[
                      userLocation.latitude,
                      userLocation.longitude,
                    ]}
                    onLocationSelect={handleLocationSelect}
                    height="500px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Location Input Section */}

        {/* Route Selection with Enhanced Design */}
        {routeData && routeData.data && routeData.data.routes && (
          <div className="container mx-auto px-6 md:px-12">
            <div className="mb-12">
              {/* Section Header with Animation */}
              <div className="flex items-center gap-6 mb-10 animate-fade-in-up">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-600 flex items-center justify-center shadow-2xl">
                    <RouteIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                    Hasil Rekomendasi Rute
                  </h2>
                  <p className="text-gray-600 text-xl">
                    <span className="text-blue-600 font-bold">
                      {routeData.data.routes.length}
                    </span>{' '}
                    Rekomendasi Tersedia ✨
                  </p>
                </div>
              </div>

              {/* Route Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {routeData.data.routes.map(
                  (route: BackendRoute, idx: number) => (
                    <button
                      key={route.rank}
                      onClick={() => setSelectedRoute(route)}
                      className={`text-left transition-all duration-300 border-2 transform hover:scale-105 animate-fade-in-up ${
                        selectedRoute?.rank === route.rank
                          ? 'border-blue-500 shadow-2xl bg-blue-50'
                          : 'border-blue-200 shadow-xl bg-white hover:border-blue-400 hover:shadow-2xl'
                      }`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="p-8">
                        {/* Header with Rank Badge */}
                        <div className="flex items-center justify-between mb-6">
                          <div
                            className={`px-5 py-3 font-bold shadow-lg ${
                              selectedRoute?.rank === route.rank
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            Rute #{route.rank}
                          </div>
                          {selectedRoute?.rank === route.rank && (
                            <div className="flex items-center gap-2 text-blue-600 font-bold">
                              <div className="w-3 h-3 bg-blue-600"></div>
                              <span className="ml-2">Dipilih</span>
                            </div>
                          )}
                        </div>

                        {/* Stats with Modern Design */}
                        <div className="space-y-4">
                          <div className="p-5 bg-gray-50 border-2 border-blue-200">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                                Destinasi
                              </span>
                              <span className="font-extrabold text-gray-900 text-3xl">
                                {route.destinations.length}
                              </span>
                            </div>
                          </div>
                          <div className="p-5 bg-gray-50 border-2 border-blue-200">
                            <div className="flex flex-col gap-2">
                              <span className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                                Total Jarak
                              </span>
                              <div className="flex items-baseline justify-between">
                                <span className="font-extrabold text-blue-600 text-3xl">
                                  {route.total_distance_km.toFixed(2)} km
                                </span>
                              </div>
                              {route.estimated_duration_minutes && (
                                <span className="text-sm text-blue-600 font-semibold">
                                  ≈{' '}
                                  {Math.round(route.estimated_duration_minutes)}{' '}
                                  menit
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Route Details, Map, and Destinations */}
        {selectedRoute && (
          <div className="container mx-auto px-6 md:px-12">
            {/* Detail Rute Stats - Vertical Layout */}
            <div className="bg-white border-2 border-blue-200 overflow-hidden shadow-2xl mb-12 animate-fade-in-up">
              <div className="h-2 bg-blue-600"></div>
              <div className="p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-600 flex items-center justify-center shadow-2xl">
                      <RouteIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {selectedRoute.rank}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                      Detail Rute #{selectedRoute.rank}
                    </h2>
                    <p className="text-gray-600 text-xl">
                      Statistik Perjalanan Anda
                    </p>
                  </div>
                </div>

                {/* Enhanced Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-blue-50 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
                    <div className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                      🎯 Destinasi
                    </div>
                    <div className="text-6xl font-extrabold text-gray-900 mb-2">
                      {selectedRoute.destinations.length}
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                      Tempat Wisata
                    </div>
                  </div>
                  <div className="p-8 bg-blue-50 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
                    <div className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                      📍 Jarak Rute
                    </div>
                    <div className="text-6xl font-extrabold text-blue-600 mb-2">
                      {selectedRoute.total_distance_km.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                      Kilometer
                    </div>
                    {selectedRoute.estimated_duration_minutes && (
                      <div className="mt-4 pt-4 border-t-2 border-blue-200">
                        <div className="text-xs text-gray-700 mb-2 font-bold uppercase tracking-wider">
                          Estimasi Waktu
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                          {Math.round(selectedRoute.estimated_duration_minutes)}{' '}
                          min
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8 bg-blue-50 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
                    <div className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                      🏆 Peringkat
                    </div>
                    <div className="text-6xl font-extrabold text-gray-900 mb-2">
                      #{selectedRoute.rank}
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                      Rekomendasi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Peta Rute - Full Width Below */}
            <div
              className="bg-white border-2 border-blue-200 overflow-hidden shadow-2xl mb-12 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="h-2 bg-blue-600"></div>
              <div className="p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-blue-600 flex items-center justify-center shadow-2xl">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                      Peta Rute Perjalanan
                    </h2>
                    <p className="text-gray-600 text-xl">
                      Visualisasi Rute Optimal Anda
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden shadow-2xl border-4 border-blue-600/50">
                  <MapComponent
                    userLocation={[
                      userLocation.latitude,
                      userLocation.longitude,
                    ]}
                    destinations={selectedRoute.destinations.map(
                      transformDestination
                    )}
                    preCalculatedDistance={selectedRoute.total_distance_km}
                    preCalculatedDuration={
                      selectedRoute.estimated_duration_minutes
                    }
                    height="600px"
                  />
                </div>
              </div>
            </div>

            {/* Daftar Destinasi - Enhanced Destination List */}
            <div
              className="bg-white border-2 border-blue-200 overflow-hidden shadow-2xl mb-12 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="h-2 bg-blue-600"></div>
              <div className="p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-blue-600 flex items-center justify-center shadow-2xl">
                    <Star className="w-10 h-10 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                      Daftar Destinasi
                    </h2>
                    <p className="text-gray-600 text-xl">
                      <span className="text-blue-600 font-bold">
                        {selectedRoute.destinations.length}
                      </span>{' '}
                      Hasil rekomendasi destinasi wisata
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {selectedRoute.destinations.map((destination, idx) => (
                    <div
                      key={`${destination.place_id}-${idx}`}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <DestinationCard
                        destination={transformDestination(destination)}
                        showOrder={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State with Enhanced Design */}
        {!selectedRoute &&
          routeData &&
          routeData.data &&
          routeData.data.routes && (
            <div className="container mx-auto px-6 md:px-12">
              <div className="text-center py-32 animate-fade-in-up">
                <div className="w-32 h-32 bg-blue-600 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <RouteIcon className="w-16 h-16 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  Pilih salah satu rute di atas
                </p>
                <p className="text-xl text-gray-600">
                  untuk melihat detail perjalanan Anda 🗺️
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
