"use client";

import { useQuizStore } from "@/store/quizStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calculator, CheckCircle2 } from "lucide-react";

export default function Step5Calculation() {
    const { nextStep } = useQuizStore();
    const [loadingText, setLoadingText] = useState("جاري تحليل اختياراتك...");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const texts = [
            "جاري تحليل اختياراتك...",
            "حساب المساحة الإجمالية...",
            "اختيار أفضل الأسعار لك...",
            "تجهيز العرض الخاص...",
        ];

        let currentIndex = 0;
        const interval = setInterval(() => {
            currentIndex++;
            if (currentIndex < texts.length) {
                setLoadingText(texts[currentIndex]);
            } else {
                clearInterval(interval);
                setIsComplete(true);
                setTimeout(() => {
                    nextStep();
                }, 1500);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [nextStep]);

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-8">
            {!isComplete ? (
                <>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-4 border-gray-200 border-t-primary flex items-center justify-center"
                    >
                        <Calculator className="text-primary" size={40} />
                    </motion.div>

                    <motion.div
                        key={loadingText}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xl font-bold text-gray-700"
                    >
                        {loadingText}
                    </motion.div>
                </>
            ) : (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-success font-heading">
                        تم حساب تكلفة مطبخك بنجاح!
                    </h2>
                    <p className="text-gray-500">
                        أدخل رقم هاتفك لنتواصل معك وإخبارك بالتكلفة مجاناً
                    </p>
                </motion.div>
            )}
        </div>
    );
}
