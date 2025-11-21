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
    <div className="min-h-screen bg-white">
      {/* Header with Enhanced Design */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#F59E0B] flex items-center justify-center">
              <RouteIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                <span className="text-white">Rekomendasi </span>
                <span className="text-[#F59E0B]">Rute Wisata</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Temukan destinasi wisata terbaik di Surabaya dengan rekomendasi
                rute yang optimal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Input Section - 2 Column Layout */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 md:px-12">
          {/* Enhanced Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Input with Glass Morphism */}
            <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-1 bg-[#F59E0B]"></div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#F59E0B] flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Masukkan Lokasi Anda
                  </h2>
                </div>

                {/* Coordinate Inputs with Modern Styling */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
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
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] transition-all duration-200 bg-white font-mono text-gray-900"
                      placeholder="-7.2458"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
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
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] transition-all duration-200 bg-white font-mono text-gray-900"
                      placeholder="112.7378"
                    />
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleGetCurrentLocation}
                    className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Gunakan Lokasi Saat Ini
                  </button>
                  <button
                    onClick={handleGenerateRoutes}
                    disabled={isLoading || isCalculatingDistance}
                    className="w-full px-6 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    {isLoading || isCalculatingDistance ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin"></div>
                        <span>
                          {isCalculatingDistance
                            ? 'Menghitung Jarak Rute...'
                            : 'Memproses...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <RouteIcon className="w-6 h-6" />
                        <span>Generate Rute</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Enhanced Info Box */}
                <div className="p-4 bg-gray-50 border-l-4 border-[#F59E0B]">
                  <p className="font-bold mb-2 text-gray-800">💡 Tips:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Klik peta di sebelah kanan untuk memilih lokasi</li>
                    <li>• Drag marker merah ke posisi yang diinginkan</li>
                  </ul>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 shadow-md">
                    <p className="text-sm font-semibold">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Enhanced Map Picker */}
            <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-1 bg-[#F59E0B]"></div>
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#F59E0B] flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pilih Lokasi di Peta
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden shadow-lg border border-gray-200">
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
            <div className="mb-8">
              {/* Section Header with Animation */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[#F59E0B] flex items-center justify-center">
                  <RouteIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Hasil Rekomendasi Rute
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {routeData.data.routes.length} Rekomendasi Tersedia
                  </p>
                </div>
              </div>

              {/* Route Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {routeData.data.routes.map((route: BackendRoute) => (
                  <button
                    key={route.rank}
                    onClick={() => setSelectedRoute(route)}
                    className={`text-left transition-all duration-200 border-2 ${
                      selectedRoute?.rank === route.rank
                        ? 'border-[#F59E0B] shadow-lg bg-[#F59E0B]/5'
                        : 'border-gray-200 shadow-md hover:shadow-lg bg-white hover:border-[#F59E0B]/50'
                    }`}
                  >
                    <div className="p-6">
                      {/* Header with Rank Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`px-4 py-2 font-bold ${
                            selectedRoute?.rank === route.rank
                              ? 'bg-[#F59E0B] text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          Rute #{route.rank}
                        </div>
                        {selectedRoute?.rank === route.rank && (
                          <div className="flex items-center gap-2 text-[#F59E0B] font-semibold">
                            <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                            Dipilih
                          </div>
                        )}
                      </div>

                      {/* Stats with Modern Design */}
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 border-l-4 border-gray-700">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-700 text-sm">
                              Destinasi
                            </span>
                            <span className="font-bold text-gray-800 text-xl">
                              {route.destinations.length}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 border-l-4 border-[#F59E0B]">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-700 text-sm">
                              Total Jarak
                            </span>
                            <div className="flex items-baseline justify-between">
                              <span className="font-bold text-[#F59E0B] text-xl">
                                {route.total_distance_km.toFixed(2)} km
                              </span>
                            </div>
                            {route.estimated_duration_minutes && (
                              <span className="text-xs text-gray-500">
                                ≈ {Math.round(route.estimated_duration_minutes)}{' '}
                                menit
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Route Details, Map, and Destinations */}
        {selectedRoute && (
          <div className="container mx-auto px-6 md:px-12">
            {/* Detail Rute Stats - Vertical Layout */}
            <div className="bg-white shadow-lg border border-gray-200 overflow-hidden mb-8">
              <div className="h-1 bg-[#F59E0B]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-[#F59E0B] flex items-center justify-center">
                    <RouteIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Detail Rute #{selectedRoute.rank}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Statistik Perjalanan Anda
                    </p>
                  </div>
                </div>

                {/* Enhanced Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gray-50 border-l-4 border-gray-700">
                    <div className="text-sm font-semibold text-gray-600 mb-2">
                      Destinasi
                    </div>
                    <div className="text-4xl font-bold text-gray-800">
                      {selectedRoute.destinations.length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Tempat Wisata
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 border-l-4 border-[#F59E0B]">
                    <div className="text-sm font-semibold text-gray-600 mb-2">
                      Jarak Rute
                    </div>
                    <div className="text-4xl font-bold text-[#F59E0B]">
                      {selectedRoute.total_distance_km.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Kilometer</div>
                    {selectedRoute.estimated_duration_minutes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">
                          Estimasi Waktu
                        </div>
                        <div className="text-xl font-bold text-[#D97706]">
                          {Math.round(selectedRoute.estimated_duration_minutes)}{' '}
                          min
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-gray-50 border-l-4 border-gray-600">
                    <div className="text-sm font-semibold text-gray-600 mb-2">
                      Peringkat
                    </div>
                    <div className="text-4xl font-bold text-gray-700">
                      #{selectedRoute.rank}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Rekomendasi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Peta Rute - Full Width Below */}
            <div className="bg-white shadow-lg border border-gray-200 overflow-hidden mb-8">
              <div className="h-1 bg-[#F59E0B]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-[#F59E0B] flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Peta Rute Perjalanan
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Visualisasi Rute Optimal Anda
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden shadow-lg border border-gray-200">
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
                  />
                </div>
              </div>
            </div>

            {/* Daftar Destinasi - Enhanced Destination List */}
            <div className="bg-white shadow-lg border border-gray-200 overflow-hidden mb-8">
              <div className="h-1 bg-[#F59E0B]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-[#F59E0B] flex items-center justify-center">
                    <Star className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Daftar Destinasi
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedRoute.destinations.length} Tempat Wisata
                      Menakjubkan
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedRoute.destinations.map((destination, idx) => (
                    <DestinationCard
                      key={`${destination.place_id}-${idx}`}
                      destination={transformDestination(destination)}
                    />
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
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center mx-auto mb-6">
                  <RouteIcon className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-xl font-semibold text-gray-700">
                  Pilih salah satu rute di atas untuk melihat detail
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
