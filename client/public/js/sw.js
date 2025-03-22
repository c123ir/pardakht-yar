// سرویس ورکر غیرفعال - تمام درخواست‌ها به شبکه اصلی ارسال می‌شوند

console.log('سرویس ورکر جدید با موفقیت بارگذاری شد - این سرویس ورکر غیرفعال است');

// هیچ کشی انجام نمی‌شود
self.addEventListener('install', (event) => {
  console.log('سرویس ورکر غیرفعال نصب شد');
  self.skipWaiting();
});

// پاکسازی تمام کش‌های موجود
self.addEventListener('activate', (event) => {
  console.log('سرویس ورکر غیرفعال فعال شد');
  
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        console.log('پاک کردن کش:', key);
        return caches.delete(key);
      }));
    })
  );
  
  // کنترل تمام کلاینت‌ها بدون نیاز به بارگذاری مجدد
  self.clients.claim();
});

// تمام درخواست‌ها مستقیماً به شبکه ارسال می‌شوند
self.addEventListener('fetch', (event) => {
  console.log('درخواست از طریق سرویس ورکر غیرفعال:', event.request.url);
  
  // به‌جای استفاده از کش، مستقیماً از شبکه استفاده می‌کنیم
  event.respondWith(
    fetch(event.request).catch(error => {
      console.error('خطا در درخواست:', error);
      return new Response('سرویس ورکر غیرفعال است - خطا در ارتباط با سرور', { 
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
      });
    })
  );
});
