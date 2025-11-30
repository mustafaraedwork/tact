"use client";

import { useQuizStore } from "@/store/quizStore";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Step1Shape() {
    const { kitchenType, setKitchenType, nextStep } = useQuizStore();
    const [shapeImages, setShapeImages] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchShapeImages = async () => {
            const { data } = await supabase
                .from("quiz_selection_images")
                .select("title, image_url")
                .eq("category", "shape");

            if (data) {
                const images: Record<string, string> = {};
                data.forEach(img => {
                    images[img.title] = img.image_url;
                });
                setShapeImages(images);
            }
        };
        fetchShapeImages();
    }, []);

    const shapes = [
        {
            id: "straight",
            title: "مطبخ مستقيم",
            description: "مثالي للمساحات الضيقة",
            image: shapeImages["straight"] || "/images/straight.svg",
        },
        {
            id: "L",
            title: "مطبخ حرف L",
            description: "يوفر مساحة تخزين أكبر",
            image: shapeImages["L"] || "/images/l-shape.svg",
        },
        {
            id: "U",
            title: "مطبخ حرف U",
            description: "الأفضل للمساحات الكبيرة",
            image: shapeImages["U"] || "/images/u-shape.svg",
        },
    ] as const;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 font-heading">ما هو شكل المطبخ الذي تريده؟</h2>
                <p className="text-gray-500">اختر الشكل الأقرب لمطبخك</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {shapes.map((shape) => (
                    <motion.button
                        key={shape.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setKitchenType(shape.id)}
                        className={`relative p-6 rounded-xl border-2 transition-all text-right ${kitchenType === shape.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-primary/50 bg-white"
                            }`}
                    >
                        {kitchenType === shape.id && (
                            <div className="absolute top-4 left-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                                <Check size={14} />
                            </div>
                        )}

                        <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                            {shape.image.startsWith('http') ? (
                                <img src={shape.image} alt={shape.title} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-4xl font-bold">{shape.id === 'straight' ? 'I' : shape.id}</span>
                            )}
                        </div>

                        <h3 className="font-bold text-lg mb-1">{shape.title}</h3>
                        <p className="text-sm text-gray-500">{shape.description}</p>
                    </motion.button>
                ))}
            </div>

            <div className="flex justify-end pt-8">
                <button
                    onClick={nextStep}
                    disabled={!kitchenType}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    التالي
                </button>
            </div>
        </div>
    );
}
