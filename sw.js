// Soccer Party service worker — offline app shell + runtime asset cache.
// The core game (runtime + fonts) is inlined in index.html, so caching the
// shell makes the game playable offline; game art under assets/ is cached
// on first fetch so it's available offline on subsequent launches.
var CACHE = 'soccerparty-v2';
var SHELL = [
  './', 'index.html', 'manifest.json',
  // React is vendored (no CDN), so the app cannot boot without these.
  'assets/vendor/react.production.min.js',
  'assets/vendor/react-dom.production.min.js',
  'assets/generated/icon-app.png',
  'assets/generated/icon-app-512.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL).catch(function () {}); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return; // leave cross-origin alone

  // Page navigations: network first, fall back to the cached shell when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match('index.html').then(function (m) { return m || caches.match('./'); });
      })
    );
    return;
  }

  // Everything else same-origin: stale-while-revalidate. Serve the cached copy
  // immediately (fast, works offline) and quietly refresh it in the background,
  // so regenerated art is picked up on the next launch instead of being pinned
  // for ever by a plain cache-first.
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
