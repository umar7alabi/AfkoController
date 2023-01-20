'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "dfea28a346ce98af8eaf1faae50b34be",
"assets/assets/icons/afko.png": "3b52c2e592ae1ca03dfab11541c0f1ca",
"assets/assets/icons/circular-arrow.png": "4c5aa62526525a0e37421624d5aecff7",
"assets/assets/icons/circular-right-arrow.png": "3cf3f30e2feae3cbfd7e807e199578ce",
"assets/assets/icons/dj-mixer.png": "990774eaed7958afdc11ad988dd9db65",
"assets/assets/icons/dozaj_off.png": "c9215a4cf23f55b04bcfab2838dbaeed",
"assets/assets/icons/dozaj_on.png": "5d5e8651112a75e3612eaf2803a56326",
"assets/assets/icons/drop-off.png": "60a5914fb57dd21bacbb233a618234e6",
"assets/assets/icons/drop-on.png": "bc545fee14a491d63aea0ba09b37fc60",
"assets/assets/icons/drop2_off.png": "18f72b09cc3882c4efb90d5f69d4dd42",
"assets/assets/icons/drop2_on.png": "2140f7a48986f1bc4915324f500a8a81",
"assets/assets/icons/geri_off.png": "cb33bd4254ad8cb5ef4da9eb00020663",
"assets/assets/icons/geri_on.png": "518bff46980ce85a7be22b1bd867366c",
"assets/assets/icons/ileri_off.png": "3ee6f06e2afce26d0e1f7a991fb2515f",
"assets/assets/icons/ileri_on.png": "154e669fa7d6e117736fbcba67f594e4",
"assets/assets/icons/mixer_off.png": "ffa6d19db7c123f9115c3fdde670b95f",
"assets/assets/icons/mixer_on.png": "f6bcc3e9c1db3798c4fb0dc2ddcdb73e",
"assets/assets/icons/pump-dozaj.png": "bbca377f34bae410fbef17de1d5915e9",
"assets/assets/icons/pump.png": "25b7c03a2d752c9d3ee9358f2190dbc2",
"assets/assets/icons/splash.png": "d39e770edbb6d42802d60905c2887aec",
"assets/assets/icons/sulama.png": "b07161278a0945ef26f23a9cd87a4d72",
"assets/assets/images/3d23fad8": "a1ceed711d9959aad1d413e528f2b413",
"assets/assets/images/circle.png": "54787eb63a153ba9a5256400237f0f1f",
"assets/assets/images/humidity.png": "be7f57bf0ed6cbcf5aa24809e1d1d873",
"assets/assets/images/question_mark.png": "b81e86fffab072446898984705f18f58",
"assets/assets/images/temperature.png": "d75aa3b7e70655e9ffe01bc43e0a72e1",
"assets/assets/images/water_pressure.png": "a1ceed711d9959aad1d413e528f2b413",
"assets/assets/images/wind_speed.png": "583ce7e1d07a314f8f4e30a355fdaeb3",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "d789dc4f63f109f694dfd6b3e756c5cc",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "a9870efffe99a8d62629e0c54ebc29c7",
"favicon.png": "3b52c2e592ae1ca03dfab11541c0f1ca",
"icons/afko-192-maskable.png": "734cf6fea46616663ab149e95069535d",
"icons/afko-192-new.png": "c2ec80e88833cb4424bb2916395b0ce4",
"icons/afko-512-maskable.png": "19ff124573930a39b4f217e69b31754f",
"icons/afko.png": "3b52c2e592ae1ca03dfab11541c0f1ca",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "7ce3d7bd375cade58b10a122aa22e1ac",
"/": "7ce3d7bd375cade58b10a122aa22e1ac",
"main.dart.js": "6e2020400bfedd74537148dcadc9bcdf",
"manifest.json": "24c2ea01bf6d4d4f996312bcdb6f0d3d",
"version.json": "22b2282f384198cd27b7b5fd0ab8aaa3"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
