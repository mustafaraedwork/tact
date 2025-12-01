import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEvent } from '@/lib/metaConversions';

/**
 * API Route لإرسال الأحداث إلى Meta Conversions API
 * 
 * يستقبل طلبات POST من الـ frontend ويرسلها إلى Facebook
 * هذا يضمن أن Access Token لا يظهر أبداً في المتصفح
 */
export async function POST(request: NextRequest) {
  try {
    // قراءة البيانات من الطلب
    const body = await request.json();
    
    // التحقق من وجود البيانات المطلوبة
    if (!body.eventName) {
      return NextResponse.json(
        { success: false, error: 'Event name is required' },
        { status: 400 }
      );
    }

    console.log('📥 Received event request:', {
      event: body.eventName,
      hasUserData: !!body.userData,
      hasCustomData: !!body.customData,
    });

    // إرسال الحدث إلى Meta
    const result = await sendMetaEvent({
      eventName: body.eventName,
      eventSourceUrl: body.eventSourceUrl || request.headers.get('referer') || '',
      userData: body.userData || {},
      customData: body.customData || {},
    });

    // إرجاع النتيجة
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Event sent successfully',
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * معالج GET للتحقق من أن الـ API يعمل
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Meta Events API is running',
    timestamp: new Date().toISOString(),
  });
}