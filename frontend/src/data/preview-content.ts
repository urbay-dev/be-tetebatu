import type { Locale } from '../types/locale';

export type ServicePreviewItem = {
  name: string;
  description: string;
  image?: string;
  href: string;
  sample: boolean;
  illustrative?: boolean;
};
export type ServicePreviewSection = {
  slug: string;
  name: string;
  items: ServicePreviewItem[];
};

const rice = '/images/generated/tetebatu-hero-v2.png';
const village = '/images/generated/village-v2.png';
const waterfall = '/images/generated/waterfall-v2.png';
const examples: Record<
  string,
  { image: string; id: [string, string]; en: [string, string] }[]
> = {
  'tourist-attractions': [
    {
      image: rice,
      id: [
        'Jalur persawahan',
        'Berjalan di antara petak sawah dan menikmati suasana desa.',
      ],
      en: [
        'Rice field walks',
        'Walk between rice terraces and take in the village surroundings.',
      ],
    },
    {
      image: waterfall,
      id: [
        'Wisata air terjun',
        'Pilihan kunjungan alam untuk melengkapi perjalananmu.',
      ],
      en: [
        'Waterfall visits',
        'A nature outing to include in your travel plans.',
      ],
    },
  ],
  accommodation: [
    {
      image: '/images/generated/stay-v2.png',
      id: [
        'Kamar dengan pemandangan hijau',
        'Contoh penginapan untuk beristirahat setelah menjelajahi desa.',
      ],
      en: [
        'A room with a green view',
        'An example stay for resting after exploring the village.',
      ],
    },
    {
      image: village,
      id: [
        'Menginap di lingkungan desa',
        'Kenali pilihan akomodasi yang dekat dengan kehidupan lokal.',
      ],
      en: [
        'Stays in the village',
        'Find accommodation close to everyday village life.',
      ],
    },
  ],
  restaurants: [
    {
      image: '/images/preview/food.webp',
      id: [
        'Menu makan siang',
        'Contoh hidangan untuk jeda makan di tengah perjalanan.',
      ],
      en: ['Lunch menus', 'An example meal for a break during your visit.'],
    },
    {
      image: '/images/preview/food.webp',
      id: [
        'Kuliner untuk keluarga',
        'Cari pilihan tempat makan dan tanyakan menu yang tersedia.',
      ],
      en: [
        'Family dining',
        'Browse dining options and ask about available dishes.',
      ],
    },
  ],
  'coffee-shops': [
    {
      image: '/images/generated/coffee-v2.png',
      id: [
        'Kopi dan waktu bersantai',
        'Tempat singgah untuk menikmati kopi sebelum melanjutkan perjalanan.',
      ],
      en: [
        'Coffee and a quiet break',
        'A stop for coffee before continuing your visit.',
      ],
    },
    {
      image: '/images/generated/coffee-v2.png',
      id: [
        'Singgah di kedai',
        'Temukan minuman dan camilan untuk menemani obrolan.',
      ],
      en: [
        'A café stop',
        'Find drinks and snacks to enjoy over a conversation.',
      ],
    },
  ],
  'tours-activities': [
    {
      image: rice,
      id: [
        'Jalan kaki keliling desa',
        'Contoh aktivitas untuk mengenal jalur sawah bersama pemandu.',
      ],
      en: [
        'Village walking tour',
        'An example activity exploring rice field paths with a guide.',
      ],
    },
    {
      image: village,
      id: [
        'Mengenal keseharian warga',
        'Susun kunjungan dan tanyakan aktivitas yang dapat diikuti.',
      ],
      en: [
        'Everyday village life',
        'Plan a visit and ask which activities are available.',
      ],
    },
  ],
  'car-drivers': [
    {
      image: rice,
      id: [
        'Perjalanan menuju Tetebatu',
        'Tanyakan titik jemput dan kebutuhan kendaraan kepada penyedia.',
      ],
      en: [
        'Getting to Tetebatu',
        'Discuss pickup points and vehicle needs with a provider.',
      ],
    },
    {
      image: waterfall,
      id: [
        'Mobil untuk perjalanan wisata',
        'Rencanakan rute kunjungan dan diskusikan durasinya.',
      ],
      en: [
        'Cars for sightseeing',
        'Plan your stops and discuss the duration of your trip.',
      ],
    },
  ],
  'motorcycle-taxis': [
    {
      image: '/images/preview/scooter.webp',
      id: [
        'Ojek untuk perjalanan lokal',
        'Contoh layanan antar untuk mobilitas di sekitar desa.',
      ],
      en: [
        'Local motorcycle trips',
        'An example transport service for getting around the village.',
      ],
    },
    {
      image: '/images/preview/scooter.webp',
      id: [
        'Antar ke tujuan wisata',
        'Tanyakan rute, titik temu, dan perlengkapan berkendara.',
      ],
      en: [
        'Rides to your next stop',
        'Ask about routes, meeting points, and riding equipment.',
      ],
    },
  ],
};

export function exampleServices(
  slug: string,
  locale: Locale,
): ServicePreviewItem[] {
  return (examples[slug] ?? []).map((item) => ({
    name: item[locale][0],
    description: item[locale][1],
    image:
      slug === 'tours-activities'
        ? '/images/generated/village-v2.png'
        : item.image,
    href: `/${locale}/categories/${slug}`,
    sample: true,
  }));
}

export function serviceIllustration(
  slug: string,
  name: string,
  locale: Locale,
  index: number,
) {
  if (/air terjun|waterfall/i.test(name))
    return '/images/generated/waterfall-v2.png';
  if (slug === 'tours-activities') return '/images/generated/village-v2.png';
  if (slug === 'car-drivers') return '/images/generated/transport-v2.png';
  return exampleServices(slug, locale)[index % 2]?.image;
}
