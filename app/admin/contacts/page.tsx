"use client";

// Force dynamic rendering - disable static generation for admin pages
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Phone, CheckCircle, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface ContactRequest {
    id: string;
    name: string;
    phone: string;
    governorate: string;
    source: string;
    is_read: boolean;
    created_at: string;
}

export default function AdminContactsPage() {
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, unread

    const fetchRequests = async () => {
        setLoading(true);
        let query = supabase
            .from("contact_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (filter === "unread") {
            query = query.eq("is_read", false);
        }

        const { data, error } = await query;

        if (error) {
            toast.error("فشل تحميل الطلبات");
        } else {
            setRequests(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from("contact_requests")
            .update({ is_read: true })
            .eq("id", id);

        if (error) toast.error("فشل التحديث");
        else {
            toast.success("تم التحديث");
            fetchRequests();
        }
    };



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-dark font-heading">طلبات التواصل</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "all" ? "bg-primary text-white" : "bg-white text-gray-600"
                            }`}
                    >
                        الكل
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "unread" ? "bg-primary text-white" : "bg-white text-gray-600"
                            }`}
                    >
                        غير مقروء
                    </button>
                </div>
            </div>

            <div className="card bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-right p-4 font-bold text-gray-600">الاسم</th>
                                <th className="text-right p-4 font-bold text-gray-600">رقم الهاتف</th>
                                <th className="text-right p-4 font-bold text-gray-600">المحافظة</th>
                                <th className="text-right p-4 font-bold text-gray-600">المصدر</th>
                                <th className="text-right p-4 font-bold text-gray-600">التاريخ</th>
                                <th className="text-center p-4 font-bold text-gray-600">الحالة</th>
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
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        لا توجد طلبات
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className={`hover:bg-gray-50 transition-colors ${!req.is_read ? "bg-blue-50/50" : ""}`}>
                                        <td className="p-4 font-medium">{req.name || "---"}</td>
                                        <td className="p-4 ltr-content text-right">{req.phone}</td>
                                        <td className="p-4">{req.governorate}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${req.source === 'cost_calculator' ? 'bg-purple-100 text-purple-700' :
                                                req.source === 'contact_form' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {req.source === 'cost_calculator' ? 'حاسبة التكلفة' :
                                                    req.source === 'contact_form' ? 'نموذج التواصل' : req.source}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(req.created_at).toLocaleDateString("ar-EG")}
                                        </td>
                                        <td className="p-4 text-center">
                                            {req.is_read ? (
                                                <span className="text-green-600 text-xs font-bold flex items-center justify-center gap-1">
                                                    <CheckCircle size={14} /> مقروء
                                                </span>
                                            ) : (
                                                <span className="text-blue-600 text-xs font-bold flex items-center justify-center gap-1">
                                                    <MessageSquare size={14} /> جديد
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/contacts/${req.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="عرض التفاصيل"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                {!req.is_read && (
                                                    <button
                                                        onClick={() => markAsRead(req.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="تحديد كمقروء"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
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