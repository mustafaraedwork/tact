# دليل رفع المشروع على Vercel

إليك خطوات رفع مشروعك (Next.js) على استضافة Vercel بالتفصيل:

## 1. رفع الكود على GitHub
قبل البدء مع Vercel، يجب أن يكون كود المشروع مرفوعاً على مستودع (Repository) في GitHub.
1. أنشئ مستودعاً جديداً (New Repository) على حسابك في GitHub.
2. ارفع ملفات المشروع إلى هذا المستودع.

## 2. إنشاء مشروع جديد في Vercel
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard) وسجل الدخول.
2. اضغط على زر **"Add New..."** ثم اختر **"Project"**.
3. ستظهر لك قائمة بمستودعات GitHub الخاصة بك. اضغط على زر **"Import"** بجانب اسم مستودع مشروعك (TACT).

## 3. إعداد المتغيرات البيئية (Environment Variables)
هذه الخطوة **مهمة جداً** لكي يعمل الاتصال بقاعدة البيانات (Supabase).
في صفحة الإعداد (Configure Project)، ستجد قسماً اسمه **Environment Variables**.
عليك إضافة المتغيرات الموجودة في ملف `.env.local` لديك، وهي عادة:

| الاسم (Name) | القيمة (Value) |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase الخاص بك |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | مفتاح الـ Anon Key الخاص بـ Supabase |

*قم بنسخ القيم من ملف `.env.local` في جهازك وأضفها واحدة تلو الأخرى.*

## 4. النشر (Deploy)
1. بعد إضافة المتغيرات، اضغط على زر **"Deploy"**.
2. سيبدأ Vercel في بناء المشروع (Build). انتظر دقيقة أو دقيقتين.
3. عند الانتهاء، ستظهر لك شاشة تهنئة ورابط الموقع الجديد (مثلاً: `tact-kitchens.vercel.app`).

## 5. تحديث إعدادات Supabase (هام)
بعد الحصول على رابط الموقع الجديد (Domain) من Vercel:
1. اذهب إلى لوحة تحكم **Supabase**.
2. انتقل إلى **Authentication** -> **URL Configuration**.
3. أضف رابط موقعك الجديد في حقل **Site URL** أو في **Redirect URLs**.
   - هذا ضروري لكي تعمل عمليات تسجيل الدخول (Auth) بشكل صحيح إذا كنت تستخدمها.

---
**ملاحظة:** أي تعديل ترفعه مستقبلاً على GitHub سيقوم Vercel بسحبه ونشره تلقائياً (Automatic Deployment).

## 6. ربط الدومين من Hostinger
إذا كان لديك دومين محجوز على Hostinger (مثلاً `example.com`) وتريد ربطه بمشروعك في Vercel:

1. **إعدادات Vercel:**
   - اذهب إلى مشروعك في Vercel.
   - انتقل إلى **Settings** -> **Domains**.
   - اكتب اسم الدومين الخاص بك (مثلاً `example.com`) واضغط **Add**.
   - سيظهر لك Vercel قيمتين مهمتين:
     - **A Record**: عادةً القيمة هي `76.76.21.21`
     - **CNAME Record**: (لـ www) القيمة هي `cname.vercel-dns.com`

2. **إعدادات Hostinger:**
   - اذهب إلى لوحة تحكم Hostinger.
   - اختر الدومين ثم انتقل إلى **DNS / Name Servers**.
   - **حذف السجلات القديمة:** ابحث عن أي سجل من نوع `A` يشير إلى `@` وقم بحذفه (إذا كان موجوداً).
   - **إضافة السجل الجديد (A Record):**
     - Type: `A`
     - Name: `@`
     - Points to: `76.76.21.21` (أو القيمة التي أعطاك إياها Vercel)
     - TTL: اتركها كما هي (مثلاً 14400)
   - **إضافة سجل (CNAME Record):**
     - Type: `CNAME`
     - Name: `www`
     - Points to: `cname.vercel-dns.com`
   - اضغط **Add Record**.

3. **الانتظار:** قد يستغرق تحديث الـ DNS من بضع دقائق إلى 24 ساعة. سيتحول المؤشر في Vercel إلى اللون الأخضر عند النجاح.

## 7. ربط Meta Conversions API (Facebook CAPI)
لربط الـ Conversions API لضمان دقة تتبع الأحداث (مثل إرسال النماذج):

### الخطوة 1: الحصول على البيانات من فيسبوك
1. اذهب إلى **Facebook Events Manager**.
2. اختر الـ Pixel الخاص بك.
3. اذهب إلى **Settings**.
4. انزل لأسفل إلى قسم **Conversions API**.
5. اضغط على **Generate Access Token**. انسخ هذا الكود.
6. انسخ أيضاً **Pixel ID**.

### الخطوة 2: إضافة المتغيرات في Vercel
1. في Vercel، اذهب إلى **Settings** -> **Environment Variables**.
2. أضف المتغيرات التالية:
   - `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`: (ضع رقم البيكسل هنا)
   - `FACEBOOK_ACCESS_TOKEN`: (ضع التوكن الطويل الذي نسخته هنا)

### الخطوة 3: التنفيذ البرمجي (مثال)
لإرسال حدث (Event) من السيرفر (Server-Side) عند نجاح إرسال النموذج، يمكنك استخدام دالة مثل هذه في الـ API Route الخاص بك:

```typescript
// مثال دالة لإرسال حدث Lead
async function sendMetaEvent(userData: any) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const token = process.env.FACEBOOK_ACCESS_TOKEN;
  
  const body = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          ph: [hash(userData.phone)], // يجب تشفير البيانات بـ SHA256
          // يمكن إضافة المزيد من البيانات مثل الإيميل والمدينة
        }
      }
    ]
  };

  await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}
```
*ملاحظة: يفضل استخدام مكتبة جاهزة مثل `facebook-nodejs-business-sdk` لتسهيل التعامل مع التشفير والبيانات.*

