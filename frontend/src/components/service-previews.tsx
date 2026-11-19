'use client';
import { Picture as Image, LocalLink } from './ui';
import { useState } from 'react';
import type { Locale } from '../types/locale';
import type { ServicePreviewSection } from '../data/preview-content';
import { TravelIcon } from '../icon/travel-icons';
const labels: Record<string, [string, string, string, string]> = {
  'tourist-attractions': [
    'Wisata alam',
    'Attractions',
    'Dekat dengan alam',
    'Explore nature',
  ],
  accommodation: [
    'Penginapan',
    'Stays',
    'Temukan tempat singgah',
    'Find your stay',
  ],
  restaurants: [
    'Kuliner',
    'Restaurants',
    'Cicipi rasa lokal',
    'Taste local food',
  ],
  'coffee-shops': [
    'Kedai kopi',
    'Coffee shops',
    'Nikmati kopi lokal',
    'Enjoy local coffee',
  ],
  'tours-activities': [
    'Tur & aktivitas',
    'Tours & activities',
    'Mulai petualangan',
    'Plan an adventure',
  ],
  'car-drivers': [
    'Mobil & driver',
    'Car & driver',
    'Jelajahi lebih jauh',
    'Explore further',
  ],
  'motorcycle-taxis': [
    'Ojek lokal',
    'Local rides',
    'Berkeliling desa',
    'Get around easily',
  ],
};
export function ServicePreviews({
  sections,
  locale,
  query = "",
}: {
  sections: ServicePreviewSection[];
  locale: Locale;
  query?: string;
}) {
  const [selected, setSelected] = useState<string>();
  const id = locale === 'id';
  const active = sections.find((s) => s.slug === selected);
  const overview = [
    ...(
      sections.find((s) => s.slug === 'tourist-attractions')?.items ?? []
    ).slice(0, 2),
    ...(sections.find((s) => s.slug === 'tours-activities')?.items ?? []).slice(
      0,
      1,
    ),
    ...(sections.find((s) => s.slug === 'coffee-shops')?.items ?? []).slice(
      0,
      1,
    ),
  ];
  if (overview.length < 4)
    overview.push(
      ...(sections.find((s) => s.slug === 'accommodation')?.items ?? []).slice(
        0,
        4 - overview.length,
      ),
    );
  const items = (query ? sections.flatMap(s => s.items) : active ? active.items : overview).filter(item => !query || `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <section id="services" className="travel-wrap mx-auto w-[calc(100%-40px)] max-w-[1280px] min-[601px]:w-[calc(100%-72px)] min-[1101px]:w-[calc(100%-128px)] travel-services relative -mt-11 scroll-mt-24">
      <div
        className="travel-categories grid grid-cols-[repeat(7,minmax(110px,1fr))] overflow-auto rounded-2xl bg-[#f3f1e9] px-2.5 py-4 shadow-[0_15px_35px_#233d2710] min-[801px]:grid-cols-7 min-[801px]:rounded-[22px] min-[801px]:px-3 min-[801px]:py-[26px] [&_button]:relative [&_button]:flex [&_button]:min-h-[88px] [&_button]:flex-col [&_button]:items-center [&_button]:justify-center [&_button]:gap-2 [&_button]:rounded-md [&_button]:px-2.5 [&_button]:py-[5px] [&_button]:text-[#244a33] [&_button]:transition-colors [&_button:hover]:bg-[#e4eadb] [&_button[aria-pressed=true]]:bg-[#e4eadb] [&_button+button]:border-l [&_button+button]:border-[#d9ddd0] [&_svg]:mb-0.5 [&_svg]:size-7 [&_strong]:text-center [&_strong]:text-xs [&_strong]:font-medium [&_strong]:leading-[1.3] [&_small]:text-center [&_small]:text-[10px] [&_small]:leading-[1.3] [&_small]:text-[#637064]"
        role="group"
        aria-label={id ? 'Kategori layanan' : 'Service categories'}
      >
        {sections.map((section) => {
          const iconSlug=section.slug==='car-driver'?'car-drivers':section.slug==='motorcycle-taxi'?'motorcycle-taxis':section.slug;
          const t = labels[iconSlug];
          return (
            <button
              key={section.slug}
              type="button"
              aria-label={section.name}
              aria-pressed={section.slug === selected}
              onClick={() => setSelected(section.slug)}
            >
              <TravelIcon kind={iconSlug} />
              <strong>{t?.[id ? 0 : 1] ?? section.name}</strong>
              <small>{t?.[id ? 2 : 3] ?? ''}</small>
            </button>
          );
        })}
      </div>
      <div className="travel-section-top mt-10 mb-3.5 flex items-center justify-between gap-5 max-[600px]:mt-[30px] max-[600px]:items-start max-[600px]:gap-3 [&>a]:flex [&>a]:min-h-10 [&>a]:items-center [&>a]:text-xs max-[600px]:[&>a]:min-h-5 max-[600px]:[&>a]:text-[10px] max-[600px]:[&>a]:whitespace-nowrap">
        <p className="travel-eyebrow flex items-center gap-5 text-[11px] font-semibold leading-[1.4] tracking-[.09em] text-[#244f36] [&>span]:h-px [&>span]:max-w-20 [&>span]:flex-1 [&>span]:bg-[#bdcbbb] max-[600px]:gap-2.5 max-[600px]:text-[9px] max-[600px]:[&>span]:max-w-[25px]">
          {id ? 'PILIH PENGALAMANMU' : 'FIND YOUR EXPERIENCE'}
          <span />
        </p>
        <LocalLink
          href={
            active
              ? '/' + locale + '/categories/' + active.slug
              : '/' + locale + '/explore'
          }
        >
          {id ? 'Lihat semua pilihan' : 'View all experiences'} →
        </LocalLink>
      </div>
      <div className="travel-experiences grid grid-cols-1 gap-[25px] min-[801px]:grid-cols-[230px_minmax(0,1fr)] min-[801px]:gap-7 min-[1101px]:grid-cols-[270px_minmax(0,1fr)] min-[1101px]:gap-11">
        <div className="travel-section-intro [&_h2]:text-[35px] [&_h2]:leading-[1.05] [&_h2]:text-balance min-[601px]:[&_h2]:text-[32px] min-[1101px]:[&_h2]:text-[38px] [&>p:not(:first-child)]:mt-[18px] [&>p:not(:first-child)]:max-w-[460px] [&>p:not(:first-child)]:text-[13px] [&>p:not(:first-child)]:text-[#5f695e] [&>p:first-child]:mb-[18px] [&>h2+p]:mt-[18px] [&>h2+p]:text-[13px] [&>h2+p]:text-[#5f695e]">
          <h2>
            {active
              ? active.name
              : id
                ? 'Rasakan sisi terbaik Tetebatu.'
                : 'Experience the best of Tetebatu.'}
          </h2>
          <p>
            {id
              ? 'Perjalanan kecil, cerita yang tinggal lebih lama.'
              : 'Little journeys. Memories that stay with you.'}
          </p>
          {active ? (
            <button
              className="travel-reset mt-[22px] bg-transparent py-2.5 text-xs text-[#285638] underline underline-offset-4"
              onClick={() => setSelected(undefined)}
            >
              {id ? '← Semua pengalaman' : '← All experiences'}
            </button>
          ) : null}
        </div>
        <div
          className={
            'travel-experience-grid grid grid-cols-2 gap-[15px] min-[601px]:grid-cols-4 min-[601px]:gap-4 ' + (items.length === 2 ? 'two-items min-[601px]:grid-cols-2! min-[601px]:[&_a[aria-hidden]]:aspect-[2.2]' : '')
          }
          aria-live="polite"
        >
          {items.map((item, index) => (
            <article
              className="preview-card  travel-experience-card group relative overflow-hidden rounded-[14px] bg-[#f1efe8] transition-transform duration-200 hover:-translate-y-[3px]"
              key={item.href + index}
            >
              <LocalLink
                className="travel-card-photo relative flex aspect-[1.05] items-center justify-center overflow-hidden bg-[#e4e8da] min-[601px]:aspect-[1.15] [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 group-hover:[&_img]:scale-[1.04] [&>span]:absolute [&>span]:bottom-2.5 [&>span]:left-2.5 [&>span]:rounded-full [&>span]:bg-[#f4f7e8] [&>span]:px-[9px] [&>span]:py-[3px] [&>span]:text-[9px] [&>span]:text-[#274830]"
                href={item.href}
                tabIndex={-1}
                aria-hidden="true"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width:600px) 85vw, (max-width:1000px) 40vw, 20vw"
                    className="object-cover"
                    unoptimized={!item.sample && !item.illustrative}
                  />
                ) : (
                  <TravelIcon kind={active?.slug ?? 'tourist-attractions'} />
                )}
                <span>
                  {item.illustrative
                    ? id
                      ? 'Ilustrasi'
                      : 'Illustration'
                    : item.sample
                      ? id
                        ? 'Inspirasi'
                        : 'Inspiration'
                      : id
                        ? 'Layanan lokal'
                        : 'Local service'}
                </span>
              </LocalLink>
              <div className="travel-card-copy relative px-3 py-[13px] pb-[39px] min-[601px]:px-[13px] min-[601px]:pt-3.5 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:leading-[1.4] min-[1101px]:[&_h3]:text-[13px] [&_p]:mt-[9px] [&_p]:line-clamp-2 [&_p]:text-[10px] min-[601px]:[&_p]:text-[11px] [&_p]:leading-[1.6] [&_p]:text-[#697064]">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <LocalLink
                  href={item.href}
                  className="travel-card-link absolute right-[11px] bottom-2 flex size-[34px] items-center justify-center rounded-full border border-[#d8ddce] bg-[#fcfbf7] text-lg after:absolute after:-inset-1.5"
                  aria-label={
                    (id ? 'Selengkapnya: ' : 'View details: ') + item.name
                  }
                >
                  <span aria-hidden="true">→</span>
                </LocalLink>
              </div>
            </article>
          ))}
          {!items.length ? (
            <p>
              {id
                ? 'Informasi layanan sedang disiapkan.'
                : 'Service information is being prepared.'}
            </p>
          ) : null}
        </div>
      </div>
      {items.some((i) => i.sample) ? (
        <p className="travel-disclosure mt-[15px] text-left text-[9px] leading-[1.5] text-[#70796b] min-[601px]:text-right min-[601px]:text-[10px]">
          {id
            ? 'Inspirasi perjalanan · Ilustrasi dan contoh aktivitas, bukan penyedia terdaftar.'
            : 'Travel inspiration · Illustrations and example activities, not registered providers.'}
        </p>
      ) : null}
    </section>
  );
}
