import { useEffect, useState } from 'react';
import api from './api';
import type { Service } from './service.service';
export interface Category { id: string; name: string; nameEn: string; slug: string; description?: string; descriptionEn?: string; services?: Service[] }
export interface Article { id: string; slug: string; title: string; titleEn: string; excerpt?: string; excerptEn?: string; content: string; contentEn: string; coverImage?: string; publishedAt?: string; type: string; status: string }
export interface Section { id: string; key: string; title: string; titleEn: string; subtitle?: string; subtitleEn?: string; content: { image?: string; text?: string; textEn?: string }; isActive: boolean; sortOrder: number }
export interface HomeData { sections: Section[]; hiddenSections?: string[]; categories: Category[]; featuredServices: Service[]; recommendedServices: Service[]; latestArticles: Article[]; attractions: Service[]; activities: Service[] }
export interface PageData<T> { data: T[]; meta: { page: number; total: number; totalPages: number } }
export function useApi<T>(path: string) {
 const [state, setState] = useState<{data?: T; loading: boolean; error: boolean}>({loading:true,error:false});
 const [attempt, setAttempt] = useState(0);
 useEffect(() => { const controller = new AbortController(); setState({loading:true,error:false});
  api.get(path, {signal:controller.signal}).then(r => setState({data:r.data.data,loading:false,error:false})).catch(() => {if (!controller.signal.aborted) setState({loading:false,error:true});});
  return () => controller.abort();
 }, [path,attempt]);
 return {...state,retry:()=>setAttempt(n=>n+1)};
}
export function safeUrl(value?: string) { if (!value) return undefined; try { const url=new URL(value); return ['http:','https:'].includes(url.protocol)?url.href:undefined; } catch { return undefined; } }
export function contactHref(type: string, value: string, name: string, en: boolean) {
 const digits=value.replace(/\D/g,'').replace(/^0/,'62');
 if (type==='WHATSAPP') return digits.length>=8 ? `https://wa.me/${digits}?text=${encodeURIComponent(en?`Hello, I found ${name} on the Tetebatu tourism website. I'd like to ask about availability and further information. Thank you.`:`Halo, saya mendapatkan informasi ${name} melalui website wisata Tetebatu. Saya ingin bertanya mengenai ketersediaan dan informasi lebih lanjut. Terima kasih.`)}`:undefined;
 if(type==='PHONE') return digits.length>=8?`tel:+${digits}`:undefined;
 if(type==='EMAIL') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)?`mailto:${value}`:undefined;
 return safeUrl(value);
}
export function priceText(p: NonNullable<Service['prices']>[number], en: boolean) {
 if(p.type==='FREE') return en?'Free':'Gratis';
 if(p.type==='CONTACT_FOR_PRICE') return en?'Contact for price':'Hubungi untuk harga';
 const fmt=(v:number|string)=>new Intl.NumberFormat(en?'en-US':'id-ID',{style:'currency',currency:p.currency||'IDR',maximumFractionDigits:0}).format(Number(v));
 if(p.minPrice==null) return en?'Ask for price':'Tanyakan harga';
 return `${p.type==='STARTING_FROM'?(en?'From ':'Mulai '):''}${fmt(p.minPrice)}${p.type==='RANGE'&&p.maxPrice!=null?' – '+fmt(p.maxPrice):''}${(en?p.unitEn||p.unit:p.unit)?' / '+(en?p.unitEn||p.unit:p.unit):''}`;
}
