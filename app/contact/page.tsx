"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        governorate: "بغداد",
        region: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. حفظ البيانات في Supabase
            const { data: insertedData, error } = await supabase
                .from("contact_requests")
                .insert({
                    name: formData.name,
                    phone: formData.phone,
                    governorate: formData.governorate,
                    area: formData.region,
                    message: formData.message,
                    source: "contact_form",
                })
                .select()
                .single();

            if (error) throw error;

            // 2. إرسال حدث Contact إلى Meta Conversions API
            try {
                await fetch('/api/meta-events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        eventName: 'Contact',
                        eventSourceUrl: window.location.href,
                        userData: {
                            phone: formData.phone,
                            firstName: formData.name?.split(' ')[0],
                            lastName: formData.name?.split(' ').slice(1).join(' '),
                            city: formData.governorate,
                            country: 'iq',
                            externalId: insertedData?.id,
                        },
                        customData: {
                            content_name: 'Contact Form',
                            content_category: 'contact',
                        },
                    }),
                });
                console.log('✅ Meta Contact event sent successfully');
            } catch (metaError) {
                // لا نوقف العملية إذا فشل إرسال Meta
                console.error('⚠️ Meta event failed (non-critical):', metaError);
            }

            toast.success("تم استلام رسالتك بنجاح! سنتواصل معك قريباً.");
            
            // إعادة تعيين النموذج
            setFormData({
                name: "",
                phone: "",
                governorate: "بغداد",
                region: "",
                message: "",
            });
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-bg-secondary py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-dark mb-4 font-heading">
                            تواصل معنا
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            نحن هنا للإجابة على استفساراتك ومساعدتك في تحقيق مطبخ أحلامك
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card bg-white p-8">
                                <h3 className="text-xl font-bold mb-6 font-heading border-b pb-4">
                                    معلومات الاتصال
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">العنوان</h4>
                                            <p className="text-gray-600">بغداد - العامرية</p>
                                            <p className="text-gray-500 text-sm mt-1">شارع المنظمة</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">الهاتف</h4>
                                            <p className="text-gray-600 ltr-content">0771 333 5020</p>
                                            <p className="text-gray-600 ltr-content">0787 200 3399</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">البريد الإلكتروني</h4>
                                            <p className="text-gray-600 ltr-content">info@tactkitchen.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">أوقات العمل</h4>
                                            <p className="text-gray-600">مفتوح دائماً : 9:00 ص - 9:00 م</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="card bg-white p-2 h-64 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <MapPin size={20} />
                                        Google Maps Here
                                    </span>
                                </div>
                                {/* Add Google Maps Iframe here later */}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="card bg-white p-8">
                                <h3 className="text-xl font-bold mb-6 font-heading border-b pb-4">
                                    أرسل لنا رسالة
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                الاسم الكامل
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="أدخل اسمك"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                رقم الهاتف
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="input text-left"
                                                placeholder="07XX XXX XXXX"
                                                dir="ltr"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                المحافظة
                                            </label>
                                            <select
                                                name="governorate"
                                                value={formData.governorate}
                                                onChange={handleChange}
                                                className="input"
                                            >
                                                <option value="بغداد">بغداد</option>
                                                <option value="الأنبار">الأنبار</option>
                                                <option value="أربيل">أربيل</option>
                                                <option value="بابل">بابل</option>
                                                <option value="البصرة">البصرة</option>
                                                <option value="دهوك">دهوك</option>
                                                <option value="القادسية">القادسية</option>
                                                <option value="ديالى">ديالى</option>
                                                <option value="ذي قار">ذي قار</option>
                                                <option value="السليمانية">السليمانية</option>
                                                <option value="صلاح الدين">صلاح الدين</option>
                                                <option value="كركوك">كركوك</option>
                                                <option value="كربلاء">كربلاء</option>
                                                <option value="المثنى">المثنى</option>
                                                <option value="ميسان">ميسان</option>
                                                <option value="النجف">النجف</option>
                                                <option value="نينوى">نينوى</option>
                                                <option value="واسط">واسط</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                المنطقة
                                            </label>
                                            <input
                                                type="text"
                                                name="region"
                                                value={formData.region}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="أدخل اسم منطقتك"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الرسالة
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            className="input resize-none"
                                            placeholder="كيف يمكننا مساعدتك؟"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <span>جاري الإرسال...</span>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                <span>إرسال الرسالة</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}