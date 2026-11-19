# Tetebatu landing page

Standalone React + TypeScript + Vite port from C:/Code/wega.

```sh
npm install
npm run dev
npm run build
npm run lint
```

Landing UI is organized by responsibility in `src/page`, `src/components`, and `src/icon`. Local inspiration content is in `src/data`, shared context in `src/context`, and TypeScript types in `src/types`. Includes shared responsive navigation, ID/EN switching, local search and category filtering, and an accessible native detail dialog. Navigation targets sections on this single page; no Next.js routes are required.

Only 8 referenced images and 2 fonts were copied to `public/images` and `public/fonts`. The photographs/AI illustrations are inherited from the original project and represent travel inspiration, not verified providers. Source backend, environment files, credentials, Prisma and Supabase were not copied. The original project is unchanged.

This is a UI-only port. Search operates on the bundled inspiration data. Reservations, provider inventory, and admin features require a separate backend integration.

Styling uses Tailwind CSS via @tailwindcss/vite, with utility classes in TSX. src/index.css contains only the Tailwind import. Local fonts load through FontFace in src/main.tsx. No custom component stylesheet or @apply rules.

## Source structure

```text
src/
  page/          # Page components
  components/    # Reusable UI and service previews
  icon/          # SVG icons and brand mark
  data/          # Category catalog and local preview content
  context/       # Shared React context
  types/         # Shared TypeScript types
  App.tsx        # Application composition and navigation
  main.tsx       # React entry point
  index.css      # Tailwind import
public/
  images/        # Landing image assets
  fonts/         # Local fonts
```

## Shared navbar and footer

Import `Navbar` from `src/components/navbar.tsx` and `Footer` from
`src/components/footer.tsx`. Both accept `locale`, optional `links`, and
optional `homeHref`. Navbar also requires `onLocaleChange` and accepts
`mainContentId` (defaults to `main`) for the skip link.

```tsx
<Navbar locale={locale} onLocaleChange={setLocale} />
<main id="main" tabIndex={-1}>{/* Page content */}</main>
<Footer locale={locale} />
```

Default links return to landing sections using `/#...`, so these components
can be used on other pages. Pass a custom `links` array of `{ href, label }`
to customize navigation. Shared ID/EN labels live in `src/data/navigation.ts`.
The navbar manages its own mobile menu; the parent owns the selected locale.

## Explore page

`/explore` renders `src/page/explore-page.tsx`, using shared Navbar/Footer. Landing Explore links point here. Stay cards, booking summary, SVG icons and sample data are separate modules. Search, sorting, type/location filters, saved favorites and date estimates run locally. Listings and images are illustrative; contact actions explain that no reservation is created. The Vercel rewrite supports direct access and refresh on `/explore`.
