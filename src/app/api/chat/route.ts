import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Cache untuk dataset wisata
let wisataDataCache: string | null = null;

interface WisataDestination {
  restaurant_id: number;
  nama_destinasi: string;
  kategori: string;
  latitude: string;
  longitude: string;
  alamat: string | null;
  image_url: string | null;
  deskripsi: string | null;
}

// Function untuk load dan parse JSONL
function loadWisataData(): string {
  if (wisataDataCache) {
    return wisataDataCache;
  }

  try {
    const jsonlPath = path.join(
      process.cwd(),
      'src',
      'app',
      'data',
      'data_wisata.jsonl'
    );
    const jsonlContent = fs.readFileSync(jsonlPath, 'utf-8');

    // Parse JSONL (each line is a JSON object)
    const destinations: WisataDestination[] = jsonlContent
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));

    let formattedData = '# DATABASE DESTINASI WISATA SURABAYA\n\n';
    formattedData += `Total destinasi: ${destinations.length}\n\n`;

    // Group by kategori
    const byCategory: { [key: string]: WisataDestination[] } = {};

    destinations.forEach((dest) => {
      const categories = dest.kategori.split(',').map((c) => c.trim());
      categories.forEach((cat) => {
        if (!byCategory[cat]) {
          byCategory[cat] = [];
        }
        byCategory[cat].push(dest);
      });
    });

    // Format per kategori dengan informasi lengkap
    Object.keys(byCategory)
      .sort()
      .forEach((category) => {
        formattedData += `## Kategori: ${category.toUpperCase()}\n`;
        byCategory[category].forEach((dest) => {
          formattedData += `### ${dest.nama_destinasi}\n`;
          formattedData += `- **Kategori**: ${dest.kategori}\n`;
          formattedData += `- **Lokasi**: ${dest.latitude}, ${dest.longitude}\n`;
          if (dest.alamat) {
            formattedData += `- **Alamat**: ${dest.alamat}\n`;
          }
          if (dest.deskripsi) {
            formattedData += `- **Deskripsi**: ${dest.deskripsi}\n`;
          }
          formattedData += '\n';
        });
        formattedData += '\n';
      });

    wisataDataCache = formattedData;
    return formattedData;
  } catch (error) {
    console.error('Error loading wisata data:', error);
    return 'Data wisata tidak tersedia.';
  }
}

const SYSTEM_PROMPT = `Kamu adalah asisten wisata virtual untuk kota Surabaya, Indonesia. 
Tugas kamu adalah membantu wisatawan mendapatkan informasi tentang:
- Tempat wisata di Surabaya (mall, oleh-oleh, kuliner, wisata alam, wisata budaya, hiburan, dll)
- Rekomendasi destinasi wisata
- Informasi detail tentang destinasi (alamat, deskripsi, lokasi)
- Tips perjalanan di Surabaya
- Makanan khas Surabaya
- Transportasi di Surabaya

Kamu memiliki akses ke database lengkap destinasi wisata di Surabaya dengan informasi:
- Nama destinasi
- Kategori (mall, oleh_oleh, makanan_ringan, makanan_berat, non_kuliner, wisata_alam, dll)
- Koordinat lokasi (latitude, longitude)
- Alamat lengkap
- Deskripsi destinasi
- URL gambar

Kamu harus:
- Selalu menjawab dalam bahasa Indonesia yang ramah dan informatif
- Gunakan data dari database untuk memberikan rekomendasi yang akurat dan spesifik
- Sebutkan nama destinasi yang PERSIS sesuai dengan database
- Fokus HANYA pada topik wisata Surabaya
- Jika ditanya tentang topik di luar wisata Surabaya, dengan sopan arahkan kembali ke topik wisata Surabaya
- Berikan informasi yang lengkap termasuk alamat jika tersedia
- Gunakan format Markdown untuk jawaban yang lebih terstruktur (bold, list, heading, dll)
- Gunakan emoji yang relevan untuk membuat percakapan lebih menarik
- Jika diminta rekomendasi, sebutkan 3-5 destinasi dengan detail
- Kelompokkan rekomendasi berdasarkan kategori jika relevan
- Sebutkan alamat lengkap jika user bertanya tentang lokasi/cara ke suatu tempat

Kategori destinasi yang tersedia:
- mall (pusat perbelanjaan)
- oleh_oleh (toko oleh-oleh dan suvenir)
- makanan_ringan (kue, snack, cemilan)
- makanan_berat (restoran, warung makan)
- non_kuliner (wisata umum, museum, taman, dll)
- play (tempat bermain)
- kantor_pariwisata (information center)
- all (pasar tradisional dan tempat umum)

Jangan menjawab pertanyaan tentang:
- Politik, agama, atau topik sensitif
- Topik di luar wisata dan Surabaya
- Memberikan saran medis, hukum, atau finansial

Contoh pertanyaan yang bisa kamu jawab:
- "Tempat wisata apa yang bagus di Surabaya?"
- "Makanan khas Surabaya apa yang harus dicoba?"
- "Bagaimana cara ke Tugu Pahlawan?"
- "Rekomendasi restoran di Surabaya?"
- "Tempat belanja di Surabaya dimana?"
- "Mall apa saja yang ada di Surabaya?"
- "Tempat beli oleh-oleh di Surabaya?"`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Load wisata data untuk konteks
    const wisataData = loadWisataData();

    // Build conversation history for context
    const chatHistory = history
      ? history.map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }))
      : [];

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'Baik, saya siap membantu Anda dengan informasi wisata di Surabaya! 🏙️✨',
            },
          ],
        },
        {
          role: 'user',
          parts: [
            {
              text: `Berikut adalah database lengkap destinasi wisata di Surabaya yang bisa kamu gunakan untuk menjawab pertanyaan:\n\n${wisataData}`,
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: `Terima kasih! Saya sudah menerima database lengkap ${
                wisataData.split('\n')[1]
              } di Surabaya dengan informasi detail termasuk alamat dan deskripsi. Saya siap memberikan rekomendasi yang akurat berdasarkan data ini! 🗺️`,
            },
          ],
        },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      message: text,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
