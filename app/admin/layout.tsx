"use client";

// Force all admin pages to be dynamic - prevent static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard,
    Utensils,
    Image as ImageIcon,
    MessageSquare,
    Settings,
    Users,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
            }
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("تم تسجيل الخروج");
        router.push("/admin/login");
    };

    const navItems = [
        { name: "الرئيسية", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "المطابخ", href: "/admin/kitchens", icon: Utensils },
        { name: "صور الكويز", href: "/admin/quiz-images", icon: ImageIcon },
        { name: "الطلبات", href: "/admin/contacts", icon: MessageSquare },
        { name: "الإعدادات", href: "/admin/settings", icon: Settings },
        { name: "المستخدمين", href: "/admin/users", icon: Users },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-secondary flex">
            {/* Sidebar */}
            <aside
                className={`bg-dark text-white fixed inset-y-0 right-0 z-50 w-64 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    } lg:relative lg:translate-x-0`}
            >
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold">
                            T
                        </div>
                        <span className="font-bold text-xl font-heading">لوحة التحكم</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 w-full rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-600 hover:text-primary"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-4 mr-auto">
                        <div className="text-left">
                            <p className="font-bold text-dark text-sm">Admin User</p>
                            <p className="text-xs text-gray-500">المسؤول</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            <Users size={20} />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}