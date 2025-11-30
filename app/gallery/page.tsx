"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Image as ImageIcon, Video, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Kitchen {
    id: string;
    title: string;
    material: string;
    kitchen_type: string;
    kitchen_images: { image_url: string }[];
    kitchen_videos: { id: string }[];
}

export default function GalleryPage() {
    const [kitchens, setKitchens] = useState<Kitchen[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKitchens = async () => {
            try {
                const { data, error } = await supabase
                    .from("kitchens")
                    .select(`
            *,
            kitchen_images (image_url),
            kitchen_videos (id)
          `)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setKitchens(data || []);
            } catch (error) {
                console.error("Error fetching kitchens:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchKitchens();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-bg-secondary py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-dark mb-4 font-heading">
                            معرض أعمالنا
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            تصفح مجموعة من أحدث المطابخ التي قمنا بتنفيذها بدقة وإتقان
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="card h-96 animate-pulse bg-gray-200" />
                            ))}
                        </div>
                    ) : kitchens.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">لا توجد أعمال لعرضها حالياً</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {kitchens.map((kitchen, index) => (
                                <motion.div
                                    key={kitchen.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/gallery/${kitchen.id}`} className="group block h-full">
                                        <div className="card h-full p-0 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                                            {/* Image Container */}
                                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                                {kitchen.kitchen_images?.[0] ? (
                                                    <img
                                                        src={kitchen.kitchen_images[0].image_url}
                                                        alt={kitchen.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ImageIcon size={48} />
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="absolute bottom-4 right-4 flex gap-2">
                                                    {kitchen.kitchen_images?.length > 0 && (
                                                        <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                                            <ImageIcon size={12} />
                                                            <span>{kitchen.kitchen_images.length}</span>
                                                        </div>
                                                    )}
                                                    {kitchen.kitchen_videos?.length > 0 && (
                                                        <div className="bg-red-600/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                                            <Video size={12} />
                                                            <span>{kitchen.kitchen_videos.length}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex-grow flex flex-col">
                                                <h3 className="text-xl font-bold text-dark mb-2 font-heading group-hover:text-primary transition-colors">
                                                    {kitchen.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {kitchen.material && (
                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                            {kitchen.material}
                                                        </span>
                                                    )}
                                                    {kitchen.kitchen_type && (
                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                            {kitchen.kitchen_type}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-auto flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                                                    <span>عرض التفاصيل</span>
                                                    <ArrowLeft size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
