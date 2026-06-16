const CACHE_NAME = 'egy-quran-v2';

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

// حدث التفعيل: مسح الكاش القديم إن وجد لضمان تحديث الموقع
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

// حدث الجلب (تم تحديثه لحل مشكلة السحب للأسفل / الريفريش)
self.addEventListener('fetch', (e) => {
    // لا نقم بتخزين ملفات الـ mp3 الصوتية في الكاش
    if (e.request.url.includes('.mp3')) {
        return; 
    }

    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then((cachedResponse) => {
            // 1. إذا كان الملف موجوداً في الكاش، قم بعرضه
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // 2. إذا لم يكن موجوداً، حاول جلبه من الإنترنت
            return fetch(e.request).catch(() => {
                // 3. (الحل) إذا انقطع الإنترنت والمستخدم يحاول عمل ريفريش، افتح له التطبيق من الكاش إجبارياً
                if (e.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});