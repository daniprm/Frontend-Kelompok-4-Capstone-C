// import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
// import './globals.css';
// import AppLayout from '@/components/AppLayout';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

// export const metadata: Metadata = {
//   title: 'Rekomendasi Wisata Surabaya',
//   description:
//     'Dapatkan rekomendasi rute wisata terbaik di Surabaya dengan AI-powered routing system',
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <AppLayout>{children}</AppLayout>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/AppLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rekomendasi Wisata Surabaya',
  description:
    'Dapatkan rekomendasi rute wisata terbaik di Surabaya dengan AI-powered routing system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}