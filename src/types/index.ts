// Types untuk aplikasi rekomendasi wisata

// import { Key } from 'react';

export interface Destination {
  place_id: string | null | undefined;
  order: number;
  nama: string;
  kategori: string[];
  coordinates: [number, number];
  deskripsi?: string;
  gambar?: string;
  alamat?: string;
  jam_buka?: string;
  rating?: number;
  image_url?: string | null;
}

export interface Route {
  rank: number;
  start_point: [number, number];
  total_destinations: number;
  total_distance_km: number;
  destinations: Destination[];
  is_valid_order: boolean;
  fitness: number;
  estimated_duration_minutes?: number; // Added for OSRM duration
}

export interface Statistics {
  total_generations: number;
  best_distance_km: number;
  initial_fitness: number;
  final_fitness: number;
  improvement_percentage: number;
}

export interface HGAConfig {
  population_size: number;
  generations: number;
  crossover_rate: number;
  mutation_rate: number;
}

export interface ApiResponseData {
  user_location: {
    latitude: number;
    longitude: number;
  };
  hga_config: HGAConfig;
  statistics: Statistics;
  routes: Route[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiResponseData;
  timestamp: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
