"use client";

import { useQuizStore } from "@/store/quizStore";
import { useState, useEffect } from "react";

export default function Step2Dimensions() {
    const { kitchenType, dimensions, setDimensions, nextStep, prevStep } = useQuizStore();
    const [localDimensions, setLocalDimensions] = useState(dimensions);

    useEffect(() => {
        setLocalDimensions(dimensions);
    }, [dimensions]);

    const handleChange = (key: keyof typeof dimensions, value: string) => {
        const numValue = parseFloat(value);
        setLocalDimensions((prev) => ({
            ...prev,
            [key]: isNaN(numValue) ? undefined : numValue,
        }));
    };

    const handleNext = () => {
        setDimensions(localDimensions);
        nextStep();
    };

    const isValid = () => {
        if (kitchenType === "straight") return !!localDimensions.wall1;
        if (kitchenType === "L") return !!localDimensions.wall1 && !!localDimensions.wall2;
        if (kitchenType === "U") return !!localDimensions.wall1 && !!localDimensions.wall2 && !!localDimensions.wall3;
        return false;
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 font-heading">ما هي قياسات مطبخك؟</h2>
                <p className="text-gray-500">أدخل طول الجدران بالمتر (مثال: 3.5)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visual Representation */}
                <div className="bg-gray-100 rounded-xl aspect-square flex items-center justify-center text-gray-400 text-6xl font-bold">
                    {kitchenType === 'straight' ? 'I' : kitchenType}
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            طول الضلع الأول (متر)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={localDimensions.wall1 || ""}
                            onChange={(e) => handleChange("wall1", e.target.value)}
                            className="input"
                            placeholder="0.0"
                        />
                    </div>

                    {(kitchenType === "L" || kitchenType === "U") && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                طول الضلع الثاني (متر)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={localDimensions.wall2 || ""}
                                onChange={(e) => handleChange("wall2", e.target.value)}
                                className="input"
                                placeholder="0.0"
                            />
                        </div>
                    )}

                    {kitchenType === "U" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                طول الضلع الثالث (متر)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={localDimensions.wall3 || ""}
                                onChange={(e) => handleChange("wall3", e.target.value)}
                                className="input"
                                placeholder="0.0"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-8">
                <button onClick={prevStep} className="btn-secondary">
                    السابق
                </button>
                <button
                    onClick={handleNext}
                    disabled={!isValid()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    التالي
                </button>
            </div>
        </div>
    );
}
