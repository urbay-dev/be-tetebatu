import { useEffect } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  Clock,
  Coffee,
  Info,
  MapPin,
  MessageCircle,
  Mountain,
  Navigation,
  Users,
  Utensils,
  Wifi,
} from 'lucide-react';
import { LoadingDots } from '../components/page-loader';
import { useApi, safeUrl, contactHref, priceText } from '../services/public';
import type { Article } from '../services/public';
import type { Service } from '../services/service.service';
import type { Locale } from '../types/locale';

export function State({ loading, error, retry, en = false }: { loading: boolean; error: boolean; retry: () => void; en?: boolean }) {
  if (loading) return <div className="state state--loading"><LoadingDots size="lg" locale={en ? 'en' : 'id'} label={en ? 'Finding the best stays…' : 'Mencari pilihan terbaik…'} /></div>;
  if (error) return <div className="state state--error" role="alert">
    <p>{en ? 'Unable to load information. Please try again.' : 'Informasi belum dapat dimuat. Silakan coba lagi.'}</p>
    <button className="btn secondary" onClick={retry}>{en ? 'Try again' : 'Coba lagi'}</button>
  </div>;
  return null;
}

export function ServiceCards({ items, en }: { items: Service[]; en: boolean }) {
  return items.length ? <div className="service-grid">
    {items.map(s => <Link className="listing" to={`/services/${s.slug}`} key={s.id}>
      <div className="listing-photo">
        {s.images?.[0]?.url ? <img loading="lazy" src={s.images[0].url} alt={s.images[0].alt || s.name} onError={e => { e.currentTarget.style.display = 'none'; }} /> : <Mountain size={42} />}
      </div>
      <div className="listing-body">
        <span className="eyebrow">{en ? s.category?.nameEn || s.category?.name : s.category?.name}</span>
        <h3>{s.name}</h3>
        <p>{en ? s.shortDescriptionEn || s.shortDescription : s.shortDescription}</p>
        <p className="location"><MapPin size={15} />{s.area?.name || s.address || (en ? 'Tetebatu area' : 'Kawasan Tetebatu')}</p>
        <strong>{s.prices?.[0] ? priceText(s.prices[0], en) : (en ? 'Contact for details' : 'Hubungi untuk informasi')}</strong>
      </div>
    </Link>)}
  </div> : <p className="empty">{en ? 'No published services yet. Please check back soon.' : 'Belum ada layanan yang diterbitkan. Silakan kembali lagi nanti.'}</p>;
}

function ArticleCards({ items, en }: { items: Article[]; en: boolean }) {
  return <div className="service-grid">
    {items.map(a => <Link className="listing article-card" key={a.id} to={`/articles/${a.slug}`}>
      {a.coverImage && <img loading="lazy" src={safeUrl(a.coverImage)} alt="" />}
      <div className="listing-body">
        <span className="eyebrow">{a.type}</span>
        <h3>{en ? a.titleEn || a.title : a.title}</h3>
        <p>{en ? a.excerptEn || a.excerpt : a.excerpt}</p>
        <span className="text-link">{en ? 'Read story' : 'Baca artikel'}</span>
      </div>
    </Link>)}
  </div>;
}

function serviceFallback(service: Service) {
  const text = `${service.name} ${service.slug} ${service.category?.slug || ''}`.toLowerCase();
  if (/air terjun|waterfall/.test(text)) return '/images/generated/waterfall-v2.png';
  if (/kopi|coffee/.test(text)) return '/images/generated/coffee-v2.png';
  if (/mobil|driver|transport|motor/.test(text)) return '/images/generated/transport-v2.png';
  if (/homestay|penginapan|stay|villa/.test(text)) return '/images/generated/stay-v2.png';
  if (/desa|village|sasak|tours/.test(text)) return '/images/generated/village-v2.png';
  return '/images/generated/tetebatu-hero-v2.png';
}

function FacilityIcon({ name }: { name: string }) {
  const value = name.toLowerCase();
  if (/wifi/.test(value)) return <Wifi size={20} />;
  if (/parkir|mobil|transport|antar/.test(value)) return <Car size={20} />;
  if (/kopi|tasting|sarapan/.test(value)) return <Coffee size={20} />;
  if (/makan|snack|camilan|food/.test(value)) return <Utensils size={20} />;
  if (/pemandu|driver|guide/.test(value)) return <Users size={20} />;
  return <Check size={20} />;
}

export function ServiceDetail({ locale }: { locale: Locale }) {
  const { slug } = useParams(), en = locale === 'en';
  const r = useApi<Service>('/v1/services/' + encodeURIComponent(slug || ''));
  const related = useApi<Service[]>('/v1/services/recommended');

  if (!r.data) return <State {...r} en={en} />;

  const s = r.data;
  const translate = (item: Record<string, any>, key: string) => en ? item[key + 'En'] || item[key] : item[key];
  const fallback = serviceFallback(s);
  const images = s.images?.length
    ? [...s.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    : [{ id: 'fallback', url: fallback, alt: s.name, isPrimary: true }];
  const heroImage = safeUrl(images[0]?.url) || fallback;
  const contacts = (s.contacts || [])
    .map(c => ({ ...c, href: contactHref(c.type, c.value, s.name, en) }))
    .filter(c => c.href)
    .sort((a, b) => Number(b.type === 'WHATSAPP') - Number(a.type === 'WHATSAPP'));
  const maps = safeUrl(s.googleMapsUrl) || (s.latitude != null && s.longitude != null
    ? `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`
    : s.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}` : undefined);
  const categoryName = translate(s.category || {}, 'name') || (en ? 'Service' : 'Layanan');
  const location = s.area?.name || s.address || (en ? 'Tetebatu area' : 'Kawasan Tetebatu');
  const primaryPrice = s.prices?.[0];
  const relatedServices = (related.data || []).filter(item => item.slug !== s.slug).slice(0, 3);
  const dayNames: Record<string, string> = en
    ? { senin: 'Monday', selasa: 'Tuesday', rabu: 'Wednesday', kamis: 'Thursday', jumat: 'Friday', sabtu: 'Saturday', minggu: 'Sunday' }
    : { senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu', kamis: 'Kamis', jumat: 'Jumat', sabtu: 'Sabtu', minggu: 'Minggu' };
  const hoursEntries = s.openingHours && typeof s.openingHours === 'object' ? Object.entries(s.openingHours) : [];
  const vehicle = [s.vehicleType, s.passengerCapacity && `${s.passengerCapacity} ${en ? 'passengers' : 'penumpang'}`].filter(Boolean).join(' · ');
  const description = translate(s, 'description') || (en ? 'Contact the provider for further information.' : 'Hubungi penyedia untuk informasi lebih lanjut.');

  return <article className="svc-detail">
    <header className="svc-hero">
      <img className="svc-hero-photo" src={heroImage} alt="" fetchPriority="high" />
      <span className="svc-hero-shade" />
      <div className="wrap svc-hero-inner">
        <div className="svc-hero-top">
          <Link className="svc-back" to="/explore"><ArrowLeft size={16} />{en ? 'All services' : 'Semua layanan'}</Link>
          <span className="svc-hero-count">{String(images.length).padStart(2, '0')} {en ? (images.length === 1 ? 'photo' : 'photos') : 'foto'}</span>
        </div>
        <div className="svc-hero-copy">
          <p className="svc-hero-eyebrow"><span>{categoryName}</span><span className="svc-dot" /><span>{location}</span></p>
          <h1>{s.name}</h1>
          {translate(s, 'shortDescription') && <p className="svc-hero-lead">{translate(s, 'shortDescription')}</p>}
          <div className="svc-hero-actions">
            <a className="svc-btn primary" href="#svc-book">{en ? 'Check availability' : 'Cek ketersediaan'}<ArrowRight size={17} /></a>
            {maps && <a className="svc-btn ghost" href={maps} target="_blank" rel="noreferrer"><Navigation size={16} />{en ? 'See location' : 'Lihat lokasi'}</a>}
          </div>
        </div>
      </div>
    </header>

    <div className="wrap svc-body">
      <section className="svc-section svc-intro" aria-labelledby="svc-intro-title">
        <div className="svc-section-label"><span>01</span>{en ? 'The experience' : 'Pengalaman'}</div>
        <div className="svc-intro-grid">
          <h2 id="svc-intro-title">{en ? 'A closer look at' : 'Sekilas tentang'} <em>{s.name}</em></h2>
          <div className="svc-intro-copy">
            <p>{description}</p>
            <div className="svc-facts">
              <div><span>{en ? 'Starting at' : 'Mulai dari'}</span><strong>{primaryPrice ? priceText(primaryPrice, en) : (en ? 'On request' : 'Tanyakan harga')}</strong></div>
              <div><span>{en ? 'Category' : 'Kategori'}</span><strong>{categoryName}</strong></div>
              <div><span>{en ? 'Area' : 'Kawasan'}</span><strong>{location}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section svc-gallery" aria-labelledby="svc-gallery-title">
        <div className="svc-section-label"><span>02</span>{en ? 'In pictures' : 'Dalam foto'}</div>
        <h2 id="svc-gallery-title" className="sr-only">{en ? 'Photos of' : 'Foto'} {s.name}</h2>
        <div className="svc-gallery-grid" data-count={images.length}>
          {images.map((img, i) => <a
            key={img.id}
            className={`svc-shot ${i === 0 ? 'svc-shot--main' : ''}`}
            href={safeUrl(img.url) || fallback}
            target={safeUrl(img.url) ? '_blank' : undefined}
            rel="noreferrer"
            aria-label={`${en ? 'Open photo' : 'Buka foto'} ${i + 1}`}
          >
            <img src={safeUrl(img.url) || fallback} alt={translate(img, 'alt') || s.name} loading={i ? 'lazy' : 'eager'} />
          </a>)}
        </div>
      </section>

      {(!!s.facilities?.length || !!s.features?.length || !!vehicle) && <section className="svc-section svc-details" aria-labelledby="svc-details-title">
        <div className="svc-section-label"><span>03</span>{en ? 'What to expect' : 'Yang Anda dapat'}</div>
        <h2 id="svc-details-title" className="svc-section-title">{en ? 'Details that matter' : 'Rincian yang penting'}</h2>
        {!!s.facilities?.length && <div className="svc-detail-grid">
          {s.facilities.map((f: any, i: number) => <div className="svc-detail-card" key={f.id || i}>
            <span className="svc-icon"><FacilityIcon name={translate(f, 'name') || ''} /></span>
            <h3>{translate(f, 'name')}</h3>
          </div>)}
        </div>}
        {!!s.features?.length && <div className="svc-feature-list">
          {s.features.map((f: any, i: number) => <article className="svc-feature" key={f.id || i}>
            <span className="svc-feature-no">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{translate(f, 'name')}</h3>
              {translate(f, 'description') && <p>{translate(f, 'description')}</p>}
            </div>
          </article>)}
        </div>}
        {vehicle && <div className="svc-vehicle"><Car size={18} /><span>{vehicle}</span></div>}
      </section>}

      {!!s.prices?.length && <section className="svc-section svc-prices" aria-labelledby="svc-prices-title">
        <div className="svc-section-label"><span>04</span>{en ? 'Pricing' : 'Harga'}</div>
        <h2 id="svc-prices-title" className="svc-section-title">{en ? 'Clear price information' : 'Informasi harga yang jelas'}</h2>
        <div className="svc-price-grid">
          {s.prices.map((p: any) => <div className="svc-price-card" key={p.id}>
            <span className="svc-price-label">{translate(p, 'label')}</span>
            <strong>{priceText(p, en)}</strong>
            <span className="svc-price-note">{en ? 'Information only · Pay the provider directly' : 'Informasi saja · Bayar langsung ke penyedia'}</span>
          </div>)}
        </div>
      </section>}

      <section className="svc-section svc-location" aria-labelledby="svc-location-title">
        <div className="svc-section-label"><span>05</span>{en ? 'Location & access' : 'Lokasi & akses'}</div>
        <div className="svc-location-card">
          <div className="svc-location-main">
            <h2 id="svc-location-title">{en ? 'Find your way here' : 'Menuju ke sini'}</h2>
            <p className="svc-location-meta"><MapPin size={18} /><span>{s.address || s.area?.name || (en ? 'Ask the provider for the meeting point.' : 'Tanyakan titik temu kepada penyedia.')}</span></p>
            {translate(s, 'directions') && <p>{translate(s, 'directions')}</p>}
            {maps && <a className="svc-btn ghost" href={maps} target="_blank" rel="noreferrer"><Navigation size={16} />{en ? 'Open Google Maps' : 'Petunjuk arah Google Maps'}</a>}
          </div>
          <div className="svc-location-side">
            <h3><Clock size={15} />{en ? 'Opening hours' : 'Jam operasional'}</h3>
            {hoursEntries.length ? <dl className="svc-hours">
              {hoursEntries.map(([day, hours]) => <div key={day}>
                <dt>{en ? dayNames[day] || day : day}</dt>
                <dd>{String(hours) === 'Tutup' && en ? 'Closed' : String(hours)}</dd>
              </div>)}
            </dl> : <p>{en ? 'Ask the provider for opening hours.' : 'Tanyakan jam operasional kepada penyedia.'}</p>}
          </div>
        </div>
      </section>
    </div>

    <section className="svc-book" id="svc-book" aria-labelledby="svc-book-title">
      <div className="wrap svc-book-inner">
        <div>
          <p className="svc-book-eyebrow">{en ? 'Plan your visit' : 'Rencanakan kunjungan'}</p>
          <h2 id="svc-book-title">{en ? 'Talk directly with the provider.' : 'Bicara langsung dengan penyedia.'}</h2>
          <p>{en ? 'Ask about availability, the final price and what is included. The provider answers your enquiry directly.' : 'Tanyakan ketersediaan, harga akhir, dan yang sudah termasuk. Penyedia akan menjawab pertanyaan Anda langsung.'}</p>
        </div>
        <div className="svc-book-actions">
          {contacts.length ? contacts.map((c, i) => <a
            key={c.id || i}
            className={`svc-btn ${i ? 'ghost' : 'primary'}`}
            href={c.href}
            target={c.href?.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            {c.type === 'WHATSAPP' ? (en ? 'Ask on WhatsApp' : 'Tanya via WhatsApp')
              : c.type === 'PHONE' ? (en ? 'Call provider' : 'Telepon penyedia')
                : c.type === 'EMAIL' ? (en ? 'Send email' : 'Kirim email')
                  : c.label || c.type}
          </a>) : <p>{en ? 'Contact information is not available yet.' : 'Informasi kontak belum tersedia.'}</p>}
          <p className="svc-book-note"><Info size={15} />{en ? 'No online payment is collected here. Availability and payment are agreed directly with the provider.' : 'Tidak ada pembayaran online di sini. Ketersediaan dan pembayaran disepakati langsung dengan penyedia.'}</p>
        </div>
      </div>
    </section>

    {relatedServices.length > 0 && <section className="wrap svc-section svc-related" aria-labelledby="svc-related-title">
      <div className="svc-section-head">
        <div>
          <div className="svc-section-label"><span>06</span>{en ? 'Keep exploring' : 'Lanjut menjelajah'}</div>
          <h2 id="svc-related-title">{en ? 'More in Tetebatu' : 'Lainnya di Tetebatu'}</h2>
        </div>
        <Link className="text-link" to="/explore">{en ? 'See all services' : 'Lihat semua layanan'}<ArrowRight size={15} /></Link>
      </div>
      <ServiceCards items={relatedServices} en={en} />
    </section>}
  </article>;
}

export function Articles({ locale }: { locale: Locale }) {
  const en = locale === 'en', [p, setP] = useSearchParams(), page = p.get('page') || '1', r = useApi<{ items: Article[]; totalPages: number }>('/v1/articles?view=page&page=' + page);
  return <section className="wrap section">
    <span className="eyebrow">Tetebatu journal</span>
    <h1>{en ? 'Stories & travel guides' : 'Cerita & panduan wisata'}</h1>
    {!r.data ? <State {...r} en={en} /> : <>
      <ArticleCards items={r.data.items} en={en} />
      {!r.data.items.length && <p className="empty">{en ? 'No articles published yet.' : 'Belum ada artikel yang diterbitkan.'}</p>}
      {r.data.totalPages > 1 && <div className="pagination">
        <button className="btn secondary" disabled={Number(page) <= 1} onClick={() => setP({ page: String(Number(page) - 1) })}>{en ? 'Previous' : 'Sebelumnya'}</button>
        <span>{page} / {r.data.totalPages}</span>
        <button className="btn secondary" disabled={Number(page) >= r.data.totalPages} onClick={() => setP({ page: String(Number(page) + 1) })}>{en ? 'Next' : 'Berikutnya'}</button>
      </div>}
    </>}
  </section>;
}

export function ArticleDetail({ locale }: { locale: Locale }) {
  const { slug } = useParams(), en = locale === 'en', r = useApi<Article>('/v1/articles/' + encodeURIComponent(slug || ''));
  return <article className="wrap section article-detail">
    <Link className="text-link" to="/articles">{en ? 'All articles' : 'Semua artikel'}</Link>
    {!r.data ? <State {...r} en={en} /> : <>
      <p className="eyebrow">{r.data.type}</p>
      <h1>{en ? r.data.titleEn || r.data.title : r.data.title}</h1>
      <p className="lead">{en ? r.data.excerptEn || r.data.excerpt : r.data.excerpt}</p>
      {r.data.coverImage && <img className="article-cover" src={safeUrl(r.data.coverImage)} alt="" />}
      <div className="prose">{en ? r.data.contentEn || r.data.content : r.data.content}</div>
    </>}
  </article>;
}

export function About({ locale, platform = false }: { locale: Locale; platform?: boolean }) {
  const en = locale === 'en';
  return <section className="wrap section article-detail">
    <span className="eyebrow">{platform ? 'Discover · Find · Connect' : 'Sikur · Lombok Timur · Nusa Tenggara Barat'}</span>
    <h1>{platform ? (en ? 'About this platform' : 'Tentang platform') : (en ? 'Get to know Tetebatu' : 'Mengenal Desa Tetebatu')}</h1>
    {platform ? <>
      <p className="lead">{en ? 'One place to discover Tetebatu and connect with local tourism services.' : 'Satu tempat untuk mengenal Tetebatu dan terhubung dengan layanan wisata lokal.'}</p>
      <h2>{en ? 'How it works' : 'Cara menggunakan website'}</h2>
      <ol className="prose">
        <li>{en ? 'Explore the categories and find a service.' : 'Jelajahi kategori dan temukan layanan.'}</li>
        <li>{en ? 'Read the details, facilities, prices and location.' : 'Baca deskripsi, fasilitas, harga, dan lokasi.'}</li>
        <li>{en ? 'Contact the provider via WhatsApp, phone or email.' : 'Hubungi penyedia melalui WhatsApp, telepon, atau email.'}</li>
      </ol>
      <p className="prose">{en ? 'Visitors do not need an account. Reservations, availability, agreements and payments are handled directly between you and the provider outside this website. The platform does not process payments or charge automatic commissions.' : 'Pengunjung tidak perlu membuat akun. Reservasi, ketersediaan, kesepakatan, dan pembayaran dilakukan langsung antara wisatawan dan penyedia di luar website. Platform tidak memproses pembayaran atau memotong komisi otomatis.'}</p>
    </> : <>
      <p className="lead">{en ? 'Tetebatu is a village in Sikur, East Lombok, West Nusa Tenggara. Discover its natural landscapes and everyday village life through local experiences.' : 'Tetebatu adalah desa di Kecamatan Sikur, Kabupaten Lombok Timur, Nusa Tenggara Barat. Kenali potensi alam dan kehidupan masyarakatnya melalui pengalaman bersama warga lokal.'}</p>
      <h2>{en ? 'Nature & village life' : 'Alam & kehidupan desa'}</h2>
      <p className="prose">{en ? 'Explore rice fields, waterfalls and village walks. Discover local food, cultural experiences and activities offered by local providers.' : 'Jelajahi persawahan, air terjun, dan jalur jalan kaki desa. Temukan kuliner, pengalaman budaya, serta aktivitas yang disediakan masyarakat setempat.'}</p>
      <h2>{en ? 'Before your visit' : 'Sebelum berkunjung'}</h2>
      <p className="prose">{en ? 'Check opening hours, access and weather with your provider. Bring suitable footwear, respect local customs and take your litter home. Confirm the meeting point and what is included before agreeing to a trip.' : 'Tanyakan jam buka, akses, dan kondisi cuaca kepada penyedia. Gunakan alas kaki yang sesuai, hormati kebiasaan setempat, dan bawa kembali sampah Anda. Pastikan titik temu dan fasilitas yang termasuk sebelum menyepakati perjalanan.'}</p>
    </>}
    <Link className="btn" to="/explore">{en ? 'Explore services' : 'Jelajahi layanan'}</Link>
  </section>;
}

export function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
