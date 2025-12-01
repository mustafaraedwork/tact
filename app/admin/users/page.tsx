"use client";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Shield, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        // Note: Supabase client-side cannot list all users from auth.users easily without admin API.
        // We will use the 'admin_users' table we created in schema.sql to track them.
        const { data, error } = await supabase.from("admin_users").select("*");
        if (error) toast.error("فشل تحميل المستخدمين");
        else setUsers(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Sign up the user (This requires Supabase Auth to be configured to allow signups or use service role)
        // For this demo, we'll assume we can just add to our tracking table, 
        // but in reality you'd need to use supabase.auth.signUp() and handle the confirmation email flow
        // or use a backend function with service_role key to create users directly.

        // Simplified for prototype: Just adding to the table to show UI
        const { error } = await supabase.from("admin_users").insert({
            email,
            role: "admin"
        });

        if (error) {
            toast.error("فشل إضافة المستخدم");
        } else {
            toast.success("تم إضافة المستخدم (محاكاة)");
            setEmail("");
            setPassword("");
            setIsAdding(false);
            fetchUsers();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-dark font-heading">المستخدمين والصلاحيات</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>إضافة مستخدم</span>
                </button>
            </div>

            {isAdding && (
                <div className="card bg-white p-6 mb-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold mb-4">إضافة مستخدم جديد</h3>
                    <form onSubmit={handleAddUser} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">
                            حفظ
                        </button>
                    </form>
                </div>
            )}

            <div className="card bg-white overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-right p-4 font-bold text-gray-600">المستخدم</th>
                            <th className="text-right p-4 font-bold text-gray-600">البريد الإلكتروني</th>
                            <th className="text-right p-4 font-bold text-gray-600">الدور</th>
                            <th className="text-right p-4 font-bold text-gray-600">تاريخ الإضافة</th>
                            <th className="text-center p-4 font-bold text-gray-600">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-medium">{user.email}</td>
                                <td className="p-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                                        <Shield size={12} /> {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(user.created_at).toLocaleDateString("ar-EG")}
                                </td>
                                <td className="p-4 text-center">
                                    <button className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
