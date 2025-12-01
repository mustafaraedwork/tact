import crypto from 'crypto';

/**
 * تشفير البيانات بـ SHA256 (مطلوب من فيسبوك)
 * Facebook يتطلب تشفير جميع بيانات المستخدمين
 */
export function hashData(data: string): string {
  if (!data) return '';
  return crypto
    .createHash('sha256')
    .update(data.toLowerCase().trim())
    .digest('hex');
}

/**
 * تنظيف رقم الهاتف العراقي وتحويله للصيغة الدولية
 * مثال: 0770 123 4567 → 9647701234567
 */
export function normalizePhone(phone: string): string {
  // إزالة كل شيء ما عدا الأرقام
  let cleaned = phone.replace(/\D/g, '');
  
  // إضافة كود العراق (964) إذا بدأ بـ 07
  if (cleaned.startsWith('07')) {
    cleaned = '964' + cleaned.substring(1);
  }
  
  // إضافة 964 إذا لم يكن موجوداً
  if (!cleaned.startsWith('964')) {
    cleaned = '964' + cleaned;
  }
  
  return cleaned;
}

/**
 * واجهة بيانات الحدث (Event Data)
 */
interface MetaEventData {
  eventName: string;                    // اسم الحدث: Lead, Contact, ViewContent, إلخ
  eventSourceUrl: string;               // رابط الصفحة التي حدث فيها الحدث
  userData: {
    phone?: string;                     // رقم الهاتف
    email?: string;                     // البريد الإلكتروني
    firstName?: string;                 // الاسم الأول
    lastName?: string;                  // الاسم الأخير
    city?: string;                      // المدينة/المحافظة
    country?: string;                   // الدولة (iq للعراق)
    externalId?: string;                // معرّف فريد (مثل ID من قاعدة البيانات)
  };
  customData?: {                        // بيانات مخصصة إضافية
    value?: number;                     // القيمة المالية
    currency?: string;                  // العملة (IQD)
    content_name?: string;              // اسم المحتوى
    content_category?: string;          // فئة المحتوى
    [key: string]: any;                 // أي بيانات أخرى
  };
}

/**
 * إرسال حدث إلى Meta Conversions API
 * هذه الدالة ترسل البيانات من السيرفر إلى فيسبوك مباشرة
 */
export async function sendMetaEvent(data: MetaEventData) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const testEventCode = process.env.FACEBOOK_TEST_EVENT_CODE;

  // التحقق من وجود البيانات المطلوبة
  if (!pixelId || !accessToken) {
    console.error('❌ Missing Facebook Pixel ID or Access Token');
    console.error('Please check your .env.local file');
    return { success: false, error: 'Missing credentials' };
  }

  // تجهيز بيانات المستخدم مع التشفير
  const hashedUserData: any = {};
  
  // تشفير رقم الهاتف
  if (data.userData.phone) {
    const normalizedPhone = normalizePhone(data.userData.phone);
    hashedUserData.ph = [hashData(normalizedPhone)];
    console.log('📱 Phone normalized:', normalizedPhone);
  }
  
  // تشفير البريد الإلكتروني
  if (data.userData.email) {
    hashedUserData.em = [hashData(data.userData.email)];
  }
  
  // تشفير الاسم الأول
  if (data.userData.firstName) {
    hashedUserData.fn = [hashData(data.userData.firstName)];
  }
  
  // تشفير الاسم الأخير
  if (data.userData.lastName) {
    hashedUserData.ln = [hashData(data.userData.lastName)];
  }
  
  // تشفير المدينة/المحافظة
  if (data.userData.city) {
    hashedUserData.ct = [hashData(data.userData.city)];
  }
  
  // تشفير الدولة
  if (data.userData.country) {
    hashedUserData.country = [hashData(data.userData.country)];
  }

  // تشفير المعرّف الخارجي
  if (data.userData.externalId) {
    hashedUserData.external_id = [hashData(data.userData.externalId)];
  }

  // بناء الـ payload (الحمولة) للإرسال
  const payload = {
    data: [
      {
        event_name: data.eventName,                           // اسم الحدث
        event_time: Math.floor(Date.now() / 1000),          // الوقت (Unix timestamp)
        event_source_url: data.eventSourceUrl,               // رابط الصفحة
        action_source: 'website',                            // المصدر: موقع إلكتروني
        user_data: hashedUserData,                           // بيانات المستخدم المُشفّرة
        custom_data: data.customData || {},                  // البيانات المخصصة
      },
    ],
    // إضافة كود الاختبار إذا كان موجوداً (للتطوير فقط)
    ...(testEventCode && { test_event_code: testEventCode }),
  };

  console.log('📤 Sending event to Meta:', {
    event: data.eventName,
    url: data.eventSourceUrl,
    hasPhone: !!data.userData.phone,
    hasCity: !!data.userData.city,
  });

  try {
    // إرسال الطلب إلى Facebook Graph API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    
    // التحقق من نجاح الطلب
    if (!response.ok) {
      console.error('❌ Meta CAPI Error:', result);
      return { success: false, error: result };
    }

    console.log('✅ Meta CAPI Success:', result);
    console.log('📊 Events received:', result.events_received);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Meta CAPI Request Failed:', error);
    return { success: false, error };
  }
}

/**
 * دالة مساعدة لإرسال حدث Lead (طلب تواصل)
 */
export async function sendLeadEvent(data: {
  phone: string;
  governorate?: string;
  kitchenType?: string;
  material?: string;
  externalId?: string;
  pageUrl: string;
}) {
  return sendMetaEvent({
    eventName: 'Lead',
    eventSourceUrl: data.pageUrl,
    userData: {
      phone: data.phone,
      city: data.governorate,
      country: 'iq',
      externalId: data.externalId,
    },
    customData: {
      content_name: 'Kitchen Cost Calculator',
      content_category: 'cost_calculator',
      kitchen_type: data.kitchenType,
      material: data.material,
      currency: 'IQD',
    },
  });
}

/**
 * دالة مساعدة لإرسال حدث Contact (تواصل عام)
 */
export async function sendContactEvent(data: {
  phone: string;
  name?: string;
  governorate?: string;
  externalId?: string;
  pageUrl: string;
}) {
  return sendMetaEvent({
    eventName: 'Contact',
    eventSourceUrl: data.pageUrl,
    userData: {
      phone: data.phone,
      firstName: data.name?.split(' ')[0],
      lastName: data.name?.split(' ').slice(1).join(' '),
      city: data.governorate,
      country: 'iq',
      externalId: data.externalId,
    },
    customData: {
      content_name: 'Contact Form',
      content_category: 'contact',
    },
  });
}