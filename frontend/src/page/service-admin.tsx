import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExternalLink, Image as ImageIcon, MapPin, Mountain, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { serviceService } from '../services/service.service';
import type { Service } from '../services/service.service';
import { categoryService } from '../services/category.service';
import type { Category } from '../services/category.service';
import { areaService } from '../services/area.service';
import type { Area } from '../services/area.service';
import { safeUrl, priceText } from '../services/public';
import { ServiceEditor } from './service-editor';
import { State } from './public-pages';

const STATUS = {
  DRAFT: { label: 'Draf', className: 'draft' },
  PUBLISHED: { label: 'Terbit', className: 'published' },
  ARCHIVED: { label: 'Arsip', className: 'archived' },
} as const;

export function ServiceAdminPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState<Service | null | undefined>();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [params, setParams] = useSearchParams();

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const [s, c, a] = await Promise.all([serviceService.getAll(), categoryService.getAll(), areaService.getAll()]);
      setItems(s);
      setCategories(c);
      setAreas(a);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { setSearch(params.get('search') || ''); }, [params]);
  useEffect(() => {
    if (params.get('new') === '1' && !loading && !error) {
      setEditing(null);
      setParams({}, { replace: true });
    }
  }, [params, loading, error]);

  async function edit(s: Service) {
    setBusy(true);
    try {
      setEditing(await serviceService.getById(s.id));
    } catch {
      toast.error('Detail layanan gagal dimuat.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(s: Service) {
    if (!confirm(`Hapus layanan “${s.name}”? Tindakan ini tidak dapat dibatalkan.`)) return;
    setBusy(true);
    try {
      await serviceService.delete(s.id);
      toast.success('Layanan dihapus');
      await load();
    } catch {
      toast.error('Layanan gagal dihapus.');
    } finally {
      setBusy(false);
    }
  }

  if (editing !== undefined) {
    return <ServiceEditor initial={editing} categories={categories} areas={areas} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); load(); }} />;
  }

  const filtered = items.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) && (!status || s.status === status));

  return <>
    <div className="admin-heading">
      <div>
        <h1>Layanan wisata</h1>
        <p>Kelola informasi yang akan dilihat wisatawan. Draf tidak tampil di website publik.</p>
      </div>
      <button className="btn" disabled={loading || error} onClick={() => setEditing(null)}>Tambah layanan</button>
    </div>

    <div className="admin-form admin-panel mb-6">
      <div className="fields">
        <label>Cari layanan<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nama layanan" /></label>
        <label>Status
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Semua status</option>
            <option value="DRAFT">Draf</option>
            <option value="PUBLISHED">Terbit</option>
            <option value="ARCHIVED">Arsip</option>
          </select>
        </label>
      </div>
    </div>

    <div className="admin-service-count">{filtered.length} dari {items.length} layanan</div>

    {loading || error ? <State loading={loading} error={error} retry={load} /> : filtered.length === 0 ? (
      <div className="admin-panel admin-service-empty">
        <Mountain size={34} strokeWidth={1.4} />
        <h2>Belum ada layanan yang cocok</h2>
        <p>Tambahkan layanan baru atau ubah kata kunci pencarian.</p>
      </div>
    ) : (
      <div className="admin-service-grid">
        {filtered.map(s => {
          const image = safeUrl(s.images?.[0]?.url);
          const price = s.prices?.[0] ? priceText(s.prices[0], false) : 'Harga belum diisi';
          return <article className="admin-service-card" key={s.id}>
            <div className="admin-service-media">
              <div className="admin-service-placeholder"><Mountain size={34} strokeWidth={1.3} /></div>
              {image ? <img src={image} alt={s.images?.[0]?.alt || s.name} loading="lazy" onError={e => e.currentTarget.remove()} /> : null}
              <span className={`admin-service-status ${STATUS[s.status].className}`}>{STATUS[s.status].label}</span>
              {s.isFeatured ? <span className="admin-service-featured">Unggulan</span> : null}
            </div>
            <div className="admin-service-body">
              <span className="admin-service-category">{s.category?.name || 'Tanpa kategori'}</span>
              <h2>{s.name}</h2>
              <p>{s.shortDescription || s.description || 'Belum ada deskripsi singkat.'}</p>
              <div className="admin-service-meta">
                <span><MapPin size={14} />{s.area?.name || s.address || 'Lokasi belum diisi'}</span>
                <span><ImageIcon size={14} />{s.images?.length || 0} foto</span>
              </div>
              <strong className="admin-service-price">{price}</strong>
            </div>
            <div className="admin-service-actions">
              {s.status === 'PUBLISHED' ? <Link className="admin-service-link" to={`/services/${s.slug}`} target="_blank"><ExternalLink size={15} />Lihat publik</Link> : <span />}
              <div className="admin-service-buttons">
                <button disabled={busy} onClick={() => edit(s)}><Pencil size={14} />Edit</button>
                <button className="danger" disabled={busy} onClick={() => remove(s)}><Trash2 size={14} />Hapus</button>
              </div>
            </div>
          </article>;
        })}
      </div>
    )}
  </>;
}
