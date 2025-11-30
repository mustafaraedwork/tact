"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-500">
                <span>الخطوة {currentStep} من {totalSteps}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-l from-primary to-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}
