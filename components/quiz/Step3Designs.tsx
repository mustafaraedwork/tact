"use client";

import { useQuizStore } from "@/store/quizStore";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { trackAddToCart } from "@/lib/fbPixelEvents";

export default function Step3Designs() {
    const { selectedDesigns, toggleDesign, nextStep, prevStep } = useQuizStore();
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDesigns = async () => {
            const { data } = await supabase
                .from('quiz_selection_images')
                .select('*')
                .eq('category', 'design')
                .eq('is_active', true)
                .order('display_order');

            if (data) setDesigns(data);
            setLoading(false);
        };
        fetchDesigns();
    }, []);

    // دالة لتتبع اختيار التصميم
    const handleToggleDesign = (id: string) => {
        const design = designs.find(d => d.id === id);
        
        // تتبع فقط عند الإضافة (ليس عند الإلغاء)
        if (!selectedDesigns.includes(id) && selectedDesigns.length < 3) {
            trackAddToCart({
                content_name: design?.title || 'Kitchen Design',
                content_ids: [id],
                content_type: 'product',
            });
        }
        
        // تنفيذ الاختيار/الإلغاء
        toggleDesign(id);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 font-heading">اختر من 1 إلى 3 تصاميم تعجبك</h2>
                <p className="text-gray-500">
                    لقد اخترت {selectedDesigns.length} من 3 تصاميم
                </p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">جاري تحميل التصاميم...</div>
            ) : designs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">لا توجد تصاميم متاحة حالياً</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {designs.map((design) => (
                        <motion.div
                            key={design.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleToggleDesign(design.id)}
                            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                        >
                            <div
                                className={`absolute inset-0 bg-black/20 transition-opacity ${selectedDesigns.includes(design.id) ? "opacity-100 bg-primary/40" : "opacity-0 group-hover:opacity-100"
                                    }`}
                            />

                            {selectedDesigns.includes(design.id) && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center z-10">
                                    <Check size={14} />
                                </div>
                            )}

                            <img
                                src={design.image_url}
                                alt="Kitchen Design"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="flex justify-between pt-8">
                <button onClick={prevStep} className="btn-secondary">
                    السابق
                </button>
                <button
                    onClick={nextStep}
                    disabled={selectedDesigns.length === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    التالي
                </button>
            </div>
        </div>
    );
}