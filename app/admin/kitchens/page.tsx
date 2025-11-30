"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Edit, Trash2, Image as ImageIcon, Video } from "lucide-react";
import toast from "react-hot-toast";

interface Kitchen {
    id: string;
    title: string;
    material: string;
    kitchen_type: string;
    is_featured: boolean;
    kitchen_images: { count: number }[];
    kitchen_videos: { count: number }[];
}

export default function AdminKitchensPage() {
    const [kitchens, setKitchens] = useState<Kitchen[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchKitchens = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("kitchens")
            .select(`
        *,
        kitchen_images (count),
        kitchen_videos (count)
      `)
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("حدث خطأ أثناء جلب البيانات");
        } else {
            setKitchens(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchKitchens();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا المطبخ؟")) return;

        const { error } = await supabase.from("kitchens").delete().eq("id", id);

        if (error) {
            toast.error("فشل الحذف");
        } else {
            toast.success("تم الحذف بنجاح");
            fetchKitchens();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-dark font-heading">إدارة المطابخ</h1>
                <Link href="/admin/kitchens/new" className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    <span>إضافة مطبخ جديد</span>
                </Link>
            </div>

            <div className="card bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-right p-4 font-bold text-gray-600">العنوان</th>
                                <th className="text-right p-4 font-bold text-gray-600">المادة</th>
                                <th className="text-right p-4 font-bold text-gray-600">التصميم</th>
                                <th className="text-center p-4 font-bold text-gray-600">الصور</th>
                                <th className="text-center p-4 font-bold text-gray-600">الفيديوهات</th>
                                <th className="text-center p-4 font-bold text-gray-600">مميز</th>
                                <th className="text-center p-4 font-bold text-gray-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        جاري التحميل...
                                    </td>
                                </tr>
                            ) : kitchens.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        لا توجد مطابخ مضافة حالياً
                                    </td>
                                </tr>
                            ) : (
                                kitchens.map((kitchen) => (
                                    <tr key={kitchen.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium">{kitchen.title}</td>
                                        <td className="p-4 text-gray-600">{kitchen.material}</td>
                                        <td className="p-4 text-gray-600">{kitchen.kitchen_type}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1 text-gray-500">
                                                <ImageIcon size={16} />
                                                <span>{kitchen.kitchen_images[0]?.count || 0}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1 text-gray-500">
                                                <Video size={16} />
                                                <span>{kitchen.kitchen_videos[0]?.count || 0}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {kitchen.is_featured ? (
                                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full" />
                                            ) : (
                                                <span className="inline-block w-3 h-3 bg-gray-300 rounded-full" />
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/kitchens/${kitchen.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(kitchen.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
