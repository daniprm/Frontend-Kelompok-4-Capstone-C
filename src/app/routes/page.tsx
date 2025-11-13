'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Route as RouteIcon, Star } from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import { generateRoutes, getOSRMRoute } from '@/lib/api';
import { ApiResponse, Route } from '@/types';

// Dynamic import for LocationPickerMap to avoid SSR issues
const LocationPickerMap = dynamic(
  () => import('@/components/LocationPickerMap'),
  { ssr: false }
);

// Dynamic import for MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
});


export default function RoutesPage() {
  const [userLocation, setUserLocation] = useState({
    latitude: -7.2458,
    longitude: 112.7378,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState<ApiResponse | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  // Function to calculate real distance using OSRM
  const calculateRealDistances = async (
    routes: Route[],
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
            ...route.destinations.map((d) => d.coordinates),
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

      if (response.success && response.data && response.data.routes) {
        // Try to calculate real distances using OSRM
        let finalRoutes = response.data.routes;

        try {
          console.log('Recalculating distances with OSRM...');
          const routesWithRealDistances = await calculateRealDistances(
            response.data.routes,
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
        const updatedResponse = {
          ...response,
          data: {
            ...response.data,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Header with Enhanced Design */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        ></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative w-16 h-16 bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <RouteIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-emerald-300">
                  Rekomendasi Rute Wisata
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide">
                Temukan destinasi wisata terbaik di Surabaya dengan rekomendasi
                rute yang optimal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Input Section - 2 Column Layout */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        {/* Enhanced Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Input with Glass Morphism */}
          <div className="relative group">
            {/* Animated Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="relative bg-white shadow-2xl border border-gray-100 overflow-hidden">
              {/* Accent Bar with Gradient */}
              <div className="h-1.5 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"></div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-700 blur-md opacity-50"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
                    Masukkan Lokasi Anda
                  </h2>
                </div>

                {/* Coordinate Inputs with Modern Styling */}
                <div className="space-y-5 mb-8">
                  <div className="group/input transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-4 bg-gradient-to-b from-slate-600 to-slate-800"></span>
                      Latitude
                    </label>
                    <div className="relative">
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
                        className="w-full px-4 py-4 border-2 border-gray-200 focus:ring-2 focus:ring-slate-600 focus:border-slate-600 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 font-mono text-gray-900 shadow-sm group-hover/input:shadow-lg"
                        placeholder="-7.2458"
                      />
                      <div className="absolute inset-0 border-2 border-slate-600 opacity-0 group-hover/input:opacity-10 pointer-events-none transition-opacity duration-300"></div>
                    </div>
                  </div>
                  <div className="group/input transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-4 bg-gradient-to-b from-slate-800 to-emerald-600"></span>
                      Longitude
                    </label>
                    <div className="relative">
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
                        className="w-full px-4 py-4 border-2 border-gray-200 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 font-mono text-gray-900 shadow-sm group-hover/input:shadow-lg"
                        placeholder="112.7378"
                      />
                      <div className="absolute inset-0 border-2 border-emerald-600 opacity-0 group-hover/input:opacity-10 pointer-events-none transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-4 mb-6">
                  <button
                    onClick={handleGetCurrentLocation}
                    className="group/btn relative w-full px-6 py-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden"
                  >
                    <span className="absolute inset-0 w-0 bg-gradient-to-r from-white/10 to-transparent transition-all duration-500 group-hover/btn:w-full"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      <MapPin className="w-5 h-5 transition-transform group-hover/btn:scale-110 duration-300" />
                      Gunakan Lokasi Saat Ini
                    </span>
                  </button>
                  <button
                    onClick={handleGenerateRoutes}
                    disabled={isLoading || isCalculatingDistance}
                    className="group/btn relative w-full px-6 py-5 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-900 hover:to-black text-white font-bold text-lg transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-all duration-300"></span>
                    <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>
                    <span className="relative flex items-center justify-center gap-3">
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
                          <RouteIcon className="w-6 h-6 transition-transform group-hover/btn:rotate-12 duration-300" />
                          <span>Generate Rute</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Enhanced Info Box */}
                <div className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-600/5 via-slate-700/5 to-emerald-600/5 opacity-50"></div>
                  <div className="relative p-5 border-l-4 border-slate-700 shadow-inner backdrop-blur-sm">
                    <p className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-slate-700 animate-pulse"></span>
                        <span
                          className="w-2 h-2 bg-slate-600 animate-pulse"
                          style={{ animationDelay: '0.2s' }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-emerald-600 animate-pulse"
                          style={{ animationDelay: '0.4s' }}
                        ></span>
                      </span>
                      Tips:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-3 group/tip">
                        <span className="text-slate-700 font-bold transition-transform group-hover/tip:translate-x-1 duration-200">
                          →
                        </span>
                        <span className="flex-1">
                          Klik peta di sebelah kanan untuk memilih lokasi
                        </span>
                      </li>
                      <li className="flex items-start gap-3 group/tip">
                        <span className="text-emerald-600 font-bold transition-transform group-hover/tip:translate-x-1 duration-200">
                          →
                        </span>
                        <span className="flex-1">
                          Drag marker merah ke posisi yang diinginkan
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 shadow-md">
                    <p className="text-sm font-semibold">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Map Picker */}
          <div className="relative group">
            {/* Animated Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="relative bg-white shadow-2xl border border-gray-100 h-full overflow-hidden">
              {/* Accent Bar with Gradient */}
              <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>

              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-600 blur-md opacity-50"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-700">
                    Pilih Lokasi di Peta
                  </h2>
                </div>

                <div className="flex-1 overflow-hidden shadow-2xl ring-2 ring-gray-100 relative group/map">
                  {/* Map Hover Overlay */}
                  <div className="absolute inset-0 border-2 border-emerald-600 opacity-0 group-hover/map:opacity-20 pointer-events-none transition-opacity duration-300 z-10"></div>
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

        {/* Route Selection with Enhanced Design */}
        {routeData && routeData.data && routeData.data.routes && (
          <div className="mb-12 relative">
            {/* Section Header with Animation */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-slate-700 blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <RouteIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
                  Pilih Rute Terbaik
                </h2>
                <p className="text-gray-600 font-medium mt-1">
                  {routeData.data.routes.length} Rekomendasi Tersedia
                </p>
              </div>
            </div>

            {/* Route Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {routeData.data.routes.map((route: Route) => (
                <button
                  key={route.rank}
                  onClick={() => setSelectedRoute(route)}
                  className={`group relative overflow-hidden transition-all duration-500 text-left transform hover:scale-[1.02] ${
                    selectedRoute?.rank === route.rank
                      ? 'shadow-2xl'
                      : 'shadow-lg hover:shadow-2xl'
                  }`}
                >
                  {/* Animated Gradient Border */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 transition-opacity duration-300 ${
                      selectedRoute?.rank === route.rank
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-50'
                    }`}
                  ></div>

                  {/* Card Content */}
                  <div
                    className={`relative m-[2px] p-6 transition-all duration-300 ${
                      selectedRoute?.rank === route.rank
                        ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50'
                        : 'bg-white'
                    }`}
                  >
                    {/* Header with Rank Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative">
                        <div
                          className={`absolute inset-0 blur-md transition-opacity duration-300 ${
                            selectedRoute?.rank === route.rank
                              ? 'opacity-60'
                              : 'opacity-0'
                          } bg-slate-700`}
                        ></div>
                        <div
                          className={`relative px-5 py-2.5 font-bold transition-all duration-300 ${
                            selectedRoute?.rank === route.rank
                              ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg'
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                          }`}
                        >
                          Rute #{route.rank}
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedRoute?.rank === route.rank && (
                        <div className="flex items-center gap-2 text-slate-700 font-semibold animate-pulse">
                          <div className="w-2 h-2 bg-slate-700"></div>
                          Dipilih
                        </div>
                      )}
                    </div>

                    {/* Stats with Modern Design */}
                    <div className="space-y-3">
                      <div className="group/stat relative overflow-hidden p-4 bg-gradient-to-br from-white to-gray-50 border-l-4 border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700 uppercase text-xs tracking-wider">
                            Destinasi
                          </span>
                          <span className="font-bold text-slate-800 text-2xl">
                            {route.total_destinations}
                          </span>
                        </div>
                      </div>
                      <div className="group/stat relative overflow-hidden p-4 bg-gradient-to-br from-white to-gray-50 border-l-4 border-emerald-600 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-700 uppercase text-xs tracking-wider">
                            Total Jarak
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="font-bold text-emerald-600 text-2xl">
                              {route.total_distance_km.toFixed(2)}{' '}
                              <span className="text-base">km</span>
                            </span>
                          </div>
                          {route.estimated_duration_minutes && (
                            <span className="text-xs text-gray-500 mt-1">
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
        )}

        {/* Route Details, Map, and Destinations */}
        {selectedRoute && (
          <>
            {/* Detail Rute - Enhanced Statistics */}
            <div className="relative group mb-12">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="relative bg-white shadow-2xl border border-gray-100 overflow-hidden">
                {/* Accent Bar */}
                <div className="h-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800"></div>

                <div className="p-10">
                  {/* Section Header */}
                  <div className="flex items-center gap-4 mb-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-slate-700 blur-lg opacity-50"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <RouteIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
                        Detail Rute #{selectedRoute.rank}
                      </h2>
                      <p className="text-gray-600 font-medium mt-1">
                        Statistik Perjalanan Anda
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Statistics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Destinations Stat */}
                    <div className="group/stat relative overflow-hidden h-full flex">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-slate-700/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 border-l-4 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-slate-700/10 flex items-center justify-center">
                            <div className="w-3 h-3 bg-slate-700"></div>
                          </div>
                          <span className="text-xs uppercase tracking-wider font-bold text-gray-500">
                            Destinasi
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="text-5xl font-bold text-slate-800 mb-2 tracking-tight">
                            {selectedRoute.total_destinations}
                          </div>
                          <div className="text-sm font-semibold text-gray-600">
                            Tempat Wisata
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Distance Stat */}
                    <div className="group/stat relative overflow-hidden h-full flex">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 border-l-4 border-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 w-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-emerald-600/10 flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-600"></div>
                          </div>
                          <span className="text-xs uppercase tracking-wider font-bold text-gray-500">
                            Jarak Rute
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="text-5xl font-bold text-emerald-600 mb-2 tracking-tight">
                            {selectedRoute.total_distance_km.toFixed(2)}
                          </div>
                          <div className="text-sm font-semibold text-gray-600">
                            Kilometer
                          </div>
                          {selectedRoute.estimated_duration_minutes && (
                            <div className="mt-3 pt-3 border-t border-emerald-200">
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                Estimasi Waktu
                              </div>
                              <div className="text-2xl font-bold text-emerald-700">
                                {Math.round(
                                  selectedRoute.estimated_duration_minutes
                                )}{' '}
                                min
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ranking Stat */}
                    <div className="group/stat relative overflow-hidden h-full flex">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 border-l-4 border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 w-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-gray-600/10 flex items-center justify-center">
                            <div className="w-3 h-3 bg-gray-600"></div>
                          </div>
                          <span className="text-xs uppercase tracking-wider font-bold text-gray-500">
                            Peringkat
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="text-5xl font-bold text-gray-700 mb-2 tracking-tight">
                            #{selectedRoute.rank}
                          </div>
                          <div className="text-sm font-semibold text-gray-600">
                            Rekomendasi
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Peta Rute - Enhanced Map Section */}
            <div className="relative group mb-12">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="relative bg-white shadow-2xl border border-gray-100 overflow-hidden">
                {/* Accent Bar */}
                <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>

                <div className="p-10">
                  {/* Section Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-600 blur-lg opacity-50"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                        <MapPin className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-700">
                        Peta Rute Perjalanan
                      </h2>
                      <p className="text-gray-600 font-medium mt-1">
                        Visualisasi Rute Optimal Anda
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden shadow-2xl ring-4 ring-gray-100">
                    <MapComponent
                      userLocation={[
                        userLocation.latitude,
                        userLocation.longitude,
                      ]}
                      destinations={selectedRoute.destinations}
                      preCalculatedDistance={selectedRoute.total_distance_km}
                      preCalculatedDuration={
                        selectedRoute.estimated_duration_minutes
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Daftar Destinasi - Enhanced Destination List */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="relative bg-white shadow-2xl border border-gray-100 overflow-hidden">
                {/* Accent Bar */}
                <div className="h-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800"></div>

                <div className="p-10">
                  {/* Section Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-slate-700 blur-lg opacity-50"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <Star className="w-7 h-7 text-white fill-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
                        Daftar Destinasi
                      </h2>
                      <p className="text-gray-600 font-medium mt-1">
                        {selectedRoute.destinations.length} Tempat Wisata
                        Menakjubkan
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedRoute.destinations.map((destination, idx) => (
                      <DestinationCard
                        key={`${destination.nama}-${idx}`}
                        destination={{
                          ...destination,
                          place_id: destination.nama,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State with Enhanced Design */}
        {!selectedRoute &&
          routeData &&
          routeData.data &&
          routeData.data.routes && (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-slate-700 blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mx-auto mb-6">
                  <RouteIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
                Pilih salah satu rute di atas untuk melihat detail
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
