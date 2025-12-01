"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// تعريف نوع fbq عالمياً
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) {
      console.warn('⚠️ Facebook Pixel ID not found');
      return;
    }

    // تحميل Facebook Pixel Script
    if (typeof window !== 'undefined' && !window.fbq) {
      // @ts-ignore
      !(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );

      // تهيئة البكسل
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
      console.log('✅ Facebook Pixel initialized:', pixelId);
    }
  }, [pixelId]);

  useEffect(() => {
    // تتبع تغيير الصفحات
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      console.log('📄 PageView tracked:', pathname);
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* NoScript Fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}