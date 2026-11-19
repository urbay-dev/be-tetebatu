import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi, priceText } from '../services/public';
import type { Category, PageData } from '../services/public';
import type { Service } from '../services/service.service';
import type { Stay } from '../data/stays';
import api from '../services/api';
import { State } from './public-pages';
import type { Locale } from '../types/locale';
import { StayCard, primaryButton } from '../components/stay-card';
import { BookingSummary } from '../components/booking-summary';
import { ExploreIcon } from '../icon/explore-icon';
import { TravelIcon } from '../icon/travel-icons';

const wrap = 'mx-auto w-[calc(100%-40px)] max-w-[1376px] sm:w-[calc(100%-72px)] xl:w-[calc(100%-112px)]';
export function ExplorePage({ locale }: { locale: Locale }) {
  const id = locale === 'id';
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') ?? '');
  const [search, setSearch] = useState(query);
  const [area, setArea] = useState('');
  const [params,setParams]=useSearchParams();
  const type=params.get('category')||'All';
  const setType=(value:string)=>{setPage(1);setParams(value==='All'?{}:{category:value})};
  const categories=useApi<Category[]>('/v1/categories');
  const areas=useApi<{id:string;name:string}[]>('/v1/areas');
  const [page,setPage]=useState(1),[data,setData]=useState<PageData<Service>>(),[loading,setLoading]=useState(true),[error,setError]=useState(false),[attempt,setAttempt]=useState(0); 
  const [sort, setSort] = useState('recommended');
  const [savedOnly, setSavedOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('tetebatu-favorites') ?? '[]'); } catch { return []; } });
  const [selectedId,setSelectedId]=useState('');
  const selectedCategory=categories.data?.find(c=>c.slug===type);
  const stays:Stay[]=(data?.data||[]).map(s=>({id:s.id,name:s.name,type:s.category?.slug,area:s.area?.name||s.address||(id?'Lokasi belum diisi':'Location not provided'),image:s.images?.[0]?.url||'',price:s.prices?.[0]?.minPrice!=null?Number(s.prices[0].minPrice):NaN,rating:0,reviews:0,amenities:[],badge:s.isRecommended?'choice':undefined,source:s,priceLabel:s.prices?.[0]?priceText(s.prices[0],!id):(id?'Tanyakan harga':'Ask for price')}));
  const selected=stays.find(s=>s.id===selectedId)||stays[0];
  const setSelected=(stay:Stay)=>setSelectedId(stay.id);
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [guests, setGuests] = useState('2');
  const [today] = useState(() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; });
  useEffect(()=>{const c=new AbortController();setLoading(true);setError(false);const q=new URLSearchParams({page:String(page),limit:'12',search,sort:sort==='name'?'name':'isRecommended',order:sort==='name'?'asc':'desc'});if(type!=='All')q.set('category',type);if(area)q.set('area',area);api.get('/v1/services?'+q,{signal:c.signal}).then(r=>setData(r.data)).catch(()=>{if(!c.signal.aborted)setError(true)}).finally(()=>{if(!c.signal.aborted)setLoading(false)});return()=>c.abort()},[search,type,area,sort,page,attempt]);
  const invalid = Boolean(arrival && departure && departure <= arrival);
  const results = stays.filter(stay=>!savedOnly||favorites.includes(stay.id));
  function toggleFavorite(key: string) { const next = favorites.includes(key) ? favorites.filter(x => x !== key) : [...favorites, key]; setFavorites(next); try { localStorage.setItem('tetebatu-favorites', JSON.stringify(next)); } catch { /* Saving remains available for this session. */ } }
  return <div className="pb-8">
    <section className="relative isolate min-h-67 overflow-hidden pb-14 pt-8 text-white sm:pt-7">
      <img src="/images/generated/tetebatu-hero-v2.png" alt={id ? 'Ilustrasi lanskap Tetebatu' : 'Illustrated Tetebatu landscape'} fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover object-[center_52%]" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#153a25eb] via-[#16352255] to-transparent" />
      <div className={wrap}>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 py-1 pl-2 pr-3 text-xs backdrop-blur-sm"><ExploreIcon name="home" />{selectedCategory?(id?selectedCategory.name:selectedCategory.nameEn||selectedCategory.name):(id?'Layanan wisata':'Tourism services')}</span>
        <h1 className="mt-2 text-[44px] leading-[.98] sm:text-[58px]">{id ? 'Temukan tempatmu' : 'Find your experience'}<br />{id ? 'di Tetebatu' : 'in Tetebatu'}</h1>
        <p className="mt-3 max-w-xl text-xs text-white/90 sm:text-sm">{id ? 'Temukan layanan wisata dan hubungi penyedia lokal secara langsung.' : 'Discover tourism services and connect directly with local providers.'}</p>
      </div>
    </section>
    <div className={wrap}>
      <form role="search" aria-label={id ? 'Cari layanan' : 'Search services'} onSubmit={e => { e.preventDefault(); setSearch(query); setPage(1); }} className="relative z-10 -mt-7 grid grid-cols-2 items-center gap-3 rounded-[20px] bg-[#fffdfa] p-4 shadow-[0_6px_25px_#21331b12] sm:grid-cols-2 lg:grid-cols-[minmax(160px,1fr)_150px_130px_130px_120px_110px] lg:gap-0 lg:p-2.5 [&_input]:min-w-0 [&_input]:w-full [&_input]:bg-transparent [&_input]:text-xs [&_select]:min-w-0 [&_select]:w-full [&_select]:bg-transparent [&_select]:text-xs">
        <label className="flex min-h-11 items-center gap-3 px-3 col-span-2 lg:col-span-1"><TravelIcon kind="search" /><span className="sr-only">{id ? 'Cari layanan' : 'Search services'}</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={id ? 'Cari tempat atau layanan…' : 'Search places or services…'} /></label>
        <label className="col-span-2 flex min-h-11 items-center gap-2 border-[#e5e3dc] px-3 lg:col-span-1 lg:border-l"><ExploreIcon name="home" /><span className="sr-only">{id ? 'Lokasi' : 'Location'}</span><select value={area} onChange={e => {setArea(e.target.value); setPage(1)}}><option value="">{id ? 'Semua lokasi' : 'All locations'}</option>{areas.data?.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
        <label className="block border-[#e5e3dc] px-3 text-[10px] text-[#71756a] lg:border-l">Check-in<input aria-label="Check-in" type="date" min={today} value={arrival} onChange={e => setArrival(e.target.value)} className="block min-h-8 text-[#253b29]" /></label>
        <label className="block border-[#e5e3dc] px-3 text-[10px] text-[#71756a] lg:border-l">Check-out<input aria-label="Check-out" type="date" min={arrival || today} value={departure} onChange={e => setDeparture(e.target.value)} aria-invalid={invalid} aria-describedby={invalid ? 'date-error' : undefined} className="block min-h-8 text-[#253b29]" /></label>
        <label className="flex min-h-11 items-center gap-2 border-[#e5e3dc] px-3 lg:border-l"><ExploreIcon name="people" /><span className="sr-only">{id ? 'Tamu' : 'Guests'}</span><select value={guests} onChange={e => setGuests(e.target.value)}>{[1, 2, 3, 4, 5, 6].map(n => <option value={n} key={n}>{n} {id ? 'tamu' : 'guests'}</option>)}</select></label>
        <button type="submit" className={primaryButton}>{id ? 'Cari' : 'Search'} <ExploreIcon name="arrow" /></button>
      </form>
      {invalid && <p id="date-error" role="alert" className="mt-3 text-xs text-red-700">{id ? 'Check-out harus setelah tanggal check-in.' : 'Check-out must be after check-in.'}</p>}
      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_270px] xl:gap-10">
        <section aria-label={id ? 'Daftar layanan' : 'Service listings'}>
          {(loading||error)&&<State loading={loading} error={error} retry={()=>setAttempt(n=>n+1)} en={!id}/>}<h2 className="sr-only">{id ? 'Daftar layanan' : 'Service listings'}</h2>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label={id ? 'Kategori layanan' : 'Service category'}>{['All',...(categories.data||[]).map(c=>c.slug)].map(value => <button type="button" key={value} aria-pressed={type === value} onClick={() => setType(value)} className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[11px] transition hover:border-[#789375] ${type === value ? 'border-[#294f37] bg-[#294f37] text-white' : 'border-[#e2dfd7] bg-[#fffdf9] text-[#343d32]'}`}>{value !== 'All' && <ExploreIcon name="home" className="size-3.5" />}{value === 'All' ? (id ? 'Semua' : 'All') : (()=>{const c=categories.data?.find(c=>c.slug===value);return id?c?.name:c?.nameEn||c?.name})()}</button>)}</div>
            <label className="flex items-center gap-2 text-[11px]">{id ? 'Urutkan:' : 'Sort by:'}<select aria-label={id ? 'Urutkan' : 'Sort by'} value={sort} onChange={e => setSort(e.target.value)} className="min-h-10 max-w-37.5 rounded-full border border-[#e2dfd7] bg-transparent px-3"><option value="recommended">{id ? 'Rekomendasi' : 'Recommended'}</option><option value="name">{id?'Nama A–Z':'Name A–Z'}</option></select></label>
          </div>
          <div hidden={loading||error} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{results.map(stay => <StayCard key={stay.id} stay={stay} locale={locale} favorite={favorites.includes(stay.id)} selected={selected?.id === stay.id} onFavorite={() => toggleFavorite(stay.id)} onSelect={() => { setSelected(stay); if (matchMedia('(max-width:1023px)').matches) document.getElementById('booking')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' }); }} />)}</div>
          {!loading&&!error&&results.length === 0 && <div className="rounded-2xl border border-dashed border-[#cbd5c4] p-10 text-center"><h2 className="text-2xl">{id ? 'Belum ada yang cocok' : 'No matching stays'}</h2><p className="mt-2 text-sm text-[#6e7666]">{id ? 'Coba kata kunci atau filter lain.' : 'Try a different search or filter.'}</p><button className={`${primaryButton} mt-5`} onClick={() => { setQuery(''); setSearch(''); setArea(''); setType('All'); setSavedOnly(false); }}>{id ? 'Reset pencarian' : 'Reset search'}</button></div>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px]"><p role="status" aria-live="polite">{id ? `Menampilkan ${results.length} dari ${data?.meta.total||0} layanan` : `Showing ${results.length} of ${data?.meta.total||0} services`}</p><button aria-pressed={savedOnly} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 transition hover:bg-[#e7eddf] ${savedOnly ? 'border-[#31573c] bg-[#e7eddf]' : 'border-[#dfdfd4]'}`} onClick={() => setSavedOnly(!savedOnly)}><ExploreIcon name="heart" className="size-4" />{id ? 'Favorit' : 'Saved'} ({favorites.length})</button></div>
          <p className="mt-3 text-[10px] text-[#65695f]">{id ? 'Tanggal dan jumlah tamu digunakan untuk pertanyaan reservasi. Konfirmasikan ketersediaan dan pembayaran langsung kepada penyedia.' : 'Dates and guest counts are used for your inquiry. Confirm availability and payment directly with the provider.'}</p>
          {!loading&&!error&&(data?.meta.totalPages||0)>1&&<div className="flex items-center justify-center gap-4 mt-6"><button className={primaryButton} disabled={page<=1} onClick={()=>setPage(p=>p-1)}>{id?'Sebelumnya':'Previous'}</button><span>{page} / {data?.meta.totalPages}</span><button className={primaryButton} disabled={page>=data!.meta.totalPages} onClick={()=>setPage(p=>p+1)}>{id?'Berikutnya':'Next'}</button></div>}
        </section>
        <BookingSummary stay={!loading&&!error?selected:undefined} locale={locale} arrival={arrival} departure={departure} guests={guests} />
      </div>
    </div>

  </div>;
}
