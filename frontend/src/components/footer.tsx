import { useState } from 'react';
import { TravelBrand } from '../icon/travel-icons';
import { getNavigationLinks } from '../data/navigation';
import type { NavigationLink } from '../data/navigation';
import type { Locale } from '../types/locale';

export type FooterProps = {
  locale: Locale;
  links?: readonly NavigationLink[];
  homeHref?: string;
};

export function Footer({ locale, links = getNavigationLinks(locale), homeHref = '/#home' }: FooterProps) {
  const id = locale === 'id';
  const [year] = useState(() => new Date().getFullYear());
  return (
    <footer className="travel-footer font-['Libre_Franklin'] text-sm leading-[1.6] text-[#17281d] **:focus-visible:outline-2 [&_:focus-visible]:outline-[#315c3e] [&_:focus-visible]:outline-offset-4 relative isolate overflow-hidden pt-8 pb-[22px] min-[601px]:pt-[42px]"><div className="travel-wrap mx-auto w-[calc(100%-40px)] max-w-[1280px] min-[601px]:w-[calc(100%-72px)] min-[1101px]:w-[calc(100%-128px)]"><div className="travel-footer-top flex flex-col items-start justify-between gap-5 pb-10 min-[601px]:flex-row min-[601px]:items-center min-[601px]:gap-[30px] min-[601px]:pb-16 [&_nav]:flex [&_nav]:flex-wrap [&_nav]:gap-x-5 [&_nav]:gap-y-0.5 [&_nav]:text-[11px] min-[601px]:[&_nav]:gap-7 min-[601px]:[&_nav]:text-xs [&_nav_a]:flex [&_nav_a]:min-h-11 [&_nav_a]:items-center"><a className="travel-brand inline-flex shrink-0 items-center gap-[9px] [&_span]:grid [&_span]:leading-[1.1] [&_strong]:text-[22px] [&_strong]:tracking-[.08em] [&_small]:mt-1 [&_small]:text-[10px] [&_small]:tracking-[.06em] max-[600px]:[&_strong]:text-[17px] max-[600px]:[&_small]:text-[9px] max-[600px]:[&_svg]:w-[60px]" href={homeHref}><TravelBrand /></a><nav aria-label={id ? 'Menu bawah' : 'Footer navigation'}>{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></div><div className="travel-footer-bottom flex flex-col justify-between gap-2.5 border-t border-[#b6c5ae] pt-5 text-[9px] text-[#52624d] min-[801px]:flex-row min-[801px]:gap-6 min-[601px]:text-[10px] [&_p]:max-w-[650px] min-[801px]:[&_p]:text-right"><span>© {year} Tetebatu</span><p>{id ? 'Visual ilustrasi dan inspirasi perjalanan.' : 'Illustrative visuals and travel inspiration.'}</p></div></div><div className="travel-mountains absolute inset-x-0 bottom-0 -z-1 h-[130px] bg-[#dce3d7] opacity-75 [clip-path:polygon(0_15%,5%_26%,10%_13%,16%_35%,22%_20%,30%_37%,38%_16%,44%_33%,50%_14%,58%_31%,66%_21%,73%_33%,80%_12%,87%_26%,93%_15%,100%_23%,100%_100%,0_100%)]" aria-hidden="true" /></footer>
  );
}
