const CACHE='reventapro-beta-v2-5';
const HOME=new URL('./index.html',self.registration.scope).href;
const ROOT=new URL('./',self.registration.scope).pathname;
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('reventapro-beta-v2-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin||!u.href.startsWith(self.registration.scope))return;
if(r.mode==='navigate'&&(u.pathname===ROOT||u.pathname===new URL(HOME).pathname)){e.respondWith((async()=>{try{const res=await fetch(r);if(res.ok){const c=await caches.open(CACHE);await c.put(HOME,res.clone());}return res;}catch{return await caches.match(HOME)||Response.error();}})());return;}
if(ASSETS.slice(1).some(a=>new URL(a,self.registration.scope).href===u.href)){e.respondWith(caches.match(r).then(x=>x||fetch(r)));}});
