import { Picture as Image, LocalLink as Link } from '../components/ui';
import type { Locale } from '../types/locale';
import { useApi } from '../services/public';
import type { HomeData } from '../services/public';
import { useNavigate } from 'react-router-dom';
import { State } from './public-pages';
import { ServicePreviews } from '../components/service-previews';
import { TravelIcon } from '../icon/travel-icons';
export function HomePage({ locale }: { locale: Locale }) {
  const id = locale === 'id';
  const navigate=useNavigate();
  const response=useApi<HomeData>('/v1/homepage');
  const query=''; const category='';
  const categories = (response.data?.categories||[]).map(c => ({slug:c.slug,name:!id?c.nameEn||c.name:c.name,services:c.services||[]}));
  const sections = categories.filter(c => !category || c.slug === category).map(c => ({...c,items:c.services.map(s=>({name:s.name,description:(!id?s.shortDescriptionEn||s.descriptionEn:s.shortDescription||s.description)||'',image:s.images?.[0]?.url,href:'/services/'+s.slug,sample:false}))}));
  const hero=response.data?.sections.find(s=>s.key==='hero');
  const content={title:hero?(!id?hero.titleEn||hero.title:hero.title):undefined,body:hero?(!id?hero.subtitleEn||hero.subtitle:hero.subtitle):undefined};
  const places = [
    {
      slug: 'accommodation',
      image: '/images/generated/stay-v2.png',
      name: id ? 'Penginapan' : 'Accommodations',
    },
    {
      slug: 'restaurants',
      image: '/images/preview/food.webp',
      name: id ? 'Restoran' : 'Restaurants',
    },
    {
      slug: 'coffee-shops',
      image: '/images/generated/coffee-v2.png',
      name: id ? 'Kedai kopi' : 'Coffee shops',
    },
    {
      slug: 'car-driver',
      image: '/images/generated/transport-v2.png',
      name: id ? 'Transportasi' : 'Transportation',
    },
  ].filter((p) => categories.some((c) => c.slug === p.slug));
  return (
    <div className="travel-home bg-[#faf8f3] text-[#17281d] font-['Libre_Franklin'] text-sm leading-[1.6] [&_h1]:font-['Source_Serif_4'] [&_h2]:font-['Source_Serif_4'] [&_h1]:font-medium [&_h2]:font-medium [&_h1]:tracking-[-.045em] [&_h2]:tracking-[-.045em] [&_button]:cursor-pointer **:focus-visible:outline-2 [&_:focus-visible]:outline-[#315c3e] [&_:focus-visible]:outline-offset-4 motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:animate-none">
      <div className="public-page-content ">
        <section className="travel-hero relative isolate flex min-h-162.5 items-start text-white min-[601px]:h-162.5 min-[601px]:min-h-142.5 min-[601px]:items-center min-[1101px]:h-[min(730px,86vh)] min-[1101px]:min-h-152.5 min-[1500px]:h-185">
          <Image
            src="/images/generated/tetebatu-hero-v2.png"
            alt={
              id
                ? 'Ilustrasi lanskap sawah dan pegunungan terinspirasi Lombok'
                : 'Illustrated rice fields and mountain landscape inspired by Lombok'
            }
            fill
            priority
            sizes="100vw"
            className="travel-hero-photo -z-3 object-cover object-[58%_center] min-[601px]:object-[center_52%]"
          />
          <div className="travel-hero-shade absolute inset-0 -z-2 bg-[linear-gradient(90deg,#0b251c73,transparent_78%),linear-gradient(0deg,#12291c20,transparent_60%)] max-[600px]:bg-[linear-gradient(90deg,#102a1cc4,#102a1c22),linear-gradient(0deg,#122b1b55,transparent)]" />
          <div className="travel-wrap mx-auto w-[calc(100%-40px)] max-w-7xl min-[601px]:w-[calc(100%-72px)] min-[1101px]:w-[calc(100%-128px)] travel-hero-content pt-8 pb-24 min-[601px]:pb-16.25 [&_h1]:max-w-205 [&_h1]:text-[clamp(45px,11.5vw,65px)] [&_h1]:leading-[1.02] [&_h1]:text-balance min-[601px]:[&_h1]:text-[72px] min-[1101px]:[&_h1]:text-[clamp(56px,6.3vw,90px)] min-[601px]:[&_h1]:leading-[.98]">
            <p className="travel-hero-kicker mb-4.5 text-[10px] tracking-[.18em] text-[#d8e7cf]">
              {id ? 'LOMBOK TIMUR, INDONESIA' : 'EAST LOMBOK, INDONESIA'}
            </p>
            <h1>
              {content?.title ??
                (id ? (
                  <>
                    Temukan jalanmu
                    <br />
                    ke Tetebatu.
                  </>
                ) : (
                  <>
                    Find your way
                    <br />
                    to Tetebatu.
                  </>
                ))}
            </h1>
            <p className="travel-hero-lead mt-5 max-w-85 text-sm leading-[1.6] text-[#f2f4eb] min-[601px]:mt-6.25 min-[601px]:max-w-135 min-[601px]:text-lg min-[601px]:leading-[1.55]">
              {content?.body ??
                (id
                  ? 'Kenali sisi lain Lombok lewat alam, kehidupan desa, dan pengalaman bersama warga lokal.'
                  : 'Discover the hidden beauty of Lombok through nature, culture, and local experiences.')}
            </p>
            <form
              onSubmit={event => { event.preventDefault(); const data=new FormData(event.currentTarget); const params=new URLSearchParams(); if(data.get('q'))params.set('q',String(data.get('q')));if(data.get('category'))params.set('category',String(data.get('category')));navigate('/explore?'+params.toString()); }}
              className="travel-search mt-7 flex max-w-252.5 flex-wrap items-center gap-2.5 rounded-[18px] bg-[#fbfaf6] p-3 text-[#1d2b23] shadow-[0_6px_30px_#0b251c17] min-[601px]:mt-8.5 min-[601px]:flex-nowrap min-[601px]:gap-0 min-[601px]:rounded-full min-[601px]:p-2 [&_label]:flex [&_label]:min-w-0 [&_label]:items-center [&_label]:gap-3.5 [&_svg]:w-[19px] [&_svg]:shrink-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-xs [&_select]:w-full [&_select]:min-w-0 [&_select]:border-0 [&_select]:bg-transparent [&_select]:text-xs [&>button]:min-h-[47px] [&>button]:flex-[1_1_30%] min-[601px]:[&>button]:min-w-[130px] min-[601px]:[&>button]:flex-none"
              role="search"
            >
              <label className="travel-search-keyword h-11 flex-[1_1_100%] border-b border-[#d9ded1] px-2 min-[601px]:h-8 min-[601px]:flex-1 min-[601px]:border-b-0 min-[601px]:px-5.5">
                <TravelIcon kind="search" />
                <span className="sr-only">
                  {id
                    ? 'Cari tempat atau layanan'
                    : 'Search places or services'}
                </span>
                <input
                  name="q"
                  type="search"
                  maxLength={120}
                  placeholder={
                    id
                      ? 'Apa yang ingin kamu temukan?'
                      : 'What are you looking for?'
                  }
                />
              </label>
              <label className="travel-search-category h-8 flex-[1_1_55%] px-2 min-[601px]:flex-1 min-[601px]:border-l min-[601px]:border-[#cfd3c9] min-[601px]:px-5.5">
                <TravelIcon kind="grid" />
                <span className="sr-only">{id ? 'Kategori' : 'Category'}</span>
                <select name="category" defaultValue="">
                  <option value="">
                    {id ? 'Semua kategori' : 'All categories'}
                  </option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="travel-button inline-flex min-h-11 items-center justify-center gap-4.5 rounded-full border-0 bg-[#244f36] px-5.75 py-3 text-[13px] font-medium leading-[1.2] whitespace-nowrap text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#173c26] active:translate-y-0"
                aria-label={id ? 'Cari layanan' : 'Search services'}
              >
                {id ? 'Cari' : 'Search'}
                <span>→</span>
              </button>
            </form>
          </div>
        </section>
        {(response.loading||response.error)&&<State {...response}/>}
        <ServicePreviews key={category} sections={sections} locale={locale} query={query} />
        <section id="about" className="travel-wrap mx-auto w-[calc(100%-40px)] max-w-7xl min-[601px]:w-[calc(100%-72px)] min-[1101px]:w-[calc(100%-128px)] travel-village relative isolate mt-8.5 flex min-h-87.5 items-center overflow-hidden rounded-2xl text-white min-[601px]:mt-12 min-[601px]:min-h-77.5 min-[601px]:rounded-[20px] [&>img]:-z-3 [&>img]:object-cover [&>img]:object-[65%_center] min-[601px]:[&>img]:object-[center_48%]">
          <Image
            src="/images/generated/village-v2.png"
            alt={
              id
                ? 'Ilustrasi petani di antara sawah hijau'
                : 'Illustration of a farmer among green rice fields'
            }
            fill
            sizes="(max-width:700px) 100vw, 90vw"
          />
          <div className="travel-village-shade absolute inset-0 -z-2 bg-[linear-gradient(90deg,#173622e8,#17362255)] min-[601px]:bg-[linear-gradient(90deg,#173622e8_0%,#173622ad_28%,transparent_75%)]" />
          <div className="travel-village-copy max-w-[560px] px-[25px] py-[30px] min-[601px]:p-9 min-[801px]:px-[50px] min-[801px]:py-10 [&>p:first-child]:mb-4 [&>p:first-child]:text-[#edf3e5] [&_h2]:text-[32px] min-[601px]:[&_h2]:text-[38px] [&_h2]:leading-[1.05] [&>h2+p]:mt-[15px] [&>h2+p]:mb-[22px] [&>h2+p]:max-w-[380px] [&>h2+p]:text-sm [&>h2+p]:leading-[1.5]">
            <p className="travel-eyebrow flex items-center gap-5 text-[11px] font-semibold leading-[1.4] tracking-[.09em] text-[#244f36] [&>span]:h-px [&>span]:max-w-20 [&>span]:flex-1 [&>span]:bg-[#bdcbbb] max-[600px]:gap-2.5 max-[600px]:text-[9px] max-[600px]:[&>span]:max-w-[25px]">
              {id ? 'TENTANG TETEBATU' : 'ABOUT TETEBATU'}
            </p>
            <h2>
              {id ? (
                <>
                  Desa yang tenang.
                  <br />
                  Cerita yang hangat.
                </>
              ) : (
                <>
                  A peaceful village
                  <br />
                  in the heart of Lombok.
                </>
              )}
            </h2>
            <p>
              {id
                ? 'Hamparan sawah, air terjun, dan keramahan warga menanti perjalananmu.'
                : 'Rice fields, waterfalls, and warm local hospitality await you in Tetebatu.'}
            </p>
            <Link
              href={'/' + locale + '/about-tetebatu'}
              className="travel-button inline-flex min-h-11 items-center justify-center gap-[18px] rounded-full border-0 bg-[#244f36] px-[23px] py-3 text-[13px] font-medium leading-[1.2] whitespace-nowrap text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#173c26] active:translate-y-0 light bg-[#faf8ef]! text-[#244a33]! hover:bg-[#e8ecdf]!"
            >
              {id ? 'Kenali Tetebatu' : 'Learn more'} →
            </Link>
          </div>
        </section>
        <section className="travel-wrap mx-auto w-[calc(100%-40px)] max-w-[1280px] min-[601px]:w-[calc(100%-72px)] min-[1101px]:w-[calc(100%-128px)] travel-discover mt-10 mb-9 grid grid-cols-1 items-center gap-7 min-[601px]:mt-[62px] min-[601px]:mb-[60px] min-[801px]:grid-cols-[260px_minmax(0,1fr)] min-[801px]:gap-[30px] min-[1101px]:grid-cols-[320px_minmax(0,1fr)] min-[1101px]:gap-[52px] [&>div:first-child>a]:mt-[26px]">
          <div className="travel-section-intro [&_h2]:text-[35px] [&_h2]:leading-[1.05] [&_h2]:text-balance min-[601px]:[&_h2]:text-[32px] min-[1101px]:[&_h2]:text-[38px] [&>p:not(:first-child)]:mt-[18px] [&>p:not(:first-child)]:max-w-[460px] [&>p:not(:first-child)]:text-[13px] [&>p:not(:first-child)]:text-[#5f695e] [&>p:first-child]:mb-[18px] [&>h2+p]:mt-[18px] [&>h2+p]:text-[13px] [&>h2+p]:text-[#5f695e]">
            <p className="travel-eyebrow flex items-center gap-5 text-[11px] font-semibold leading-[1.4] tracking-[.09em] text-[#244f36] [&>span]:h-px [&>span]:max-w-20 [&>span]:flex-1 [&>span]:bg-[#bdcbbb] max-[600px]:gap-2.5 max-[600px]:text-[9px] max-[600px]:[&>span]:max-w-[25px]">
              {id ? 'TEMUKAN TEMPAT LOKAL' : 'DISCOVER LOCAL PLACES'}
              <span />
            </p>
            <h2>
              {id ? (
                <>
                  Semua kebutuhan
                  <br />
                  perjalananmu.
                </>
              ) : (
                <>
                  Find everything
                  <br />
                  you need in Tetebatu.
                </>
              )}
            </h2>
            <p>
              {id
                ? 'Dari tempat singgah yang nyaman sampai rasa lokal yang ingin kamu coba.'
                : 'From cozy stays to delicious food, explore our directory of local services.'}
            </p>
            <Link href={'/' + locale + '/explore'} className="travel-button inline-flex min-h-11 items-center justify-center gap-[18px] rounded-full border-0 bg-[#244f36] px-[23px] py-3 text-[13px] font-medium leading-[1.2] whitespace-nowrap text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#173c26] active:translate-y-0">
              {id ? 'Jelajahi direktori' : 'Explore directory'} →
            </Link>
          </div>
          <div className="travel-place-grid grid grid-cols-2 gap-3.5 min-[601px]:grid-cols-4">
            {places.map((p) => (
              <Link
                className="travel-place-card group relative isolate aspect-square overflow-hidden rounded-[14px] min-[601px]:aspect-[.9] min-[801px]:aspect-[.8] [&>img]:-z-2 [&>img]:object-cover [&>img]:transition-transform [&>img]:duration-300 hover:[&>img]:scale-[1.04] after:absolute after:inset-x-0 after:top-[35%] after:bottom-0 after:-z-1 after:bg-linear-to-b after:from-transparent after:to-[#102217cf] [&>span]:absolute [&>span]:right-2.5 [&>span]:bottom-[18px] [&>span]:left-[15px] [&>span]:flex [&>span]:items-center [&>span]:gap-[9px] [&>span]:text-xs [&>span]:text-white [&_svg]:size-5 [&_svg]:shrink-0"
                key={p.slug}
                href={'/' + locale + '/categories/' + p.slug}
              >
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(max-width:600px) 44vw, 18vw"
                />
                <span>
                  <TravelIcon kind={p.slug} />
                  {p.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
        {!!response.data?.latestArticles.length&&<section className="travel-wrap mx-auto w-[calc(100%-40px)] max-w-[1280px] min-[601px]:w-[calc(100%-72px)] min-[1101px]:w-[calc(100%-128px)] my-10"><div className="flex items-center justify-between mb-5"><h2 className="text-[32px]">{id?'Artikel & panduan wisata':'Stories & travel guides'}</h2><Link href="/articles" className="text-xs underline">{id?'Semua artikel':'All articles'}</Link></div><div className="grid gap-4 sm:grid-cols-3">{response.data.latestArticles.map(a=><Link key={a.id} href={'/articles/'+a.slug} className="overflow-hidden rounded-[14px] bg-[#f1efe8] transition-transform hover:-translate-y-0.5">{a.coverImage&&<img src={a.coverImage} alt="" className="w-full h-40 object-cover" loading="lazy"/>}<div className="p-4"><h3 className="text-sm font-semibold">{id?a.title:a.titleEn||a.title}</h3><p className="mt-2 text-xs text-[#697064]">{id?a.excerpt:a.excerptEn||a.excerpt}</p></div></Link>)}</div></section>}
        <section id="plan" className="travel-wrap mx-auto w-[calc(100%-40px)] max-w-[1280px] min-[601px]:w-[calc(100%-72px)] min-[1101px]:w-[calc(100%-128px)] travel-trip relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-[#244a32] px-6 py-[27px] text-white min-[601px]:flex-row min-[601px]:items-center min-[601px]:gap-[30px] min-[601px]:rounded-[20px] min-[801px]:px-[52px] [&_h2]:text-[27px] [&_h2]:leading-[1.25] [&_h2]:tracking-[-.02em] [&_p]:mt-[5px] [&_p]:text-xs [&_p]:text-[#e7ecdd] before:pointer-events-none before:absolute before:-top-[35px] before:-left-[45px] before:size-[170px] before:rounded-full before:border-[24px] before:border-double before:border-[#68816730]">
          <div>
            <h2>
              {id
                ? 'Rencanakan perjalanan ke Tetebatu'
                : 'Plan your trip to Tetebatu'}
            </h2>
            <p>
              {id
                ? 'Pilih pengalamanmu, lalu terhubung langsung dengan penyedia lokal.'
                : 'Choose your experience, then connect directly with local providers.'}
            </p>
          </div>
          <Link
            href={'/' + locale + '/explore'}
            className="travel-button inline-flex min-h-11 items-center justify-center gap-[18px] rounded-full border-0 bg-[#244f36] px-[23px] py-3 text-[13px] font-medium leading-[1.2] whitespace-nowrap text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#173c26] active:translate-y-0 light bg-[#faf8ef]! text-[#244a33]! hover:bg-[#e8ecdf]!"
          >
            {id ? 'Mulai menjelajah' : 'Start exploring'} →
          </Link>
        </section>
      </div>
    </div>
  );
}
