const CACHE_NAME = 'egy-quran-v1';

// قائمة بجميع الملفات الأساسية التي نريد حفظها في ذاكرة الهاتف
const ASSETS = [
    '/',
    '/index.html',
    '/icon.png',
    '/manifest.json',
    '/hosary.jpg', '/minshawy.jpg', '/mustafa.jpg', '/banna.jpg', '/basit.jpg',
    '/husary_1.json', '/husary_2.json', '/husary_3.json', '/husary_4.json', '/husary_5.json',
    '/minshawi_1.json', '/minshawi_2.json',
    '/mustafa_1.json',
    '/banna_1.json',
    '/basit_1.json'
];

// حدث التثبيت: حفظ الملفات في الكاش
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// حدث التفعيل: مسح الكاش القديم إن وجد لضمان تحديث الموقع دائماً
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// حدث الجلب: عرض الملفات من الكاش في حال انقطاع الإنترنت
self.addEventListener('fetch', (e) => {
    // لا نقم بتخزين ملفات الـ mp3 الصوتية في الكاش حتى لا تمتلىء ذاكرة هاتف المستخدم
    if (e.request.url.includes('.mp3')) {
        return; 
    }

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // إذا كان الملف موجوداً في الكاش، قم بعرضه، وإلا قم بجلبه من الإنترنت
            return cachedResponse || fetch(e.request);
        })
    );
});