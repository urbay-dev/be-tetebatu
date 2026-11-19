export function TravelIcon({ kind, className = '' }: { kind: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    'tourist-attractions': (
      <>
        <path d="m2 20 7-13 5 8 3-5 5 10H2Z" />
        <path d="m7 11 2 2 2-2" />
      </>
    ),
    accommodation: (
      <>
        <path d="M3 19V5m18 14V9M3 15h18M3 11h18v4M6 8h4v3H6z" />
      </>
    ),
    restaurants: (
      <>
        <path d="M5 3v7m3-7v7m-6-7v7c0 3 6 3 6 0M5 13v8M17 3c-3 4-3 9 0 9h2M19 3v18" />
      </>
    ),
    'coffee-shops': (
      <>
        <path d="M4 9h13v6a6 6 0 0 1-13 0V9ZM17 10h2a3 3 0 0 1 0 6h-2M3 22h16M7 3v2m4-3v3m4-2v2" />
      </>
    ),
    'tours-activities': (
      <>
        <path d="M12 14s5-4 5-8a5 5 0 0 0-10 0c0 4 5 8 5 8Z" />
        <circle cx="12" cy="6" r="1" />
        <path d="m7 16-3 1-2 5 7-2 6 2 7-3-2-5-3 1" />
      </>
    ),
    'car-drivers': (
      <>
        <path d="m5 8 2-5h10l2 5M3 16V9h18v7H3ZM5 16v4m14-4v4M3 12h4m10 0h4" />
      </>
    ),
    'motorcycle-taxis': (
      <>
        <circle cx="5" cy="17" r="4" />
        <circle cx="19" cy="17" r="4" />
        <path d="m5 17 5-8h6l3 8M9 13h7M13 5h4l2 8M6 8h5" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    location: (
      <>
        <path d="M12 22s8-8 8-14a8 8 0 0 0-16 0c0 6 8 14 8 14Z" />
        <circle cx="12" cy="8" r="2" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
  };
  const icon = kind === 'car-driver' ? 'car-drivers' : kind === 'motorcycle-taxi' ? 'motorcycle-taxis' : kind;
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[icon] ?? paths['tourist-attractions']}
    </svg>
  );
}
export function TravelBrand() {
  return (
    <>
      <svg
        viewBox="0 0 72 42"
        width="64"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m2 31 22-24 15 14 10-11 21 23M16 34l18-8 19 10M16 18l8-11 7 7m12 2 6-6 7 8" />
      </svg>
      <span>
        <strong>TETEBATU</strong>
        <small>Explore Lombok</small>
      </span>
    </>
  );
}
