import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDestinations } from '@/services/destinationService';
import DestinationDetail from '@/components/DestinationDetail';

interface PageProps {
  params: Promise<{
    place_id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { place_id } = await params;
  const placeId = decodeURIComponent(place_id);
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
  const { place_id } = await params;
  const placeId = decodeURIComponent(place_id);

  const destinations = await getDestinations();

  const destination = destinations.find((dest) => dest.place_id === placeId);

  if (!destination) {
    notFound();
  }

  return <DestinationDetail destination={destination} />;
}
