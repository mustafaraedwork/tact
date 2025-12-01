"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [companyInfo, setCompanyInfo] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        working_hours: "",
        facebook_url: "",
        instagram_url: "",
        youtube_url: "",
    });
    const [governorates, setGovernorates] = useState<any[]>([]);
    const [newGov, setNewGov] = useState("");

    const fetchData = async () => {
        setLoading(true);
        // Fetch Company Info
        const { data: info } = await supabase.from("company_info").select("*").single();
        if (info) setCompanyInfo(info);

        // Fetch Governorates
        const { data: govs } = await supabase.from("governorates").select("*").order("name_ar");
        if (govs) setGovernorates(govs);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
    };

    const saveInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from("company_info")
            .update(companyInfo)
            .eq("id", companyInfo.id);

        if (error) toast.error("فشل حفظ المعلومات");
        else toast.success("تم حفظ المعلومات بنجاح");
    };

    const addGovernorate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGov.trim()) return;

        const { error } = await supabase.from("governorates").insert({ name_ar: newGov });
        if (error) toast.error("فشل الإضافة");
        else {
            toast.success("تم الإضافة");
            setNewGov("");
            fetchData();
        }
    };

    const deleteGovernorate = async (id: string) => {
        if (!confirm("حذف هذه المحافظة؟")) return;
        const { error } = await supabase.from("governorates").delete().eq("id", id);
        if (error) toast.error("فشل الحذف");
        else {
            toast.success("تم الحذف");
            fetchData();
        }
    };

    if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-dark font-heading">الإعدادات العامة</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Company Info */}
                <div className="card bg-white p-6">
                    <h2 className="text-xl font-bold mb-6 font-heading">معلومات الشركة</h2>
                    <form onSubmit={saveInfo} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشركة</label>
                            <input
                                type="text"
                                name="name"
                                value={companyInfo.name || ""}
                                onChange={handleInfoChange}
                                className="input"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={companyInfo.phone || ""}
                                    onChange={handleInfoChange}
                                    className="input"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={companyInfo.email || ""}
                                    onChange={handleInfoChange}
                                    className="input"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                            <input
                                type="text"
                                name="address"
                                value={companyInfo.address || ""}
                                onChange={handleInfoChange}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">أوقات العمل</label>
                            <input
                                type="text"
                                name="working_hours"
                                value={companyInfo.working_hours || ""}
                                onChange={handleInfoChange}
                                className="input"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 space-y-4">
                            <h3 className="font-bold text-sm text-gray-500">روابط التواصل الاجتماعي</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                <input
                                    type="url"
                                    name="facebook_url"
                                    value={companyInfo.facebook_url || ""}
                                    onChange={handleInfoChange}
                                    className="input"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                <input
                                    type="url"
                                    name="instagram_url"
                                    value={companyInfo.instagram_url || ""}
                                    onChange={handleInfoChange}
                                    className="input"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                                <input
                                    type="url"
                                    name="youtube_url"
                                    value={companyInfo.youtube_url || ""}
                                    onChange={handleInfoChange}
                                    className="input"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                            <Save size={20} />
                            <span>حفظ التغييرات</span>
                        </button>
                    </form>
                </div>

                {/* Governorates */}
                <div className="card bg-white p-6 h-fit">
                    <h2 className="text-xl font-bold mb-6 font-heading">المحافظات المدعومة</h2>

                    <form onSubmit={addGovernorate} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newGov}
                            onChange={(e) => setNewGov(e.target.value)}
                            placeholder="اسم المحافظة"
                            className="input"
                        />
                        <button type="submit" className="btn-primary px-4">
                            <Plus size={24} />
                        </button>
                    </form>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {governorates.map((gov) => (
                            <div key={gov.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">{gov.name_ar}</span>
                                <button
                                    onClick={() => deleteGovernorate(gov.id)}
                                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
