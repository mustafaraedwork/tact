"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const trackVisit = async () => {
            try {
                await supabase.from("page_visits").insert({
                    page_path: pathname,
                    user_agent: window.navigator.userAgent,
                });
            } catch (error) {
                console.error("Error tracking visit:", error);
            }
        };

        trackVisit();
    }, [pathname]);

    return null;
}
