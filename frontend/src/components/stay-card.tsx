import type { Stay } from '../data/stays';
import { ExploreIcon } from '../icon/explore-icon';
import type { Locale } from '../types/locale';

export const primaryButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#294f37] px-5 text-xs font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#193b26] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50';
export function StayCard({ stay, locale, favorite, selected, onFavorite, onSelect }: { stay: Stay; locale: Locale; favorite: boolean; selected: boolean; onFavorite: () => void; onSelect: () => void }) {
  const id = locale === 'id';
  const amenities: Record<string,string> = { wifi:'Wi-Fi', parking:id?'Parkir':'Parking', coffee:id?'Kopi':'Coffee', pool:id?'Kolam renang':'Pool', food:id?'Restoran':'Restaurant' };
  return <article data-stay={stay.id} className={`group overflow-hidden rounded-2xl border bg-[#fffdf9] shadow-[0_2px_3px_#243d2406] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${selected ? 'border-[#78977c]' : 'border-[#e8e5df]'}`}>
    <div className="relative h-[164px] overflow-hidden sm:h-[150px]">
      {stay.image&&<img src={stay.image} alt={stay.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" onError={e=>{e.currentTarget.style.visibility='hidden'}}/>}
      <button type="button" aria-label={`${id?'Simpan':'Save'} ${stay.name}`} aria-pressed={favorite} onClick={onFavorite} className={`absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-[#fffdf9ef] shadow-sm transition hover:scale-105 ${favorite ? 'text-[#a63936] [&_svg]:fill-current' : 'text-[#27392c]'}`}><ExploreIcon name="heart" /></button>
      {stay.badge && <span className="absolute bottom-2 left-3 rounded-full bg-[#fffdf3] px-2.5 py-1 text-[10px] font-semibold"><span className="mr-1 text-[#926400]">{stay.badge==='choice'?'★':'♨'}</span>{stay.badge==='choice'?(id?'Pilihan terbaik':'Best choice'):(id?'Populer':'Popular')}</span>}
    </div>
    <div className="p-3.5">
      <h3 className="min-h-5 text-[14px] font-semibold leading-snug text-[#18241b]">{stay.name}</h3>
      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[#6a6d68]"><span aria-hidden="true">⌖</span>{stay.area}, Lombok Timur</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-[10px] text-[#62655f]">{stay.source?.category?.[id?'name':'nameEn']||stay.source?.category?.name}</span>
        <div className="text-right text-[10px]"><p className="font-semibold">{stay.priceLabel}</p></div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex gap-1">{stay.amenities.map(name=><span key={name} title={amenities[name]} aria-label={amenities[name]} className="grid size-6 place-items-center rounded-full bg-[#f2f1eb]"><ExploreIcon name={name} className="size-3.5"/></span>)}</div>
        <button type="button" className={`${primaryButton} min-h-9 px-4 text-[10px]`} onClick={onSelect}>{id?'Lihat detail':'View details'} <ExploreIcon name="arrow" className="size-3.5"/></button>
      </div>
    </div>
  </article>;
}
