'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Destination } from '@/types';
import { getOSRMRoute, TransportMode } from '@/lib/api';
import { Car, Bike, LucideIcon } from 'lucide-react';

interface MapComponentProps {
  destinations: Destination[];
  userLocation?: [number, number];
  height?: string;
  preCalculatedDistance?: number; // Distance in km from OSRM calculation
  preCalculatedDuration?: number; // Duration in minutes from OSRM calculation
  showRoute?: boolean; // Whether to show route or just markers
}

export default function MapComponent({
  destinations,
  userLocation = [-7.2458, 112.7378],
  height = '500px',
  preCalculatedDistance,
  preCalculatedDuration,
  showRoute = true, // Default to true for backward compatibility
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  // Initialize route info with pre-calculated values if available
  useEffect(() => {
    if (preCalculatedDistance && preCalculatedDuration) {
      setRouteInfo({
        distance: preCalculatedDistance * 1000, // Convert km to meters
        duration: preCalculatedDuration * 60, // Convert minutes to seconds
      });
    }
  }, [preCalculatedDistance, preCalculatedDuration]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(userLocation, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Safety check - ensure map is initialized
    if (!map) return;

    // Clear existing layers except tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Custom icon for markers
    const createIcon = (color: string, number?: number) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${
          number || '📍'
        }</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    // Custom icon for user location with person silhouette
    const userLocationIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative; width: 40px; height: 40px;">
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <!-- Circle background with shadow -->
            <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"/>
            <!-- Person icon -->
            <circle cx="20" cy="14" r="5" fill="white"/>
            <path d="M20 20c-5 0-9 3-9 7v3h18v-3c0-4-4-7-9-7z" fill="white"/>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    // Custom red pin icon for single destination (when showRoute is false)
    const destinationPinIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative; width: 30px; height: 40px;">
          <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
            <!-- Pin shadow -->
            <ellipse cx="15" cy="38" rx="6" ry="2" fill="rgba(0,0,0,0.2)"/>
            <!-- Pin body -->
            <path d="M15 0C8.925 0 4 4.925 4 11c0 8.25 11 24 11 24s11-15.75 11-24c0-6.075-4.925-11-11-11z" 
                  fill="#EF4444" stroke="#B91C1C" stroke-width="1"/>
            <!-- Pin inner circle -->
            <circle cx="15" cy="11" r="5" fill="white"/>
            <circle cx="15" cy="11" r="3" fill="#B91C1C"/>
          </svg>
        </div>
      `,
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

    // Add user location marker with red pin (only if showing route)
    if (showRoute) {
      try {
        L.marker(userLocation, {
          icon: userLocationIcon,
        })
          .addTo(map)
          .bindPopup('<b>Lokasi Anda</b>');
      } catch (error) {
        console.error('Error adding user location marker:', error);
      }
    }

    // Add destination markers
    destinations.forEach((dest) => {
      try {
        const imageUrl =
          dest.image_url ||
          dest.gambar ||
          `https://picsum.photos/seed/${dest.place_id}/200/120`;
        const popupContent = `
          <div style="width: 220px; font-family: system-ui, -apple-system, sans-serif;">
            <img 
              src="${imageUrl}" 
              alt="${dest.nama}" 
              style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0; margin-bottom: 8px;"
              onerror="this.src='https://picsum.photos/seed/${
                dest.place_id
              }/200/120'"
            />
            <div style="padding: 0 4px 4px 4px;">
              <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #1e3a8a;">
                ${showRoute ? `${dest.order}. ` : ''}${dest.nama}
              </h3>
              ${
                dest.alamat
                  ? `
                <p style="margin: 0; font-size: 12px; color: #4b5563; line-height: 1.4;">
                  📍 ${dest.alamat}
                </p>
              `
                  : ''
              }
            </div>
          </div>
        `;

        L.marker(dest.coordinates, {
          icon: showRoute
            ? createIcon('#3B82F6', dest.order)
            : destinationPinIcon,
        })
          .addTo(map)
          .bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup',
          });
      } catch (error) {
        console.error('Error adding destination marker:', error);
      }
    });

    // Fetch and draw route using OSRM (only if showRoute is true)
    if (showRoute && destinations.length > 0) {
      // Use pre-calculated values if available and mode is 'car'
      const usePreCalculated = preCalculatedDistance && preCalculatedDuration;

      if (usePreCalculated) {
        console.log('Using pre-calculated route info for car mode');
        // Don't need to fetch again, just draw the route
        const allPoints = [
          userLocation,
          ...destinations.map((d) => d.coordinates),
        ];

        setIsLoading(true);
        getOSRMRoute(allPoints)
          .then((data) => {
            const currentMap = mapRef.current;
            if (data.routes && data.routes[0] && currentMap) {
              const route = data.routes[0];
              const coordinates = route.geometry.coordinates.map(
                (coord: [number, number]) =>
                  [coord[1], coord[0]] as [number, number]
              );

              // Use pre-calculated distance and duration
              setRouteInfo({
                distance: preCalculatedDistance! * 1000, // km to meters
                duration: preCalculatedDuration! * 60, // minutes to seconds
              });

              try {
                L.polyline(coordinates, {
                  color: '#3B82F6',
                  weight: 4,
                  opacity: 0.7,
                }).addTo(currentMap);

                const bounds = L.latLngBounds([
                  userLocation,
                  ...destinations.map((d) => d.coordinates),
                ]);
                currentMap.fitBounds(bounds, { padding: [50, 50] });
              } catch (error) {
                console.error('Error adding route polyline:', error);
              }
            }
          })
          .catch((error) => {
            console.error('Error fetching route geometry:', error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // Fetch new route for bike or foot, or if no pre-calculated values
        setIsLoading(true);
        setRouteInfo(null); // Clear previous route info

        const allPoints = [
          userLocation,
          ...destinations.map((d) => d.coordinates),
        ];

        getOSRMRoute(allPoints)
          .then((data) => {
            // Use mapRef.current instead of map variable to get latest reference
            const currentMap = mapRef.current;
            if (data.routes && data.routes[0] && currentMap) {
              const route = data.routes[0];
              const coordinates = route.geometry.coordinates.map(
                (coord: [number, number]) =>
                  [coord[1], coord[0]] as [number, number]
              );

              // Store route info for display
              console.log('Setting route info:', {
                distance: route.distance,
                duration: route.duration,
              });

              setRouteInfo({
                distance: route.distance,
                duration: route.duration,
              });

              try {
                // Use consistent blue color for all transport modes
                L.polyline(coordinates, {
                  color: '#3B82F6',
                  weight: 4,
                  opacity: 0.7,
                }).addTo(currentMap);

                // Fit map to show all markers
                const bounds = L.latLngBounds([
                  userLocation,
                  ...destinations.map((d) => d.coordinates),
                ]);
                currentMap.fitBounds(bounds, { padding: [50, 50] });
              } catch (error) {
                console.error('Error adding route polyline:', error);
              }
            }
          })
          .catch((error) => {
            console.error('Error fetching route:', error);
            // Fallback: draw straight lines
            const currentMap = mapRef.current;
            if (currentMap) {
              try {
                const points = [
                  userLocation,
                  ...destinations.map((d) => d.coordinates),
                ];
                L.polyline(points, {
                  color: '#3B82F6',
                  weight: 4,
                  opacity: 0.5,
                  dashArray: '10, 10',
                }).addTo(currentMap);
              } catch (error) {
                console.error('Error adding fallback polyline:', error);
              }
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else if (!showRoute && destinations.length > 0) {
      // If not showing route, just fit bounds to destinations
      try {
        const bounds = L.latLngBounds(destinations.map((d) => d.coordinates));
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error('Error fitting bounds to destinations:', error);
      }
    }

    // Cleanup function
    return () => {
      // Don't remove map on dependency changes, only on unmount
    };
  }, [
    destinations,
    userLocation,
    preCalculatedDistance,
    preCalculatedDuration,
    showRoute,
  ]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Helper function to format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} jam ${minutes} menit`;
    }
    return `${minutes} menit`;
  };

  // Helper function to format distance
  const formatDistance = (meters: number) => {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  };

  return (
    <div className="relative">
      {/* Route Info Display */}
      {showRoute && routeInfo && !isLoading && (
        <div className="absolute top-4 right-4 bg-white shadow-lg border border-gray-200 z-[1000] overflow-hidden min-w-[200px]">
          <div className="h-1 bg-blue-600"></div>
          <div className="p-4">
            <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Estimasi Perjalanan
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gradient-to-br from-white to-gray-50 border-l-4 border-blue-600">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jarak
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {formatDistance(routeInfo.distance)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gradient-to-br from-white to-gray-50 border-l-4 border-gray-700">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Waktu
                </span>
                <span className="text-lg font-bold text-gray-800">
                  {formatDuration(routeInfo.duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRoute && isLoading && (
        <div className="absolute top-4 right-4 bg-white px-4 py-2 shadow-lg border border-gray-200 z-[1000]">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600 font-medium">
              Memuat rute...
            </span>
          </div>
        </div>
      )}

      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="shadow-lg"
      />
    </div>
  );
}
