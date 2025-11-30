"use client";

import { useQuizStore } from "@/store/quizStore";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Step4Material() {
    const { material, setMaterial, nextStep, prevStep } = useQuizStore();
    const [materialImages, setMaterialImages] = useState<Record<string, string>>({});

    const materials = [
        {
            id: "hdf",
            title: "HDF",
            description: "متين واقتصادي",
            features: ["مقاوم للخدش", "ألوان متعددة", "سعر مناسب"],
        },
        {
            id: "plywood",
            title: "بلايوود (Plywood)",
            description: "قوي ومقاوم للرطوبة",
            features: ["مقاوم للماء", "عمر طويل", "تحمل عالي"],
        },
        {
            id: "acrylic",
            title: "أكريلك (Acrylic)",
            description: "فاخر وعصري",
            features: ["لمعان عالي", "سهل التنظيف", "مظهر زجاجي"],
        },
    ] as const;

    useEffect(() => {
        const fetchImages = async () => {
            const { data } = await supabase
                .from('quiz_selection_images')
                .select('*')
                .eq('category', 'material')
                .eq('is_active', true);

            if (data) {
                const imageMap: Record<string, string> = {};
                data.forEach(img => {
                    // Try to match image title to material ID or Title
                    const title = img.title?.toLowerCase();
                    if (title?.includes('hdf')) imageMap['hdf'] = img.image_url;
                    else if (title?.includes('plywood') || title?.includes('بلايوود')) imageMap['plywood'] = img.image_url;
                    else if (title?.includes('acrylic') || title?.includes('أكريلك')) imageMap['acrylic'] = img.image_url;
                });
                setMaterialImages(imageMap);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 font-heading">ما هي المادة المفضلة لديك؟</h2>
                <p className="text-gray-500">اختر نوع الخشب أو الخامة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {materials.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMaterial(item.id)}
                        className={`relative p-6 rounded-xl border-2 transition-all text-right ${material === item.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-primary/50 bg-white"
                            }`}
                    >
                        {material === item.id && (
                            <div className="absolute top-4 left-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center z-10">
                                <Check size={14} />
                            </div>
                        )}

                        <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                            {materialImages[item.id] ? (
                                <img
                                    src={materialImages[item.id]}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                    <span className="text-xl font-bold">{item.title}</span>
                                </div>
                            )}
                        </div>

                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{item.description}</p>

                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                            {item.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    </motion.button>
                ))}
            </div>

            <div className="flex justify-between pt-8">
                <button onClick={prevStep} className="btn-secondary">
                    السابق
                </button>
                <button
                    onClick={nextStep}
                    disabled={!material}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    التالي
                </button>
            </div>
        </div>
    );
}
