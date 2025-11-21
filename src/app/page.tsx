import { Metadata } from 'next';
import { getDestinations } from '@/services/destinationService';
import HomeContent from '@/components/HomeContent';

export const metadata: Metadata = {
  title: 'Wisata Surabaya | Rekomendasi Rute Wisata',
  description:
    'Temukan destinasi wisata terbaik di Surabaya dengan rekomendasi rute yang optimal menggunakan Hybrid Genetic Algorithm',
};

export default async function Home() {
  const destinations = await getDestinations();

  return <HomeContent destinations={destinations} />;
}
