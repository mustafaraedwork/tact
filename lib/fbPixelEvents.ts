/**
 * دوال مساعدة لإرسال أحداث Facebook Pixel من المتصفح
 */

// التحقق من وجود fbq
const isFbqAvailable = () => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

/**
 * تتبع مشاهدة محتوى (ViewContent)
 * يُستخدم عند مشاهدة تفاصيل مطبخ
 */
export const trackViewContent = (data: {
  content_name: string;
  content_type: string;
  content_ids?: string[];
  content_category?: string;
  value?: number;
  currency?: string;
}) => {
  if (!isFbqAvailable()) {
    console.warn('⚠️ Facebook Pixel not loaded');
    return;
  }

  window.fbq('track', 'ViewContent', {
    content_name: data.content_name,
    content_type: data.content_type,
    content_ids: data.content_ids || [],
    content_category: data.content_category || '',
    value: data.value || 0,
    currency: data.currency || 'IQD',
  });

  console.log('👁️ ViewContent tracked:', data.content_name);
};

/**
 * تتبع بدء عملية (InitiateCheckout)
 * يُستخدم عند بدء الكويز
 */
export const trackInitiateCheckout = (data: {
  content_name: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) => {
  if (!isFbqAvailable()) return;

  window.fbq('track', 'InitiateCheckout', {
    content_name: data.content_name,
    content_category: data.content_category || 'cost_calculator',
    value: data.value || 0,
    currency: data.currency || 'IQD',
  });

  console.log('🚀 InitiateCheckout tracked:', data.content_name);
};

/**
 * تتبع إضافة إلى السلة (AddToCart)
 * يُستخدم عند اختيار تصميم في الكويز
 */
export const trackAddToCart = (data: {
  content_name: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
}) => {
  if (!isFbqAvailable()) return;

  window.fbq('track', 'AddToCart', {
    content_name: data.content_name,
    content_ids: data.content_ids || [],
    content_type: data.content_type || 'product',
    value: data.value || 0,
    currency: data.currency || 'IQD',
  });

  console.log('🛒 AddToCart tracked:', data.content_name);
};

/**
 * تتبع البحث (Search)
 * يُستخدم عند البحث في المعرض
 */
export const trackSearch = (searchString: string) => {
  if (!isFbqAvailable()) return;

  window.fbq('track', 'Search', {
    search_string: searchString,
  });

  console.log('🔍 Search tracked:', searchString);
};

/**
 * تتبع حدث مخصص (Custom Event)
 */
export const trackCustomEvent = (eventName: string, data?: any) => {
  if (!isFbqAvailable()) return;

  window.fbq('trackCustom', eventName, data || {});

  console.log(`✨ Custom event tracked: ${eventName}`, data);
};