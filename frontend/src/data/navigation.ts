import type { Locale } from '../types/locale';

export type NavigationLink = { href: string; label: string };

export function getNavigationLinks(locale: Locale, _homePath = '/'): NavigationLink[] {
  const id = locale === 'id';
  return [{href:'/#home',label:id?'Beranda':'Home'},{href:'/explore',label:id?'Jelajahi':'Explore'},{href:'/#about',label:id?'Tentang Tetebatu':'About Tetebatu'},{href:'/#plan',label:id?'Rencanakan kunjungan':'Plan your visit'}];
}
