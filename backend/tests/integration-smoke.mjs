// Creates only uniquely named draft test records, then removes those records in finally.
import 'dotenv/config';
import assert from 'node:assert/strict';
const base=process.env.TEST_API_URL||'http://127.0.0.1:5002/api/v1';
let token,serviceId,articleId,categoryId,areaId,imageId;
async function request(path,method='GET',body,expected=200){const r=await fetch(base+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body&&! (body instanceof FormData)?{'Content-Type':'application/json'}:{})},body:body instanceof FormData?body:body?JSON.stringify(body):undefined});const d=await r.json();assert.equal(r.status,expected,`${method} ${path}: ${d.message}`);return d}
const stamp=Date.now(),prefix='QA integration '+stamp;
try{
 await request('/articles/admin','GET',undefined,401);await request('/areas/admin','GET',undefined,401);
 await request('/services?page=-1','GET',undefined,400);
 const categories=(await request('/categories')).data;assert(categories.length>0);
 const filtered=await request('/services?category='+categories[0].slug);assert(filtered.data.every(s=>s.categoryId===categories[0].id));
 const home=(await request('/homepage')).data;assert(home.categories.every(c=>Array.isArray(c.services)));assert(Array.isArray(home.hiddenSections));
 console.log('PASS: public filters, homepage relations, pagination validation, admin protection');
 assert(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD,'Admin credentials must be configured for CRUD checks');
 token=(await request('/auth/login','POST',{email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD})).data.token;
 const category=(await request('/categories/admin','POST',{name:prefix,nameEn:'Integration test',isActive:false},201)).data;categoryId=category.id;
 const area=(await request('/areas/admin','POST',{name:prefix},201)).data;areaId=area.id;
 const created=(await request('/services/admin','POST',{name:prefix,categoryId:categories[0].id,areaId,status:'DRAFT',contacts:[{type:'EMAIL',value:'qa@example.invalid'}],facilities:[{name:'Fasilitas uji',nameEn:'Test facility'}],prices:[{label:'Harga uji',labelEn:'Test price',type:'RANGE',minPrice:100,maxPrice:200,currency:'IDR'}],openingHours:{senin:'08:00 – 17:00'}},201)).data;serviceId=created.id;
 await request('/services/'+created.slug,'GET',undefined,404);
 assert(!(await request('/services?search='+encodeURIComponent(prefix))).data.some(s=>s.id===serviceId));
 await request('/services/admin/'+serviceId,'PATCH',{description:'Diperbarui',areaId:null,googleMapsUrl:'',contacts:[],facilities:[],prices:[]});
 let detail=(await request('/services/admin/'+serviceId)).data;assert.equal(detail.contacts.length,0);assert.equal(detail.areaId,null);assert.equal(detail.facilities.length,0);
 await request('/services/admin/'+serviceId,'PATCH',{contacts:[{type:'EMAIL',value:'before@example.invalid'}]});
 await request('/services/admin/'+serviceId,'PATCH',{categoryId:'missing-category',contacts:[{type:'EMAIL',value:'after@example.invalid'}]},500);
 detail=(await request('/services/admin/'+serviceId)).data;assert.equal(detail.contacts[0].value,'before@example.invalid');
 console.log('PASS: create/edit draft, public isolation, clearing fields, atomic relationship rollback');
 const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3X8AAAAASUVORK5CYII=','base64');
 const upload=new FormData();upload.append('image',new Blob([bytes],{type:'image/png'}),'qa.png');
 imageId=(await request('/services/admin/'+serviceId+'/images','POST',upload,201)).data.id;
 await request('/services/admin/'+serviceId+'/images/'+imageId+'/primary','PATCH');
 await request('/services/admin/'+serviceId+'/images/'+imageId,'DELETE');imageId=undefined;
 console.log('PASS: photo upload, primary selection, deletion');
 const article=(await request('/articles/admin','POST',{title:prefix,titleEn:'Integration test',content:'Test draft',contentEn:'Test draft',status:'DRAFT'},201)).data;articleId=article.id;
 await request('/articles/'+article.slug,'GET',undefined,404);
 await request('/articles/admin/'+article.id,'PATCH',{content:'Updated draft'});
 assert.equal((await request('/articles/admin/'+article.id)).data.content,'Updated draft');
 assert((await request('/admin/dashboard')).data.overview.totalServices>=1);
 console.log('PASS: article CRUD, draft isolation, dashboard statistics');
}finally{
 if(imageId&&serviceId)await request('/services/admin/'+serviceId+'/images/'+imageId,'DELETE');
 for(const [path,id] of [['articles',articleId],['services',serviceId],['areas',areaId],['categories',categoryId]])if(id)await request('/'+path+'/admin/'+id,'DELETE');
 console.log('Test records cleaned up.');
}
