import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../src/config/env.js';

const prisma = new PrismaClient();
const supabase = createClient(env.SUPABASE_URL || '', env.SUPABASE_SERVICE_ROLE_KEY || '');
const bucket = env.SUPABASE_BUCKET;
const generatedDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/public/images/generated');

const imageFiles = {
  hero: 'tetebatu-hero-v2.png',
  waterfall: 'waterfall-v2.png',
  village: 'village-v2.png',
  coffee: 'coffee-v2.png',
  stay: 'stay-v2.png',
  transport: 'transport-v2.png',
};

type UploadedImage = {
  bucket: string;
  storagePath: string;
  url: string;
  alt: string;
  altEn: string;
};

async function cleanDatabase() {
  await prisma.articleImage.deleteMany();
  await prisma.article.deleteMany();
  await prisma.serviceImage.deleteMany();
  await prisma.serviceContact.deleteMany();
  await prisma.serviceFacility.deleteMany();
  await prisma.serviceFeature.deleteMany();
  await prisma.servicePrice.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.area.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.siteSetting.deleteMany();
}

async function cleanBucket() {
  const { data, error } = await supabase.storage.from(bucket).list('seed', { limit: 1000 });
  if (error) throw error;
  const paths = (data || []).map(file => `seed/${file.name}`);
  if (paths.length === 0) return;
  const { error: removeError } = await supabase.storage.from(bucket).remove(paths);
  if (removeError) throw removeError;
  console.log(`🧹 Removed ${paths.length} old seeded image(s) from bucket`);
}

async function uploadSeedImage(fileName: string, alt: string, altEn: string): Promise<UploadedImage> {
  const filePath = path.join(generatedDir, fileName);
  const file = await fs.readFile(filePath);
  const storagePath = `seed/${fileName}`;
  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: 'image/png',
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return { bucket, storagePath, url: data.publicUrl, alt, altEn };
}

function imageRecord(image: UploadedImage, isPrimary: boolean, sortOrder: number) {
  return {
    bucket: image.bucket,
    storagePath: image.storagePath,
    url: image.url,
    alt: image.alt,
    altEn: image.altEn,
    isPrimary,
    sortOrder,
  };
}

function articleImageRecord(image: UploadedImage, sortOrder: number) {
  return {
    bucket: image.bucket,
    storagePath: image.storagePath,
    url: image.url,
    caption: image.alt,
    captionEn: image.altEn,
    sortOrder,
  };
}

const bookingContact = {
  type: 'WHATSAPP',
  label: 'Booking via WhatsApp',
  value: '08986648730',
  isPrimary: true,
};

async function main() {
  console.log('🌱 Cleaning old seed data...');
  await cleanDatabase();
  await cleanBucket();

  const adminEmail = env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = env.ADMIN_PASSWORD || 'password123';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: env.ADMIN_NAME || 'Super Admin',
      email: adminEmail,
      password: hashedAdminPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('⬆️ Uploading generated images to bucket...');
  const images = {
    hero: await uploadSeedImage(imageFiles.hero, 'Lanskap sawah dan bukit Tetebatu', 'Tetebatu rice field and hill landscape'),
    waterfall: await uploadSeedImage(imageFiles.waterfall, 'Air terjun di hutan Tetebatu', 'Waterfall in Tetebatu forest'),
    village: await uploadSeedImage(imageFiles.village, 'Desa tradisional Sasak di Tetebatu', 'Traditional Sasak village in Tetebatu'),
    coffee: await uploadSeedImage(imageFiles.coffee, 'Kopi arabika Tetebatu', 'Tetebatu arabica coffee'),
    stay: await uploadSeedImage(imageFiles.stay, 'Penginapan di tengah sawah Tetebatu', 'Accommodation among Tetebatu rice fields'),
    transport: await uploadSeedImage(imageFiles.transport, 'Mobil dengan driver wisata Tetebatu', 'Car with Tetebatu tour driver'),
  };
  console.log(`✅ Uploaded ${Object.keys(images).length} images to bucket "${bucket}"`);

  const categories = [
    { name: 'Objek Wisata', nameEn: 'Tourist Attractions', slug: 'tourist-attractions', description: 'Berbagai tempat wisata alam dan budaya di Desa Tetebatu', descriptionEn: 'Various nature and cultural tourist spots in Tetebatu Village', image: images.waterfall.url, sortOrder: 1 },
    { name: 'Penginapan', nameEn: 'Accommodation', slug: 'accommodation', description: 'Tempat menginap nyaman di tengah suasana pedesaan', descriptionEn: 'Comfortable places to stay in the middle of the rural atmosphere', image: images.stay.url, sortOrder: 2 },
    { name: 'Restoran', nameEn: 'Restaurants', slug: 'restaurants', description: 'Kuliner lokal dan internasional dengan pemandangan indah', descriptionEn: 'Local and international cuisine with beautiful views', image: images.village.url, sortOrder: 3 },
    { name: 'Kedai Kopi', nameEn: 'Coffee Shops', slug: 'coffee-shops', description: 'Tempat bersantai menikmati kopi khas Tetebatu', descriptionEn: 'Places to relax and enjoy typical Tetebatu coffee', image: images.coffee.url, sortOrder: 4 },
    { name: 'Tur & Aktivitas', nameEn: 'Tours & Activities', slug: 'tours-activities', description: 'Paket wisata trekking, sepeda, dan petualangan', descriptionEn: 'Trekking, cycling, and adventure tour packages', image: images.village.url, sortOrder: 5 },
    { name: 'Sewa Mobil & Driver', nameEn: 'Car Driver', slug: 'car-driver', description: 'Layanan transportasi mobil dengan driver berpengalaman', descriptionEn: 'Car transportation services with experienced drivers', image: images.transport.url, sortOrder: 6 },
    { name: 'Ojek Lokal', nameEn: 'Local Motorcycle Taxi', slug: 'motorcycle-taxi', description: 'Transportasi cepat menggunakan sepeda motor', descriptionEn: 'Fast transportation using motorcycles', image: images.transport.url, sortOrder: 7 },
  ];

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const created = await prisma.serviceCategory.create({ data: category });
    categoryMap.set(category.slug, created.id);
  }

  const areas = [
    { name: 'Tetebatu', slug: 'tetebatu', description: 'Pusat desa wisata Tetebatu' },
    { name: 'Tetebatu Selatan', slug: 'tetebatu-selatan', description: 'Kawasan sawah dan perkebunan kopi' },
    { name: 'Tetebatu Utara', slug: 'tetebatu-utara', description: 'Kawasan hutan dan air terjun' },
  ];
  const areaMap = new Map<string, string>();
  for (const area of areas) {
    const created = await prisma.area.create({ data: area });
    areaMap.set(area.slug, created.id);
  }

  const services = [
    {
      data: {
        name: 'Air Terjun Tetebatu',
        slug: 'air-terjun-tetebatu',
        shortDescription: 'Air terjun alami di tengah hutan hujan Tetebatu.',
        shortDescriptionEn: 'Natural waterfall in the middle of Tetebatu rainforest.',
        description: 'Nikmati kesegaran air terjun Tetebatu yang dikelilingi hutan hujan tropis dan sawah bertingkat.',
        descriptionEn: 'Enjoy the fresh Tetebatu waterfall surrounded by tropical rainforest and terraced rice fields.',
        categoryId: categoryMap.get('tourist-attractions')!,
        areaId: areaMap.get('tetebatu-utara')!,
        address: 'Tetebatu Utara, Lombok Timur',
        latitude: -8.5105,
        longitude: 116.4162,
        status: 'PUBLISHED',
        isFeatured: true,
        isRecommended: true,
        sortOrder: 1,
        publishedAt: new Date(),
      },
      image: images.waterfall,
      prices: [
        { label: 'Tiket masuk', labelEn: 'Entrance fee', type: 'FIXED', minPrice: 15000, currency: 'IDR', unit: 'orang', unitEn: 'person' },
        { label: 'Trekking + pemandu', labelEn: 'Trek with guide', type: 'FIXED', minPrice: 75000, currency: 'IDR', unit: 'orang', unitEn: 'person' },
      ],
      facilities: [
        { name: 'Area parkir', nameEn: 'Parking area', icon: 'car' },
        { name: 'Pemandu lokal', nameEn: 'Local guide', icon: 'user' },
        { name: 'Toilet', nameEn: 'Restroom', icon: 'restroom' },
        { name: 'Air minum', nameEn: 'Drinking water', icon: 'bottle' },
      ],
      features: [
        { name: 'Trekking singkat', nameEn: 'Short trek', description: 'Jalur pendek menuju air terjun', descriptionEn: 'Short trail to the waterfall' },
        { name: 'Spot foto', nameEn: 'Photo spot', description: 'Pemandangan air terjun untuk berfoto', descriptionEn: 'Waterfall view for photos' },
      ],
      contact: bookingContact,
    },
    {
      data: {
        name: 'Homestay Desa Asri',
        slug: 'homestay-desa-asri',
        shortDescription: 'Menginap nyaman dengan nuansa rumah tradisional Sasak.',
        shortDescriptionEn: 'Comfortable stay with traditional Sasak house atmosphere.',
        description: 'Homestay bernuansa tradisional dengan pemandangan sawah, sarapan lokal, dan keramahan penduduk desa.',
        descriptionEn: 'Traditional homestay with rice field views, local breakfast, and warm village hospitality.',
        categoryId: categoryMap.get('accommodation')!,
        areaId: areaMap.get('tetebatu-selatan')!,
        address: 'Tetebatu Selatan, Lombok Timur',
        latitude: -8.5152,
        longitude: 116.4168,
        status: 'PUBLISHED',
        isFeatured: true,
        isRecommended: true,
        sortOrder: 2,
        publishedAt: new Date(),
      },
      image: images.stay,
      prices: [
        { label: 'Kamar standar', labelEn: 'Standard room', type: 'RANGE', minPrice: 200000, maxPrice: 300000, currency: 'IDR', unit: 'malam', unitEn: 'night' },
        { label: 'Kamar deluxe', labelEn: 'Deluxe room', type: 'FIXED', minPrice: 350000, currency: 'IDR', unit: 'malam', unitEn: 'night' },
      ],
      facilities: [
        { name: 'WiFi', nameEn: 'WiFi', icon: 'wifi' },
        { name: 'Sarapan', nameEn: 'Breakfast', icon: 'coffee' },
        { name: 'Area parkir', nameEn: 'Parking area', icon: 'car' },
        { name: 'AC', nameEn: 'AC', icon: 'snow' },
      ],
      features: [
        { name: 'Pemandangan sawah', nameEn: 'Rice field view', description: 'Kamar menghadap sawah bertingkat', descriptionEn: 'Rooms overlooking terraced rice fields' },
        { name: 'Nuansa tradisional', nameEn: 'Traditional atmosphere', description: 'Arsitektur rumah Sasak yang autentik', descriptionEn: 'Authentic Sasak house architecture' },
      ],
      contact: bookingContact,
    },
    {
      data: {
        name: 'Kopi Tetebatu Premium',
        slug: 'kopi-tetebatu-premium',
        shortDescription: 'Kopi arabika asli dari perkebunan warga Tetebatu.',
        shortDescriptionEn: 'Authentic arabica coffee from Tetebatu local plantations.',
        description: 'Cicipi kopi arabika Tetebatu yang ditanam dan diolah langsung oleh petani lokal.',
        descriptionEn: 'Taste Tetebatu arabica coffee grown and processed directly by local farmers.',
        categoryId: categoryMap.get('coffee-shops')!,
        areaId: areaMap.get('tetebatu')!,
        address: 'Tetebatu, Lombok Timur',
        latitude: -8.5121,
        longitude: 116.4149,
        status: 'PUBLISHED',
        isRecommended: true,
        sortOrder: 3,
        publishedAt: new Date(),
      },
      image: images.coffee,
      prices: [
        { label: 'Secangkir kopi', labelEn: 'Cup of coffee', type: 'FIXED', minPrice: 25000, currency: 'IDR', unit: 'cangkir', unitEn: 'cup' },
        { label: 'Paket biji kopi 250g', labelEn: 'Coffee beans 250g', type: 'FIXED', minPrice: 85000, currency: 'IDR', unit: 'paket', unitEn: 'pack' },
      ],
      facilities: [
        { name: 'WiFi', nameEn: 'WiFi', icon: 'wifi' },
        { name: 'Area duduk', nameEn: 'Seating area', icon: 'chair' },
        { name: 'Area parkir', nameEn: 'Parking area', icon: 'car' },
        { name: 'Tasting kopi', nameEn: 'Coffee tasting', icon: 'coffee' },
      ],
      features: [
        { name: 'Roasting lokal', nameEn: 'Local roasting', description: 'Biji kopi disangrai di desa', descriptionEn: 'Beans are roasted in the village' },
        { name: 'Kunjungan kebun', nameEn: 'Farm visit', description: 'Lihat langsung perkebunan kopi warga', descriptionEn: 'Visit local coffee plantations' },
      ],
      contact: bookingContact,
    },
    {
      data: {
        name: 'Trekking Hutan Tetebatu',
        slug: 'trekking-hutan-tetebatu',
        shortDescription: 'Jelajahi hutan, sawah, dan desa dengan pemandu lokal.',
        shortDescriptionEn: 'Explore forest, rice fields, and village with a local guide.',
        description: 'Paket trekking setengah hari menyusuri hutan Tetebatu, air terjun, dan permukiman Sasak.',
        descriptionEn: 'Half-day trek through Tetebatu forest, waterfall, and Sasak settlement.',
        categoryId: categoryMap.get('tours-activities')!,
        areaId: areaMap.get('tetebatu-utara')!,
        address: 'Tetebatu, Lombok Timur',
        status: 'PUBLISHED',
        isFeatured: true,
        sortOrder: 4,
        publishedAt: new Date(),
      },
      image: images.village,
      prices: [
        { label: 'Trekking setengah hari', labelEn: 'Half-day trek', type: 'STARTING_FROM', minPrice: 150000, currency: 'IDR', unit: 'orang', unitEn: 'person' },
        { label: 'Trekking sehari penuh', labelEn: 'Full-day trek', type: 'STARTING_FROM', minPrice: 275000, currency: 'IDR', unit: 'orang', unitEn: 'person' },
      ],
      facilities: [
        { name: 'Pemandu lokal', nameEn: 'Local guide', icon: 'user' },
        { name: 'Air minum', nameEn: 'Drinking water', icon: 'bottle' },
        { name: 'Makan siang', nameEn: 'Lunch', icon: 'food' },
        { name: 'Transportasi antar-jemput', nameEn: 'Pickup transport', icon: 'car' },
      ],
      features: [
        { name: 'Air terjun', nameEn: 'Waterfall', description: 'Singgah di air terjun Tetebatu', descriptionEn: 'Stop at Tetebatu waterfall' },
        { name: 'Trek sawah', nameEn: 'Rice field trek', description: 'Jalur melewati sawah bertingkat', descriptionEn: 'Trail through terraced rice fields' },
      ],
      contact: bookingContact,
    },
    {
      data: {
        name: 'Sewa Mobil & Driver Tetebatu',
        slug: 'sewa-mobil-driver-tetebatu',
        shortDescription: 'Transportasi mobil nyaman dengan driver berpengalaman.',
        shortDescriptionEn: 'Comfortable car transportation with experienced driver.',
        description: 'Layanan sewa mobil dengan driver lokal untuk perjalanan wisata di sekitar Tetebatu dan Lombok Timur.',
        descriptionEn: 'Car rental with local driver for trips around Tetebatu and East Lombok.',
        categoryId: categoryMap.get('car-driver')!,
        areaId: areaMap.get('tetebatu')!,
        address: 'Tetebatu, Lombok Timur',
        status: 'PUBLISHED',
        sortOrder: 5,
        publishedAt: new Date(),
      },
      image: images.transport,
      prices: [
        { label: 'Sewa 8 jam', labelEn: '8-hour rental', type: 'FIXED', minPrice: 450000, currency: 'IDR', unit: 'hari', unitEn: 'day' },
        { label: 'Sewa 12 jam', labelEn: '12-hour rental', type: 'FIXED', minPrice: 650000, currency: 'IDR', unit: 'hari', unitEn: 'day' },
      ],
      facilities: [
        { name: 'AC', nameEn: 'AC', icon: 'snow' },
        { name: 'Bensin termasuk', nameEn: 'Fuel included', icon: 'fuel' },
        { name: 'Driver lokal', nameEn: 'Local driver', icon: 'user' },
        { name: 'WiFi di mobil', nameEn: 'Car WiFi', icon: 'wifi' },
      ],
      features: [
        { name: 'Driver lokal', nameEn: 'Local driver', description: 'Driver mengenal rute wisata setempat', descriptionEn: 'Driver knows local tourist routes' },
        { name: 'Rute fleksibel', nameEn: 'Flexible route', description: 'Bisa menyesuaikan itinerary perjalanan', descriptionEn: 'Itinerary can be adjusted' },
      ],
      contact: bookingContact,
    },
    {
      data: {
        name: 'Wisata Desa Sasak',
        slug: 'wisata-desa-sasak',
        shortDescription: 'Kenali budaya dan kehidupan desa Sasak Tetebatu.',
        shortDescriptionEn: 'Discover the culture and village life of Sasak Tetebatu.',
        description: 'Kunjungan ke desa tradisional Sasak, rumah lumbung, dan kegiatan harian warga.',
        descriptionEn: 'Visit a traditional Sasak village, lumbung houses, and local daily activities.',
        categoryId: categoryMap.get('tourist-attractions')!,
        areaId: areaMap.get('tetebatu')!,
        address: 'Tetebatu, Lombok Timur',
        status: 'PUBLISHED',
        isRecommended: true,
        sortOrder: 6,
        publishedAt: new Date(),
      },
      image: images.village,
      prices: [
        { label: 'Tur desa', labelEn: 'Village tour', type: 'FIXED', minPrice: 50000, currency: 'IDR', unit: 'orang', unitEn: 'person' },
        { label: 'Lokakarya tenun', labelEn: 'Weaving workshop', type: 'FIXED', minPrice: 100000, currency: 'IDR', unit: 'orang', unitEn: 'person' },
      ],
      facilities: [
        { name: 'Pemandu lokal', nameEn: 'Local guide', icon: 'user' },
        { name: 'Transportasi desa', nameEn: 'Village transport', icon: 'car' },
        { name: 'Camilan lokal', nameEn: 'Local snack', icon: 'food' },
      ],
      features: [
        { name: 'Rumah tradisional', nameEn: 'Traditional house', description: 'Lihat arsitektur rumah Sasak', descriptionEn: 'See Sasak house architecture' },
        { name: 'Demo tenun', nameEn: 'Weaving demo', description: 'Belajar menenun kain Sasak', descriptionEn: 'Learn Sasak weaving' },
      ],
      contact: bookingContact,
    },
  ];

  for (const item of services) {
    await prisma.service.create({
      data: {
        ...item.data,
        images: { create: [imageRecord(item.image, true, 0)] },
        contacts: { create: [item.contact] },
        facilities: { create: item.facilities },
        features: { create: item.features },
        prices: { create: item.prices },
      },
    });
  }
  console.log(`✅ ${services.length} services with bucket images seeded`);

  const article = await prisma.article.create({
    data: {
      title: 'Menjelajahi Keindahan Tetebatu',
      titleEn: 'Exploring the Beauty of Tetebatu',
      slug: 'menjelajahi-keindahan-tetebatu',
      excerpt: 'Panduan singkat wisata Tetebatu: sawah, air terjun, kopi, dan desa Sasak.',
      excerptEn: 'A short guide to Tetebatu: rice fields, waterfall, coffee, and Sasak village.',
      content: 'Tetebatu menawarkan perpaduan sawah bertingkat, hutan hujan, air terjun, dan budaya Sasak yang masih lestari.',
      contentEn: 'Tetebatu offers terraced rice fields, rainforest, waterfalls, and living Sasak culture.',
      coverImage: images.hero.url,
      type: 'GUIDE',
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date(),
      images: {
        create: [
          articleImageRecord(images.hero, 0),
          articleImageRecord(images.waterfall, 1),
          articleImageRecord(images.coffee, 2),
        ],
      },
    },
  });
  console.log(`✅ Article "${article.title}" with bucket images seeded`);

  const homepageSections = [
    {
      key: 'hero',
      title: 'Selamat Datang di Desa Tetebatu',
      titleEn: 'Welcome to Tetebatu Village',
      subtitle: 'Gerbang Menuju Keindahan Alam Lombok',
      subtitleEn: "The Gateway to Lombok's Natural Beauty",
      content: { image: images.hero.url, storagePath: images.hero.storagePath, bucket: images.hero.bucket, cta: 'Jelajahi Sekarang', ctaEn: 'Explore Now' },
      sortOrder: 1,
    },
    {
      key: 'featured-services',
      title: 'Layanan Unggulan',
      titleEn: 'Featured Services',
      subtitle: 'Rekomendasi terbaik untuk perjalanan Anda',
      subtitleEn: 'Top recommendations for your journey',
      content: {},
      sortOrder: 2,
    },
  ];

  for (const section of homepageSections) {
    await prisma.homepageSection.create({ data: section });
  }

  const settings = [
    { key: 'site_name', value: { id: 'Wisata Tetebatu', en: 'Tetebatu Tourism' } },
    { key: 'contact_email', value: { email: 'info@tetebatu.id' } },
    { key: 'social_links', value: { instagram: '@tetebatu_tourism', facebook: 'tetebatu.tourism' } },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting });
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
