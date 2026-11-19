import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import { ProtectedRoute, PublicRoute } from './components/route-guards';
import { LoginPage } from './page/login-page';
import { AdminLayout } from './components/admin-layout';
import { PageLoader, RouteTransition } from './components/page-loader';
import { CategoryAdminPage } from './page/category-admin';
import { ServiceAdminPage } from './page/service-admin';
import { ContentAdmin, HomepageAdmin, AreaAdmin, SettingsAdmin } from './page/content-admin';
import { HomePage } from './page/home-page';
import { ExplorePage } from './page/explore-page';
import { Footer } from './components/footer';
import { Navbar } from './components/navbar';
import { ServiceDetail, Articles, ArticleDetail, About, ScrollTop } from './page/public-pages';
import { getNavigationLinks } from './data/navigation';
import type { Locale } from './types/locale';

const Dashboard = lazy(() => import('./page/admin-dashboard').then(m => ({ default: m.AdminDashboard })));

function AdminDashboard({ locale }: { locale: Locale }) {
  return <Suspense fallback={<PageLoader variant="dashboard" label={locale === 'id' ? 'Menyiapkan dashboard…' : 'Preparing your dashboard…'} locale={locale} />}>
    <Dashboard />
  </Suspense>;
}

function PublicShell({ locale, onLocaleChange }: { locale: Locale; onLocaleChange: (locale: Locale) => void }) {
  const en = locale === 'en';
  const links = getNavigationLinks(locale);
  return <div className="travel-home bg-[#faf8f3] text-[#17281d] font-['Libre_Franklin'] text-sm leading-[1.6] [&_h1]:font-['Source_Serif_4'] [&_h2]:font-['Source_Serif_4'] [&_h1]:font-medium [&_h2]:font-medium [&_h1]:tracking-[-.045em] [&_h2]:tracking-[-.045em] [&_button]:cursor-pointer [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-[#315c3e] [&_:focus-visible]:outline-offset-4 motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:animate-none min-h-screen" id="home">
    <Navbar locale={locale} onLocaleChange={onLocaleChange} links={links} homeHref="/#home" />
    <main id="main" tabIndex={-1} className="outline-none scroll-mt-[90px]">
      <RouteTransition><Outlet /></RouteTransition>
    </main>
    <Footer locale={locale} links={[...links, { href: '/articles', label: en ? 'Articles' : 'Artikel' }, { href: '/about-platform', label: en ? 'About platform' : 'Tentang platform' }]} homeHref="/#home" />
  </div>;
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      return localStorage.getItem('tetebatu-locale') === 'en' ? 'en' : 'id';
    } catch {
      return 'id';
    }
  });
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem('tetebatu-locale', locale);
    } catch {}
  }, [locale]);
  const en = locale === 'en';

  return <AuthProvider>
    <BrowserRouter>
      <ScrollTop />
      <Suspense fallback={<PageLoader locale={locale} />}>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard locale={locale} />} />
            <Route path="categories" element={<CategoryAdminPage />} />
            <Route path="services" element={<ServiceAdminPage />} />
            <Route path="areas" element={<AreaAdmin />} />
            <Route path="articles" element={<ContentAdmin />} />
            <Route path="homepage" element={<HomepageAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
          <Route element={<PublicShell locale={locale} onLocaleChange={setLocale} />}>
            <Route index element={<HomePage locale={locale} />} />
            <Route path="explore" element={<ExplorePage locale={locale} />} />
            <Route element={<div className="new-pages"><Outlet /></div>}>
              <Route path="services/:slug" element={<ServiceDetail locale={locale} />} />
              <Route path="articles" element={<Articles locale={locale} />} />
              <Route path="articles/:slug" element={<ArticleDetail locale={locale} />} />
              <Route path="about" element={<About locale={locale} />} />
              <Route path="about-platform" element={<About locale={locale} platform />} />
              <Route path="*" element={<div className="wrap section">
                <h1>{en ? 'Page not found' : 'Halaman tidak ditemukan'}</h1>
                <Link className="btn" to="/">{en ? 'Back to home' : 'Kembali ke beranda'}</Link>
              </div>} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </AuthProvider>;
}
