import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { Locale } from '../types/locale';

const COPY: Record<Locale, Record<string, string>> = {
  id: {
    page: 'Menyiapkan pengalamanmu…',
    section: 'Memuat informasi…',
    dashboard: 'Menyiapkan dashboard…',
    cards: 'Mencari pilihan terbaik…',
    inline: 'Memuat…',
  },
  en: {
    page: 'Curating your experience…',
    section: 'Gathering information…',
    dashboard: 'Preparing your dashboard…',
    cards: 'Finding the best stays…',
    inline: 'Loading…',
  },
};

export function RouteTransition({ children, className = '' }: { children: ReactNode; className?: string }) {
  const location = useLocation();
  return <div key={location.pathname} className={`page-transition ${className}`.trim()}>{children}</div>;
}

export function LoadingDots({
  size = 'md',
  label,
  locale = 'id',
}: {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  locale?: Locale;
}) {
  return <span className={`loader-dots loader-dots--${size}`} role="status" aria-live="polite" aria-label={label ?? COPY[locale].inline}>
    <i /><i /><i />
    {label ? <span className="loader-dots__label">{label}</span> : null}
  </span>;
}

export function PageLoader({
  variant = 'page',
  label,
  locale = 'id',
}: {
  variant?: 'page' | 'section' | 'dashboard' | 'compact';
  label?: string;
  locale?: Locale;
}) {
  const text = label ?? COPY[locale][variant];
  return <div className={`page-loader page-loader--${variant}`}>
    <span className="page-loader__halo" aria-hidden="true" />
    <LoadingDots size={variant === 'compact' ? 'sm' : 'lg'} label={text} locale={locale} />
  </div>;
}

export function LoadingInline({ label, locale = 'id' }: { label?: string; locale?: Locale }) {
  return <LoadingDots size="sm" label={label} locale={locale} />;
}
