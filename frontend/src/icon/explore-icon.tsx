import type { ReactNode } from 'react';
const paths: Record<string, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 4h1m4 0h1m-6 3h1m4 0h1"/></>,
  people: <><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2"/></>,
  wifi: <><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r="1"/></>,
  parking: <><rect x="4" y="3" width="16" height="18" rx="4"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></>,
  coffee: <><path d="M4 9h12v7a5 5 0 0 1-10 0V9m10 1h2a3 3 0 0 1 0 6h-2M3 22h16M8 3v3m4-3v3"/></>,
  pool: <><path d="M8 16V5a2 2 0 0 1 4 0m2 11V5a2 2 0 0 1 4 0M8 9h6m-6 4h6M2 18q3-3 6 0t6 0t6 0M2 22q3-3 6 0t6 0t6 0"/></>,
  food: <><path d="M4 3v7m3-7v7m3-7v7M4 8h6m-3 2v11M19 3c-5 3-5 10 0 10m0-10v18"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  chat: <path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z"/>,
  phone: <path d="m7 3-4 2c0 9 7 16 16 16l2-4-5-3-2 2a12 12 0 0 1-6-6l2-2-3-5Z"/>,
};
export function ExploreIcon({ name, className = '' }: { name: string; className?: string }) {
  return <svg className={`size-[18px] shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.home}</svg>;
}
