import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { serviceService } from '../services/service.service';
import type { Service } from '../services/service.service';
import { categoryService } from '../services/category.service';
import type { Category } from '../services/category.service';
import { areaService } from '../services/area.service';
import type { Area } from '../services/area.service';
import { ServiceEditor } from './service-editor';
import { State } from './public-pages';
export function ServiceAdminPage(){
 const [items,setItems]=useState<Service[]>([]),[categories,setCategories]=useState<Category[]>([]),[areas,setAreas]=useState<Area[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(false),[editing,setEditing]=useState<Service|null|undefined>(),[search,setSearch]=useState(''),[status,setStatus]=useState(''),[busy,setBusy]=useState(false);const [params,setParams]=useSearchParams();
 async function load(){setLoading(true);setError(false);try{const [s,c,a]=await Promise.all([serviceService.getAll(),categoryService.getAll(),areaService.getAll()]);setItems(s);setCategories(c);setAreas(a)}catch{setError(true)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 useEffect(()=>{setSearch(params.get('search')||'')},[params]);
 useEffect(()=>{if(params.get('new')==='1'&&!loading&&!error){setEditing(null);setParams({},{replace:true})}},[params,loading,error]);
 async function edit(s:Service){setBusy(true);try{setEditing(await serviceService.getById(s.id))}catch{toast.error('Detail layanan gagal dimuat.')}finally{setBusy(false)}}
 async function remove(s:Service){if(!confirm(`Hapus layanan “${s.name}”? Tindakan ini tidak dapat dibatalkan.`))return;setBusy(true);try{await serviceService.delete(s.id);toast.success('Layanan dihapus');await load()}catch{toast.error('Layanan gagal dihapus.')}finally{setBusy(false)}}
 if(editing!==undefined)return <ServiceEditor initial={editing} categories={categories} areas={areas} onClose={()=>setEditing(undefined)} onSaved={()=>{setEditing(undefined);load()}}/>;
 return <><div className="admin-heading"><div><h1>Layanan wisata</h1><p>Kelola informasi yang akan dilihat wisatawan. Draf tidak tampil di website publik.</p></div><button className="btn" disabled={loading||error} onClick={()=>setEditing(null)}>Tambah layanan</button></div><div className="admin-form admin-panel mb-6"><div className="fields"><label>Cari layanan<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nama layanan"/></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option value="">Semua status</option><option value="DRAFT">Draf</option><option value="PUBLISHED">Terbit</option><option value="ARCHIVED">Arsip</option></select></label></div></div>{loading||error?<State loading={loading} error={error} retry={load}/>:<div className="admin-list">{items.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())&&(!status||s.status===status)).map(s=><div className="admin-row" key={s.id}><div><h2 className="font-semibold">{s.name}</h2><p>{s.category?.name} · {({DRAFT:'Draf',PUBLISHED:'Terbit',ARCHIVED:'Arsip'})[s.status]}{s.isFeatured?' · Unggulan':''}</p></div><div className="admin-actions">{s.status==='PUBLISHED'&&<Link className="text-link" to={`/services/${s.slug}`} target="_blank">Lihat publik</Link>}<button className="btn secondary" disabled={busy} onClick={()=>edit(s)}>Edit layanan</button><button className="text-link" disabled={busy} onClick={()=>remove(s)}>Hapus</button></div></div>)}{!items.length&&<div className="admin-panel">Belum ada layanan. Mulai dengan menambahkan layanan pertama.</div>}</div>}</>
}
