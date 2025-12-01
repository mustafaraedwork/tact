"use client";

import { useQuizStore } from "@/store/quizStore";
import { useState, useEffect } from "react";
import { Phone, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Step6Contact() {
    const store = useQuizStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [governorates, setGovernorates] = useState<{ id: string; name_ar: string }[]>([]);

    useEffect(() => {
        const fetchGovernorates = async () => {
            const { data } = await supabase
                .from("governorates")
                .select("id, name_ar")
                .order("display_order");
            if (data) setGovernorates(data);
        };
        fetchGovernorates();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate Iraqi Phone
        const phoneRegex = /^07[3-9]\d{8}$/;
        const cleanPhone = store.phone.replace(/\s/g, '');

        if (!phoneRegex.test(cleanPhone)) {
            toast.error("يرجى إدخال رقم هاتف عراقي صحيح (07XXXXXXXX)");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from("contact_requests").insert({
                phone: cleanPhone,
                kitchen_type: store.kitchenType,
                dimensions: store.dimensions,
                selected_designs: store.selectedDesigns,
                material: store.material,
                source: "cost_calculator",
                governorate: store.governorate,
            });

            if (error) throw error;

            setIsSuccess(true);
            toast.success("تم إرسال طلبك بنجاح!");
        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-12 space-y-6">
                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success mb-6">
                    <CheckCircle2 size={48} />
                </div>

                <h2 className="text-3xl font-bold text-dark font-heading">شكراً لك!</h2>
                <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
                    تم استلام طلبك بنجاح. سيتواصل معك فريق TACT قريباً عبر الواتساب لإخبارك بتكلفة مطبخك بالتفصيل.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Link href="/" className="btn-primary">
                        العودة للصفحة الرئيسية
                    </Link>
                    <Link href="/gallery" className="btn-secondary">
                        تصفح معرض أعمالنا
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 font-heading">نحن على بُعد خطوة واحدة!</h2>
                <p className="text-gray-500">أدخل معلوماتك لنرسل لك التكلفة</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        المحافظة
                    </label>
                    <select
                        value={store.governorate}
                        onChange={(e) => store.setGovernorate(e.target.value)}
                        className="input w-full"
                    >
                        {governorates.map((gov) => (
                            <option key={gov.id} value={gov.name_ar}>
                                {gov.name_ar}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف (واتساب)
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            value={store.phone}
                            onChange={(e) => store.setPhone(e.target.value)}
                            className="input pl-12 text-left"
                            placeholder="07XX XXX XXXX"
                            dir="ltr"
                            required
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Phone size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-left ltr-content">
                        Format: 07XX XXX XXXX
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !store.phone}
                    className="btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                </button>
            </form>
        </div>
    );
}
