import { Suspense } from "react";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AdminLayoutClient>{children}</AdminLayoutClient>
        </Suspense>
    );
}
