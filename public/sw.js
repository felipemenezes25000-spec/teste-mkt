// Service worker do Mundo Sem Fim — torna o app instalável e dá offline básico.
// Estratégia: navegações = network-first (cacheia a página visitada → fica acessível
// offline depois) com fallback pro shell /offline; assets estáticos = stale-while-
// revalidate. O plano salvo do usuário vive em localStorage → sempre acessível offline.
// Requests cross-origin (Wikipedia/Supabase/OSM) NÃO são tocados (seguem a CSP normal).
const CACHE_VERSION = 3;
const CACHE = `msf-v${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll([OFFLINE_URL, '/viagens'])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // deixa cross-origin com o browser/CSP

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static') || ['image', 'style', 'script', 'font'].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
          .catch(() => cached);
        return cached || network || new Response('', { status: 503, statusText: 'Offline' });
      })
    );
  }
});
