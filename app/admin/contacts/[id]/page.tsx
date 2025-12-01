"use client";

// Force dynamic rendering for this dynamic route
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, MessageCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ContactDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [designImages, setDesignImages] = useState<any[]>([]);

    useEffect(() => {
        const fetchRequest = async () => {
            const { data, error } = await supabase
                .from("contact_requests")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                toast.error("فشل تحميل الطلب");
                router.push("/admin/contacts");
            } else {
                setRequest(data);

                // Fetch selected design images
                if (data.selected_designs && data.selected_designs.length > 0) {
                    const { data: images } = await supabase
                        .from("quiz_selection_images")
                        .select("*")
                        .in("id", data.selected_designs);

                    if (images) setDesignImages(images);
                }

                // Mark as read automatically
                if (!data.is_read) {
                    await supabase
                        .from("contact_requests")
                        .update({ is_read: true })
                        .eq("id", id);
                }
            }
            setLoading(false);
        };

        fetchRequest();
    }, [id]);

    const translateKitchenType = (type: string) => {
        const types: Record<string, string> = {
            straight: "مستقيم (Straight)",
            L: "حرف L",
            U: "حرف U"
        };
        return types[type] || type;
    };

    const translateMaterial = (material: string) => {
        const materials: Record<string, string> = {
            hdf: "HDF",
            plywood: "بلايوود (Plywood)",
            acrylic: "أكريلك (Acrylic)"
        };
        return materials[material] || material;
    };

    if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
    if (!request) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/contacts" className="text-gray-500 hover:text-primary">
                    <ArrowRight size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-dark font-heading">تفاصيل الطلب</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card bg-white p-6">
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">معلومات العميل</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">الاسم</label>
                                <p className="font-bold text-lg">{request.name || "---"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">رقم الهاتف</label>
                                <p className="font-bold text-lg ltr-content text-right">{request.phone}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">المحافظة</label>
                                <p className="font-bold text-lg">{request.governorate}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">المصدر</label>
                                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-sm mt-1">
                                    {request.source === 'cost_calculator' ? 'حاسبة التكلفة' : request.source}
                                </span>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">تاريخ الطلب</label>
                                <p className="text-gray-700">
                                    {new Date(request.created_at).toLocaleString("ar-EG")}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <a
                                href={`https://wa.me/${request.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full flex items-center justify-center gap-2 !bg-[#25D366]"
                            >
                                <MessageCircle size={20} />
                                تواصل عبر واتساب
                            </a>
                        </div>
                    </div>
                </div>

                {/* Request Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card bg-white p-6">
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">تفاصيل الطلب</h3>

                        {request.source === "cost_calculator" ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500">شكل المطبخ</label>
                                        <p className="font-bold text-xl">{translateKitchenType(request.kitchen_type)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">المادة المفضلة</label>
                                        <p className="font-bold text-xl">{translateMaterial(request.material)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 mb-2 block">القياسات</label>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        {request.dimensions?.wall1 && <p>الضلع الأول: <strong>{request.dimensions.wall1} متر</strong></p>}
                                        {request.dimensions?.wall2 && <p>الضلع الثاني: <strong>{request.dimensions.wall2} متر</strong></p>}
                                        {request.dimensions?.wall3 && <p>الضلع الثالث: <strong>{request.dimensions.wall3} متر</strong></p>}
                                    </div>
                                </div>

                                {designImages.length > 0 && (
                                    <div>
                                        <label className="text-sm text-gray-500 mb-2 block">التصاميم المختارة ({designImages.length})</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {designImages.map((img) => (
                                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={img.image_url}
                                                        alt="Selected Design"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">الرسالة</label>
                                <p className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                                    {request.message || "لا توجد رسالة"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}