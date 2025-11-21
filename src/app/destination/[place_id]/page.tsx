import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDestinations } from '@/services/destinationService';
import DestinationDetail from '@/components/DestinationDetail';

interface PageProps {
  params: {
    place_id: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const placeId = decodeURIComponent(params.place_id);
  const destinations = await getDestinations();
  const destination = destinations.find((dest) => dest.place_id === placeId);

  if (!destination) {
    return {
      title: 'Destinasi Tidak Ditemukan | Wisata Surabaya',
      description: 'Destinasi yang Anda cari tidak ditemukan.',
    };
  }

  return {
    title: `${destination.nama} | Wisata Surabaya`,
    description:
      destination.deskripsi ||
      `Informasi lengkap tentang ${destination.nama} di Surabaya`,
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const placeId = decodeURIComponent(params.place_id);

  console.log('🔍 Looking for destination with place_id:', placeId);

  const destinations = await getDestinations();
  console.log('📍 Available destinations:', destinations.length);

  const destination = destinations.find((dest) => dest.place_id === placeId);

  if (!destination) {
    console.log('❌ Destination not found:', placeId);
    notFound();
  }

  console.log('✅ Found destination:', destination.nama);

  return <DestinationDetail destination={destination} />;
}
