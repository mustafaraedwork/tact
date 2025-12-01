"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/dashboard");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
