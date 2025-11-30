"use client";

import { useEffect } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/quiz/ProgressBar";
import Step1Shape from "@/components/quiz/Step1Shape";
import Step2Dimensions from "@/components/quiz/Step2Dimensions";
import Step3Designs from "@/components/quiz/Step3Designs";
import Step4Material from "@/components/quiz/Step4Material";
import Step5Calculation from "@/components/quiz/Step5Calculation";
import Step6Contact from "@/components/quiz/Step6Contact";
import { useQuizStore } from "@/store/quizStore";
import { AnimatePresence, motion } from "framer-motion";

export default function CostCalculatorPage() {
    const { currentStep } = useQuizStore();

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentStep]);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Shape />;
            case 2:
                return <Step2Dimensions />;
            case 3:
                return <Step3Designs />;
            case 4:
                return <Step4Material />;
            case 5:
                return <Step5Calculation />;
            case 6:
                return <Step6Contact />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-bg-secondary py-12">
                <div className="container mx-auto px-4">
                    {/* Progress Bar (Hide on Step 5 & 6) */}
                    {currentStep < 5 && (
                        <ProgressBar currentStep={currentStep} totalSteps={6} />
                    )}

                    <div className="max-w-3xl mx-auto">
                        <div className="card bg-white p-6 md:p-10 min-h-[500px] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full"
                                >
                                    {renderStep()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
