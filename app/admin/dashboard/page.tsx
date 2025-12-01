"use client";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Utensils, Users, Eye } from "lucide-react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function DashboardHome() {
    const [stats, setStats] = useState({
        totalRequests: 0,
        newRequests: 0,
        totalKitchens: 0,
        totalViews: 0,
    });
    const [recentRequests, setRecentRequests] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            // Fetch total requests
            const { count: totalRequests } = await supabase
                .from("contact_requests")
                .select("*", { count: "exact", head: true });

            // Fetch new requests
            const { count: newRequests } = await supabase
                .from("contact_requests")
                .select("*", { count: "exact", head: true })
                .eq("is_read", false);

            // Fetch total kitchens
            const { count: totalKitchens } = await supabase
                .from("kitchens")
                .select("*", { count: "exact", head: true });

            // Fetch recent requests
            const { data: requests } = await supabase
                .from("contact_requests")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            // Fetch total views
            const { count: totalViews } = await supabase
                .from("page_visits")
                .select("*", { count: "exact", head: true });

            setStats({
                totalRequests: totalRequests || 0,
                newRequests: newRequests || 0,
                totalKitchens: totalKitchens || 0,
                totalViews: totalViews || 0,
            });

            setRecentRequests(requests || []);
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "الطلبات الجديدة",
            value: stats.newRequests,
            icon: MessageSquare,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "إجمالي الطلبات",
            value: stats.totalRequests,
            icon: Users,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "عدد المطابخ",
            value: stats.totalKitchens,
            icon: Utensils,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
        {
            title: "الزيارات",
            value: stats.totalViews,
            icon: Eye,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
    ];

    const chartData = [
        { name: "السبت", requests: 4 },
        { name: "الأحد", requests: 3 },
        { name: "الاثنين", requests: 7 },
        { name: "الثلاثاء", requests: 5 },
        { name: "الأربعاء", requests: 8 },
        { name: "الخميس", requests: 6 },
        { name: "الجمعة", requests: 2 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-dark font-heading">
                لوحة التحكم الرئيسية
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card bg-white p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-dark">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Requests */}
            <div className="card bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold font-heading">آخر الطلبات</h2>
                    <Link href="/admin/contacts" className="text-sm text-primary hover:underline">
                        عرض الكل
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentRequests.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">لا توجد طلبات حديثة</p>
                    ) : (
                        recentRequests.map((req) => (
                            <div key={req.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                    {req.name ? req.name[0] : "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-dark truncate">
                                        {req.name || "بدون اسم"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate ltr-content text-right">
                                        {req.phone}
                                    </p>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(req.created_at).toLocaleDateString("ar-EG")}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
